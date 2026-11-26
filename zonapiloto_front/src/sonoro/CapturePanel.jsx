import { useEffect, useRef, useState } from "react";
import { sonoroApi } from "./api.js";
import {
  CAPTURE_SECONDS,
  anonymousDeviceId,
  captureSupport,
  levelOf,
  measure,
} from "./acoustics.js";
import LevelStrip from "./LevelStrip.jsx";
import { LEVEL_LABEL, REASON_LABEL, formatIndex } from "./labels.js";

const SUPPORT_MESSAGE = {
  insecure:
    "La medición necesita una conexión segura. Abre ZonaPiloto con https:// para usar el micrófono.",
  unsupported:
    "Este navegador no permite medir sonido. Prueba con una versión reciente de Chrome, Edge, Firefox o Safari.",
};

function micErrorMessage(error) {
  switch (error?.name) {
    case "NotAllowedError":
    case "SecurityError":
      return "No diste permiso para usar el micrófono. Actívalo en la configuración del sitio y vuelve a medir.";
    case "NotFoundError":
      return "No encontramos un micrófono en este dispositivo.";
    case "NotReadableError":
      return "Otra aplicación está usando el micrófono. Ciérrala y vuelve a medir.";
    default:
      return "No se pudo completar la medición. Vuelve a intentarlo.";
  }
}

function resultMessage(result) {
  if (result.status === "ACCEPTED") {
    return `Medición registrada en ${result.zoneName}. Gracias por aportar.`;
  }
  if (result.status === "OUTLIER") {
    return "Medición registrada, pero es muy distinta a las demás de esta zona y franja, así que no cuenta en el promedio por ahora.";
  }
  return `La medición no se tuvo en cuenta: ${REASON_LABEL[result.rejectionReason]?.toLowerCase() ?? "no cumplió los criterios de calidad"}. Puedes medir otra vez.`;
}

function CapturePanel({ zones, zoneId, onZoneChange, onSubmitted }) {
  const [consent, setConsent] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState({ elapsed: 0, index: null });
  const [localIndex, setLocalIndex] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);
  const support = captureSupport();

  useEffect(() => () => abortRef.current?.abort(), []);

  const busy = phase === "measuring" || phase === "sending";
  const canStart = support === "ok" && consent && zoneId && !busy;

  const start = async () => {
    setError(null);
    setResult(null);
    setLocalIndex(null);
    setProgress({ elapsed: 0, index: null });
    setPhase("measuring");
    const controller = new AbortController();
    abortRef.current = controller;

    let measurement;
    try {
      measurement = await measure({
        signal: controller.signal,
        onProgress: setProgress,
      });
    } catch (e) {
      setPhase("idle");
      if (e?.name !== "AbortError") setError(micErrorMessage(e));
      return;
    }

    setLocalIndex(measurement.index);
    setPhase("sending");
    try {
      const response = await sonoroApi.submitSample({
        zoneId,
        deviceId: anonymousDeviceId(),
        leqDbfs: measurement.leqDbfs,
        durationSeconds: measurement.durationSeconds,
        clippingRatio: measurement.clippingRatio,
      });
      setResult(response);
      setPhase("done");
      onSubmitted?.();
    } catch (e) {
      setPhase("done");
      if (e.status === 429) {
        const minutes = Math.ceil((e.body?.retryAfterSeconds ?? 600) / 60);
        setError(
          `Ya mediste esta zona hace poco. Podrás volver a medirla en ${minutes} min, o mide otra zona.`,
        );
      } else {
        setError(e.message);
      }
    }
  };

  const shownIndex =
    phase === "measuring" ? progress.index : (result?.acousticIndex ?? localIndex);
  const remaining = Math.max(0, Math.ceil(CAPTURE_SECONDS - progress.elapsed));

  return (
    <section className="sonoro-card sonoro-capture" aria-labelledby="capture-title">
      <h2 id="capture-title">Mide una zona</h2>
      <p className="sonoro-lead">
        Quédate quieto donde estás y deja el teléfono destapado durante {CAPTURE_SECONDS} segundos.
      </p>

      {support !== "ok" ? (
        <p className="sonoro-alert" role="alert">
          {SUPPORT_MESSAGE[support]}
        </p>
      ) : (
        <>
          <div className="sonoro-field">
            <label htmlFor="capture-zone">Zona donde estás</label>
            <select
              id="capture-zone"
              value={zoneId ?? ""}
              onChange={(e) => onZoneChange(Number(e.target.value))}
              disabled={busy}
            >
              <option value="" disabled>
                Elige una zona
              </option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} — {z.description}
                </option>
              ))}
            </select>
          </div>

          <div className="sonoro-consent">
            <input
              id="capture-consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={busy}
            />
            <label htmlFor="capture-consent">
              Acepto usar el micrófono para esta medición. El sonido se analiza en mi
              dispositivo y solo se envía el resultado numérico; no se graba ni se
              envía audio.
            </label>
          </div>

          <div className="sonoro-actions">
            {phase === "measuring" ? (
              <button
                type="button"
                className="sonoro-btn secondary"
                onClick={() => abortRef.current?.abort()}
              >
                Cancelar medición
              </button>
            ) : (
              <button
                type="button"
                className="sonoro-btn"
                onClick={start}
                disabled={!canStart}
              >
                {phase === "sending"
                  ? "Enviando resultado…"
                  : phase === "done"
                    ? "Medir otra vez"
                    : `Medir ${CAPTURE_SECONDS} segundos`}
              </button>
            )}
            {!consent && phase === "idle" && (
              <span className="sonoro-hint">Marca la casilla de consentimiento para empezar.</span>
            )}
          </div>

          {(phase !== "idle" || shownIndex !== null) && (
            <div className="sonoro-reading" aria-live="polite">
              {phase === "measuring" && (
                <p className="sonoro-countdown">
                  Midiendo… quedan <strong>{remaining} s</strong>
                </p>
              )}
              <LevelStrip index={shownIndex} />
              {phase !== "measuring" && shownIndex !== null && (
                <p className="sonoro-value">
                  <span className="num">{formatIndex(shownIndex)}</span>
                  <span className={`sonoro-level-tag level-${levelOf(shownIndex).toLowerCase()}`}>
                    {LEVEL_LABEL[levelOf(shownIndex)]}
                  </span>
                </p>
              )}
              {result && <p className="sonoro-result">{resultMessage(result)}</p>}
            </div>
          )}

          {error && (
            <p className="sonoro-alert" role="alert">
              {error}
            </p>
          )}
        </>
      )}

      <details className="sonoro-privacy">
        <summary>¿Qué datos se envían?</summary>
        <ul>
          <li>La zona que elegiste.</li>
          <li>El nivel equivalente calculado en tu dispositivo (un número).</li>
          <li>La duración de la medición y la proporción de saturación del micrófono.</li>
          <li>
            Un identificador anónimo generado en este navegador, que solo sirve para evitar
            mediciones repetidas. No está asociado a tu nombre ni a tu cuenta.
          </li>
        </ul>
        <p>
          El índice es orientativo y relativo al micrófono de cada dispositivo; no reemplaza un
          sonómetro profesional.
        </p>
      </details>
    </section>
  );
}

export default CapturePanel;
