import { useEffect, useState } from "react";
import { sonoroApi } from "./api.js";
import {
  DAYS,
  DAY_LABEL,
  LEVEL_LABEL,
  SLOTS,
  SLOT_HOURS,
  SLOT_LABEL,
  formatDate,
  formatIndex,
} from "./labels.js";

const WINDOW_DAYS = 30;

function DailyBars({ daily }) {
  const width = 100;
  const height = 30;
  const step = width / daily.length;
  return (
    <svg
      className="sonoro-daily"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`Mediana diaria del índice en los últimos ${daily.length} días`}
    >
      {daily.map((point, i) => {
        const value = point.medianIndex;
        const barHeight = value === null ? 0.6 : Math.max(0.6, (value / 100) * height);
        return (
          <rect
            key={point.date}
            className={value === null ? "empty" : "filled"}
            x={i * step + step * 0.15}
            y={height - barHeight}
            width={step * 0.7}
            height={barHeight}
          >
            <title>
              {formatDate(point.date)}: {value === null ? "sin mediciones" : `índice ${formatIndex(value)} (${point.sampleCount} mediciones)`}
            </title>
          </rect>
        );
      })}
    </svg>
  );
}

function HistoryPanel({ zones, zoneId, onZoneChange, refreshKey }) {
  const [history, setHistory] = useState(null);
  const [state, setState] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!zoneId) return;
    let cancelled = false;
    setState("loading");
    setError(null);
    sonoroApi
      .history(zoneId, WINDOW_DAYS)
      .then((data) => {
        if (!cancelled) {
          setHistory(data);
          setState("ready");
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
          setState("error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [zoneId, refreshKey]);

  const cell = (day, slot) =>
    history?.matrix.find((c) => c.day === day && c.slot === slot);
  const total = history?.daily.reduce((sum, d) => sum + d.sampleCount, 0) ?? 0;

  return (
    <section className="sonoro-card sonoro-history" aria-labelledby="history-title">
      <div className="sonoro-card-head">
        <h2 id="history-title">Historial por zona</h2>
        <div className="sonoro-field inline">
          <label htmlFor="history-zone">Zona</label>
          <select
            id="history-zone"
            value={zoneId ?? ""}
            onChange={(e) => onZoneChange(Number(e.target.value))}
          >
            <option value="" disabled>
              Elige una zona
            </option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!zoneId && <p className="sonoro-empty">Elige una zona en el plano o en la lista.</p>}
      {state === "loading" && <p className="sonoro-empty">Cargando historial…</p>}
      {state === "error" && (
        <p className="sonoro-alert" role="alert">
          {error}
        </p>
      )}

      {state === "ready" && history && (
        <>
          <p className="sonoro-lead">
            Mediana del índice por día de la semana y franja, últimos {history.windowDays} días
            ({total} mediciones aceptadas).
          </p>
          {total === 0 ? (
            <p className="sonoro-empty">
              Aún no hay mediciones aceptadas en {history.zone.name}. Haz la primera desde
              «Mide una zona».
            </p>
          ) : (
            <>
              <div className="sonoro-table-wrap">
                <table className="sonoro-matrix">
                  <caption className="visually-hidden">
                    Índice acústico de {history.zone.name} por día y franja horaria
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Día</th>
                      {SLOTS.map((slot) => (
                        <th key={slot} scope="col">
                          {SLOT_LABEL[slot]}
                          <span className="hours">{SLOT_HOURS[slot]}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map((day) => (
                      <tr key={day}>
                        <th scope="row">{DAY_LABEL[day]}</th>
                        {SLOTS.map((slot) => {
                          const c = cell(day, slot);
                          const level = c?.level ?? "NO_DATA";
                          return (
                            <td key={slot} className={`level-${level.toLowerCase()}`}>
                              {c && c.sampleCount > 0 ? (
                                <>
                                  <span className="num">{formatIndex(c.medianIndex)}</span>
                                  <span className="meta">
                                    {level === "NO_DATA" ? `${c.sampleCount} med.` : LEVEL_LABEL[level]}
                                  </span>
                                </>
                              ) : (
                                <span className="meta">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="sonoro-footnote">
                Las celdas con menos de 3 mediciones muestran el valor sin clasificarlo.
              </p>
              <h3 className="sonoro-subhead">Mediana diaria</h3>
              <DailyBars daily={history.daily} />
              <div className="sonoro-daily-axis" aria-hidden="true">
                <span>{formatDate(history.daily[0]?.date)}</span>
                <span>{formatDate(history.daily[history.daily.length - 1]?.date)}</span>
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}

export default HistoryPanel;
