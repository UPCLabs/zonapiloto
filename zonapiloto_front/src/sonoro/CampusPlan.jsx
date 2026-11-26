import { LEVEL_LABEL, formatIndex } from "./labels.js";

const HEIGHT = 80;

/**
 * Schematic top-down plan of the campus. Each pilot zone is drawn as a sound
 * source whose rings grow with its median index for the selected time slot.
 */
function CampusPlan({ zones, selectedZoneId, onSelect }) {
  return (
    <figure className="sonoro-plan">
      <svg
        viewBox={`0 0 100 ${HEIGHT}`}
        role="group"
        aria-label="Plano esquemático del campus con las zonas del piloto"
      >
        <rect className="plan-street" x="0" y="0" width="7" height={HEIGHT} />
        <rect className="plan-street" x="0" y={HEIGHT - 7} width="100" height="7" />
        <rect className="plan-street" x="93" y="0" width="7" height={HEIGHT} />
        <rect className="plan-campus" x="10" y="3" width="80" height={HEIGHT - 13} rx="2" />
        <text className="plan-street-label" x="3.5" y="40" transform={`rotate(-90 3.5 40)`}>
          Carrera 8
        </text>
        <text className="plan-street-label" x="50" y={HEIGHT - 2.4}>
          Calle 46
        </text>
        <text className="plan-street-label" x="96.5" y="40" transform={`rotate(90 96.5 40)`}>
          Cra. 13
        </text>

        {zones.map((status) => {
          const { zone, medianIndex, level, sampleCount } = status;
          const x = zone.mapX;
          const y = (zone.mapY / 100) * HEIGHT;
          const intensity = medianIndex ?? 0;
          const radius = 3.2 + (intensity / 100) * 6;
          const selected = zone.id === selectedZoneId;
          const description =
            level === "NO_DATA"
              ? `${zone.name}: sin datos suficientes (${sampleCount} mediciones)`
              : `${zone.name}: ${LEVEL_LABEL[level].toLowerCase()}, índice ${formatIndex(medianIndex)}`;
          return (
            <g
              key={zone.id}
              className={`plan-zone level-${level.toLowerCase()} ${selected ? "selected" : ""}`}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={description}
              onClick={() => onSelect(zone.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(zone.id);
                }
              }}
            >
              <title>{description}</title>
              {level !== "NO_DATA" && (
                <>
                  <circle className="ring outer" cx={x} cy={y} r={radius * 1.9} />
                  <circle className="ring inner" cx={x} cy={y} r={radius * 1.4} />
                </>
              )}
              <circle className="core" cx={x} cy={y} r={radius} />
              <text className="zone-code" x={x} y={y + 1.1}>
                {zone.code}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption>Plano esquemático, no a escala. Selecciona una zona para ver su historial.</figcaption>
    </figure>
  );
}

export default CampusPlan;
