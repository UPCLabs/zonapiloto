/**
 * On-device acoustic measurement. The microphone signal is reduced to three
 * numbers (equivalent level, duration, clipping ratio) inside the browser;
 * no audio is stored, played back, or sent anywhere.
 */

export const CAPTURE_SECONDS = 12;
export const INDEX_FLOOR_DBFS = -70;
export const INDEX_CEILING_DBFS = -10;
export const QUIET_BELOW = 35;
export const NOISY_FROM = 60;

const CLIP_THRESHOLD = 0.99;
const MIN_DBFS = -160;
const TICK_MS = 50;

export function toDbfs(meanSquare) {
  if (!(meanSquare > 0)) return MIN_DBFS;
  return Math.max(MIN_DBFS, 10 * Math.log10(meanSquare));
}

/** Mirrors AcousticIndex.java so the result can be shown before sending. */
export function indexFromDbfs(dbfs) {
  const normalized =
    (dbfs - INDEX_FLOOR_DBFS) / (INDEX_CEILING_DBFS - INDEX_FLOOR_DBFS);
  const clamped = Math.min(1, Math.max(0, normalized));
  return Math.round(clamped * 1000) / 10;
}

export function levelOf(index) {
  if (index === null || index === undefined) return "NO_DATA";
  if (index < QUIET_BELOW) return "QUIET";
  return index < NOISY_FROM ? "MODERATE" : "NOISY";
}

export function captureSupport() {
  if (!window.isSecureContext) return "insecure";
  if (!navigator.mediaDevices?.getUserMedia) return "unsupported";
  if (!(window.AudioContext || window.webkitAudioContext)) return "unsupported";
  return "ok";
}

const round = (value, decimals) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

export async function measure({ seconds = CAPTURE_SECONDS, onProgress, signal } = {}) {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
    },
    video: false,
  });
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const context = new AudioCtx();

  try {
    await context.resume();
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    // Not connected to the destination: nothing is played back.
    context.createMediaStreamSource(stream).connect(analyser);

    const frame = new Float32Array(analyser.fftSize);
    let sumSquares = 0;
    let sampleCount = 0;
    let clipped = 0;
    const start = context.currentTime;

    await new Promise((resolve, reject) => {
      const timer = setInterval(() => {
        analyser.getFloatTimeDomainData(frame);
        let frameSum = 0;
        for (let i = 0; i < frame.length; i++) {
          const x = frame[i];
          frameSum += x * x;
          if (x >= CLIP_THRESHOLD || x <= -CLIP_THRESHOLD) clipped++;
        }
        sumSquares += frameSum;
        sampleCount += frame.length;

        const elapsed = context.currentTime - start;
        onProgress?.({
          elapsed: Math.min(elapsed, seconds),
          index: indexFromDbfs(toDbfs(frameSum / frame.length)),
        });
        if (elapsed >= seconds) {
          clearInterval(timer);
          resolve();
        }
      }, TICK_MS);

      signal?.addEventListener(
        "abort",
        () => {
          clearInterval(timer);
          reject(new DOMException("Medición cancelada", "AbortError"));
        },
        { once: true },
      );
    });

    const leqDbfs = toDbfs(sumSquares / sampleCount);
    return {
      leqDbfs: round(leqDbfs, 2),
      durationSeconds: round(context.currentTime - start, 2),
      clippingRatio: round(clipped / sampleCount, 4),
      index: indexFromDbfs(leqDbfs),
    };
  } finally {
    stream.getTracks().forEach((track) => track.stop());
    await context.close();
  }
}

const DEVICE_KEY = "zonapiloto-sonoro-device";

/** Anonymous per-browser identifier, used by the server only to limit repeated submissions. */
export function anonymousDeviceId() {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID
      ? crypto.randomUUID()
      : Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) =>
          b.toString(16).padStart(2, "0"),
        ).join("");
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}
