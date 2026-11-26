import { useCallback, useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CampusPlan from "../../sonoro/CampusPlan.jsx";
import CapturePanel from "../../sonoro/CapturePanel.jsx";
import HistoryPanel from "../../sonoro/HistoryPanel.jsx";
import { sonoroApi } from "../../sonoro/api.js";
import {
  LEVEL_LABEL,
  SLOTS,
  SLOT_HOURS,
  SLOT_LABEL,
  formatIndex,
} from "../../sonoro/labels.js";
import "../../styles/services/sonoro.css";

function RecommendationList({ title, hint, recommendation, emptyText }) {
  const ranked = recommendation?.ranked ?? [];
  return (
    <div className="sonoro-reco">
      <h3>{title}</h3>
      <p className="sonoro-reco-hint">{hint}</p>
      {ranked.length === 0 ? (
        <p className="sonoro-empty">{emptyText}</p>
      ) : (
        <ol>
          {ranked.slice(0, 3).map((status) => (
            <li key={status.zone.id}>
              <span className="name">{status.zone.name}</span>
              <span className={`sonoro-level-tag level-${status.level.toLowerCase()}`}>
                {LEVEL_LABEL[status.level]}
              </span>
              <span className="num">{formatIndex(status.medianIndex)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Sonoro() {
  const [zones, setZones] = useState([]);
  const [overview, setOverview] = useState(null);
  const [slot, setSlot] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [state, setState] = useState("loading");
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [zoneList, data] = await Promise.all([
        sonoroApi.zones(),
        sonoroApi.overview(slot),
      ]);
      setZones(zoneList);
      setOverview(data);
      setSelectedZoneId((current) => current ?? zoneList[0]?.id ?? null);
      setState("ready");
    } catch (e) {
      setError(e.message);
      setState("error");
    }
  }, [slot]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  useEffect(() => {
    document.title = "ZonaPiloto Sonoro";
    return () => {
      document.title = "ZonaPiloto";
    };
  }, []);

  const shownSlot = overview?.slot;
  const isCurrent = shownSlot && shownSlot === overview?.currentSlot;

  return (
    <>
      <Header />
      <main className="sonoro">
        <header className="sonoro-hero">
          <p className="sonoro-eyebrow">Caracterización acústica participativa</p>
          <h1 translate="no">ZonaPiloto Sonoro</h1>
          <p className="sonoro-intro">
            Encuentra dónde estudiar o conversar según cómo suena cada sede, con mediciones de
            10–15 segundos que hace la comunidad desde su teléfono.
          </p>
        </header>

        {state === "loading" && <p className="sonoro-empty">Cargando zonas…</p>}

        {state === "error" && (
          <div className="sonoro-card">
            <p className="sonoro-alert" role="alert">
              {error}
            </p>
            <button type="button" className="sonoro-btn" onClick={load}>
              Reintentar
            </button>
          </div>
        )}

        {state === "ready" && zones.length === 0 && (
          <p className="sonoro-empty">El piloto aún no tiene zonas activas.</p>
        )}

        {state === "ready" && zones.length > 0 && (
          <>
            <div className="sonoro-grid">
              <section className="sonoro-card sonoro-now" aria-labelledby="now-title">
                <div className="sonoro-card-head">
                  <h2 id="now-title">
                    {isCurrent ? "Ahora en el campus" : `Franja: ${SLOT_LABEL[shownSlot]}`}
                  </h2>
                  <div className="sonoro-slots" role="group" aria-label="Franja horaria">
                    {SLOTS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={shownSlot === s}
                        className={shownSlot === s ? "active" : ""}
                        onClick={() => setSlot(s)}
                        title={SLOT_HOURS[s]}
                      >
                        {SLOT_LABEL[s]}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="sonoro-lead">
                  Mediana de los últimos {overview.windowDays} días entre {SLOT_HOURS[shownSlot]}.
                  Los anillos crecen con el ruido.
                </p>

                <CampusPlan
                  zones={overview.zones}
                  selectedZoneId={selectedZoneId}
                  onSelect={setSelectedZoneId}
                />

                <div className="sonoro-legend" role="group" aria-label="Niveles de ruido">
                  <span className="sonoro-level-tag level-quiet">Silenciosa · menos de 35</span>
                  <span className="sonoro-level-tag level-moderate">Moderada · 35 a 60</span>
                  <span className="sonoro-level-tag level-noisy">Ruidosa · 60 o más</span>
                  <span className="sonoro-level-tag level-no_data">
                    Sin datos · menos de {overview.minSamples} mediciones
                  </span>
                </div>

                <div className="sonoro-recos">
                  <RecommendationList
                    title="Para estudiar"
                    hint="Las zonas más silenciosas en esta franja."
                    recommendation={overview.study}
                    emptyText="Todavía no hay zonas tranquilas con suficientes mediciones en esta franja."
                  />
                  <RecommendationList
                    title="Para conversar"
                    hint="Ambiente moderado, sin interrumpir a quien estudia."
                    recommendation={overview.conversation}
                    emptyText="Todavía no hay zonas moderadas con suficientes mediciones en esta franja."
                  />
                </div>
              </section>

              <CapturePanel
                zones={zones}
                zoneId={selectedZoneId}
                onZoneChange={setSelectedZoneId}
                onSubmitted={() => setRefreshKey((k) => k + 1)}
              />
            </div>

            <HistoryPanel
              zones={zones}
              zoneId={selectedZoneId}
              onZoneChange={setSelectedZoneId}
              refreshKey={refreshKey}
            />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Sonoro;
