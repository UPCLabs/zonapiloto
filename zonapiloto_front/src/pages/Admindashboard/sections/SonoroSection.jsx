import React, { useCallback, useEffect, useState } from "react";
import { sonoroAdminApi } from "../../../sonoro/api.js";
import { REASON_LABEL, formatDate, formatIndex } from "../../../sonoro/labels.js";
import "../../../styles/admin_dashboard/sections/sonorosection.css";

const EMPTY_FORM = { code: "", name: "", description: "", mapX: 50, mapY: 50, active: true };
const TREND_DAYS = 14;
const QUALITY_DAYS = 30;

function Sparkline({ daily }) {
  const points = daily
    .map((p, i) => (p.medianIndex === null ? null : [i, p.medianIndex]))
    .filter(Boolean);
  const width = 100;
  const height = 24;
  const x = (i) => (daily.length <= 1 ? 0 : (i / (daily.length - 1)) * width);
  const y = (v) => height - (v / 100) * height;
  if (points.length < 2) {
    return (
      <span className="sonoro-admin-spark-empty">
        {points.length === 0 ? "Sin mediciones" : "Un solo día con datos"}
      </span>
    );
  }
  return (
    <svg
      className="sonoro-admin-spark"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label={`${points.length} días con mediciones en los últimos ${daily.length}`}
    >
      <polyline
        points={points.map(([i, v]) => `${x(i)},${y(v)}`).join(" ")}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const SonoroSection = () => {
  const [zones, setZones] = useState([]);
  const [trends, setTrends] = useState([]);
  const [quality, setQuality] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [z, t, q] = await Promise.all([
        sonoroAdminApi.zones(),
        sonoroAdminApi.trends(TREND_DAYS),
        sonoroAdminApi.quality(QUALITY_DAYS),
      ]);
      setZones(z);
      setTrends(t);
      setQuality(q);
    } catch (e) {
      setError(e.status === 401 || e.status === 403 ? "Tu sesión no tiene permiso para administrar Sonoro." : e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (zone) => {
    setEditingId(zone.id);
    setForm({
      code: zone.code,
      name: zone.name,
      description: zone.description ?? "",
      mapX: zone.mapX,
      mapY: zone.mapY,
      active: zone.active,
    });
    setNotice(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setNotice(null);
    const payload = { ...form, mapX: Number(form.mapX), mapY: Number(form.mapY) };
    try {
      if (editingId) {
        await sonoroAdminApi.updateZone(editingId, payload);
        setNotice(`Zona ${payload.code.toUpperCase()} actualizada.`);
      } else {
        await sonoroAdminApi.createZone(payload);
        setNotice(`Zona ${payload.code.toUpperCase()} creada.`);
      }
      cancelEdit();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (zone) => {
    setError(null);
    setNotice(null);
    try {
      await sonoroAdminApi.updateZone(zone.id, { ...zone, active: !zone.active });
      setNotice(`Zona ${zone.code} ${zone.active ? "desactivada" : "activada"}.`);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const field = (name) => ({
    value: form[name],
    onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })),
  });

  return (
    <div className="admin-dashboard-section">
      <div className="admin-section-header">
        <h2 className="admin-section-title">
          <span className="admin-title-icon" aria-hidden="true">🔊</span>
          ZonaPiloto Sonoro
        </h2>
        <p className="admin-section-subtitle">
          Zonas del piloto, tendencias y calidad de las mediciones
        </p>
      </div>

      {error && <p className="sonoro-admin-alert" role="alert">{error}</p>}
      {notice && <p className="sonoro-admin-notice" role="status">{notice}</p>}

      {loading && !quality ? (
        <div className="admin-loading-state">Cargando datos de Sonoro…</div>
      ) : (
        <>
          {quality && (
            <div className="admin-list-container">
              <h3 className="admin-form-title">Calidad de las mediciones · últimos {quality.windowDays} días</h3>
              <div className="sonoro-admin-kpis">
                <div><span className="kpi">{quality.total}</span><span>Mediciones recibidas</span></div>
                <div><span className="kpi">{quality.accepted}</span><span>Aceptadas</span></div>
                <div><span className="kpi">{quality.outliers}</span><span>Atípicas</span></div>
                <div><span className="kpi">{quality.rejected}</span><span>Rechazadas</span></div>
                <div><span className="kpi">{formatIndex(quality.acceptanceRate)} %</span><span>Tasa de aceptación</span></div>
                <div><span className="kpi">{quality.distinctDevices}</span><span>Dispositivos anónimos</span></div>
              </div>

              <div className="sonoro-admin-cols">
                <div>
                  <h4>Rechazos por motivo</h4>
                  <ul className="sonoro-admin-reasons">
                    {Object.entries(quality.rejectedByReason).map(([reason, count]) => (
                      <li key={reason}>
                        <span>{REASON_LABEL[reason] ?? reason}</span>
                        <span className="kpi-sm">{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Cobertura por zona</h4>
                  <table className="sonoro-admin-table">
                    <thead>
                      <tr>
                        <th scope="col">Zona</th>
                        <th scope="col">Aceptadas</th>
                        <th scope="col">Atípicas</th>
                        <th scope="col">Rechazadas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quality.zones.map((q) => (
                        <tr key={q.zone.id}>
                          <th scope="row">{q.zone.name}</th>
                          <td>{q.accepted}</td>
                          <td>{q.outliers}</td>
                          <td>{q.rejected}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="admin-list-container">
            <h3 className="admin-form-title">Tendencia diaria · últimos {TREND_DAYS} días</h3>
            <table className="sonoro-admin-table">
              <thead>
                <tr>
                  <th scope="col">Zona</th>
                  <th scope="col">Mediana diaria del índice</th>
                  <th scope="col">Último valor</th>
                </tr>
              </thead>
              <tbody>
                {trends.map((t) => {
                  const last = [...t.daily].reverse().find((p) => p.medianIndex !== null);
                  return (
                    <tr key={t.zone.id}>
                      <th scope="row">{t.zone.name}</th>
                      <td><Sparkline daily={t.daily} /></td>
                      <td>{last ? `${formatIndex(last.medianIndex)} (${formatDate(last.date)})` : "Sin datos"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="admin-form-container">
            <h3 className="admin-form-title">{editingId ? "Editar zona" : "Agregar zona"}</h3>
            <form className="admin-data-form" onSubmit={save}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="zone-code">Código *</label>
                  <input id="zone-code" name="code" autoComplete="off" spellCheck={false} required maxLength={10} pattern="[A-Za-z0-9-]+" placeholder="APR" {...field("code")} />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="zone-name">Nombre *</label>
                  <input id="zone-name" name="name" autoComplete="off" required maxLength={80} placeholder="Sede APR" {...field("name")} />
                </div>
              </div>
              <div className="admin-form-group">
                <label htmlFor="zone-desc">Descripción</label>
                <input id="zone-desc" name="description" autoComplete="off" maxLength={255} placeholder="Qué hay en esta sede" {...field("description")} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="zone-x">Posición horizontal en el plano (0–100) *</label>
                  <input id="zone-x" name="mapX" type="number" inputMode="decimal" required min="0" max="100" step="0.5" {...field("mapX")} />
                </div>
                <div className="admin-form-group">
                  <label htmlFor="zone-y">Posición vertical en el plano (0–100) *</label>
                  <input id="zone-y" name="mapY" type="number" inputMode="decimal" required min="0" max="100" step="0.5" {...field("mapY")} />
                </div>
              </div>
              <div className="sonoro-admin-form-actions">
                <button type="submit" className="admin-submit-btn" disabled={saving}>
                  {saving ? "Guardando…" : editingId ? "Guardar cambios" : "Agregar zona"}
                </button>
                {editingId && (
                  <button type="button" className="admin-secondary-btn" onClick={cancelEdit}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="admin-list-container">
            <h3 className="admin-form-title">Zonas</h3>
            <table className="sonoro-admin-table">
              <thead>
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Estado</th>
                  <th scope="col"><span className="visually-hidden">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {zones.map((z) => (
                  <tr key={z.id}>
                    <th scope="row">{z.code}</th>
                    <td>
                      {z.name}
                      {z.description && <span className="sub">{z.description}</span>}
                    </td>
                    <td>
                      <span className={`sonoro-admin-state ${z.active ? "on" : "off"}`}>
                        {z.active ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="actions">
                      <button type="button" className="admin-secondary-btn sm" onClick={() => startEdit(z)}>
                        Editar
                      </button>
                      <button type="button" className="admin-secondary-btn sm" onClick={() => toggleActive(z)}>
                        {z.active ? "Desactivar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SonoroSection;
