import campusMap from "../assets/images/sonoro/campus-map.webp";
import { LEVEL_LABEL, SOURCE_LABEL, formatIndex } from "./labels.js";

const MAP_WIDTH = 1400;
const MAP_HEIGHT = 1309;

function describe(status) {
  const { zone, medianIndex, level, sampleCount, source, minutesAgo } = status;
  if (level === "NO_DATA") {
    return `${zone.name}: sin datos suficientes (${sampleCount} mediciones)`;
  }
  const origin =
    source === "LIVE"
      ? `medido hace ${minutesAgo ?? 0} min`
      : SOURCE_LABEL[source].toLowerCase();
  return `${zone.name}: ${LEVEL_LABEL[level].toLowerCase()}, índice ${formatIndex(medianIndex)}, ${origin}`;
}

/**
 * Official campus map with each pilot zone drawn on its building as a sound
 * source: ring size grows with the index, colour encodes the level, and a
 * solid ring marks a live reading.
 */
function CampusPlan({ zones, selectedZoneId, onSelect }) {
  return (
    <figure className="sonoro-plan">
      <div className="sonoro-plan-stage">
        <img
          src={campusMap}
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          alt=""
          className="sonoro-plan-image"
          decoding="async"
        />
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="sonoro-plan-overlay"
          aria-hidden="true"
        >
          {zones.map(({ zone, medianIndex, level, source }) => {
            if (level === "NO_DATA") return null;
            const r = 4 + ((medianIndex ?? 0) / 100) * 7;
            const ry = r * (MAP_WIDTH / MAP_HEIGHT);
            return (
              <g key={zone.id} className={`plan-rings level-${level.toLowerCase()} ${source === "LIVE" ? "live" : ""}`}>
                <ellipse className="ring outer" cx={zone.mapX} cy={zone.mapY} rx={r * 1.5} ry={ry * 1.5} />
                <ellipse className="ring inner" cx={zone.mapX} cy={zone.mapY} rx={r} ry={ry} />
              </g>
            );
          })}
        </svg>
        <ul className="sonoro-plan-pins" aria-label="Zonas del piloto">
          {zones.map((status) => {
            const { zone, medianIndex, level, source } = status;
            const selected = zone.id === selectedZoneId;
            const description = describe(status);
            return (
              <li key={zone.id} style={{ left: `${zone.mapX}%`, top: `${zone.mapY}%` }}>
                <button
                  type="button"
                  className={`plan-pin level-${level.toLowerCase()} ${selected ? "selected" : ""} ${source === "LIVE" ? "live" : ""}`}
                  aria-pressed={selected}
                  aria-label={description}
                  title={description}
                  onClick={() => onSelect(zone.id)}
                >
                  <span className="code">{zone.code}</span>
                  <span className="value num">{level === "NO_DATA" ? "—" : formatIndex(medianIndex)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <figcaption>
        Mapa oficial «Conoce tu universidad». Selecciona una sede para ver su historial.
      </figcaption>
    </figure>
  );
}

export default CampusPlan;
