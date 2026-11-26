import { NOISY_FROM, QUIET_BELOW } from "./acoustics.js";
import { formatIndex } from "./labels.js";

/**
 * The index scale with its three bands. The marker shows where a reading
 * falls, so the thresholds are visible instead of implied by colour alone.
 */
function LevelStrip({ index, label = "Índice acústico" }) {
  const hasValue = index !== null && index !== undefined;
  return (
    <div className="sonoro-strip">
      <div
        className="sonoro-strip-track"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={hasValue ? index : undefined}
        aria-valuetext={hasValue ? `${formatIndex(index)} de 100` : "Sin lectura"}
      >
        <span className="band quiet" style={{ width: `${QUIET_BELOW}%` }} />
        <span
          className="band moderate"
          style={{ width: `${NOISY_FROM - QUIET_BELOW}%` }}
        />
        <span className="band noisy" style={{ width: `${100 - NOISY_FROM}%` }} />
        {hasValue && (
          <span className="sonoro-strip-marker" style={{ left: `${index}%` }} />
        )}
      </div>
      <div className="sonoro-strip-scale" aria-hidden="true">
        <span>0</span>
        <span style={{ left: `${QUIET_BELOW}%` }}>{QUIET_BELOW}</span>
        <span style={{ left: `${NOISY_FROM}%` }}>{NOISY_FROM}</span>
        <span className="end">100</span>
      </div>
    </div>
  );
}

export default LevelStrip;
