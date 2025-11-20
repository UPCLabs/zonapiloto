import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/services/events.css";

const EventosInstitucionales = () => {
  const [eventos, setEventos] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    fetch(`${API_URL}/information/institutional-events`)
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch((err) => console.error("Error al cargar eventos:", err));
  }, []);

  const tiposEvento = [
    "Todos",
    "ACADEMIC",
    "SPORT",
    "CULTURAL",
    "HOLIDAY",
    "MEETING",
  ];

  const getTipoColor = (tipo) => {
    const colores = {
      ACADEMIC: "#9b0000",
      SPORT: "#2980b9",
      CULTURAL: "#8e44ad",
      HOLIDAY: "#27ae60",
      MEETING: "#d35400",
    };
    return colores[tipo] || "#9b0000";
  };

  const eventosFiltrados = eventos.filter((evento) => {
    const cumpleTipo = filtroTipo === "Todos" || evento.type === filtroTipo;
    const cumpleBusqueda =
      evento.title.toLowerCase().includes(busqueda.toLowerCase()) ||
      evento.description.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleTipo && cumpleBusqueda;
  });

  const abrirModal = (evento) => {
    setEventoSeleccionado(evento);
  };

  const cerrarModal = () => {
    setEventoSeleccionado(null);
  };

  return (
    <>
      <Header />
      <div className="eventos-page">
        <div className="eventos-container">
          <div className="eventos-hero">
            <h1 className="eventos-titulo-principal">
              Eventos Institucionales
            </h1>
            <p className="eventos-subtitulo">
              Descubre y participa en las actividades de nuestra comunidad
              universitaria
            </p>
          </div>

          <div className="eventos-controles">
            <div className="buscador-container">
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="buscador-input"
              />
              <span className="buscador-icon">🔍</span>
            </div>

            <div className="filtros-container">
              {tiposEvento.map((tipo) => (
                <button
                  key={tipo}
                  className={`filtro-btn ${filtroTipo === tipo ? "activo" : ""}`}
                  onClick={() => setFiltroTipo(tipo)}
                  style={
                    filtroTipo === tipo
                      ? { backgroundColor: getTipoColor(tipo) }
                      : {}
                  }
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          <div className="eventos-grid">
            {eventosFiltrados.length > 0 ? (
              eventosFiltrados.map((evento) => (
                <div
                  key={evento.id}
                  className="evento-card-institucional"
                  onClick={() => abrirModal(evento)}
                >
                  <div
                    className="evento-header-card"
                    style={{
                      backgroundColor: getTipoColor(evento.type),
                    }}
                  >
                    <span className="evento-tipo-badge">{evento.type}</span>
                  </div>
                  <div className="evento-body-card">
                    <h3 className="evento-titulo-card">{evento.title}</h3>
                    <p className="evento-descripcion-card">
                      {evento.description.length > 120
                        ? evento.description.substring(0, 120) + "..."
                        : evento.description}
                    </p>
                    <div className="evento-info-card">
                      <div className="evento-fecha-card">
                        <span className="icon">
                          <i class="fi fi-ss-calendar"></i>
                        </span>
                        {evento.start_date}
                      </div>
                      {evento.location && (
                        <div className="evento-ubicacion-card">
                          <span className="icon">
                            <i class="fi fi-ss-map-pin"></i>
                          </span>
                          {evento.location}
                        </div>
                      )}
                    </div>
                    <button className="ver-mas-btn">Ver detalles</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-eventos">
                <p>No se encontraron eventos con los filtros seleccionados</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {eventoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={cerrarModal}>
              ✕
            </button>
            <div
              className="modal-header"
              style={{
                backgroundColor: getTipoColor(eventoSeleccionado.type),
              }}
            >
              <span className="modal-tipo-badge">
                {eventoSeleccionado.type}
              </span>
              <h2 className="modal-titulo">{eventoSeleccionado.title}</h2>
            </div>
            <div className="modal-body">
              <div className="modal-info-section">
                <h4>
                  <i class="fi fi-ss-calendar"></i> Fecha
                </h4>
                <p>{eventoSeleccionado.start_date}</p>
              </div>
              {eventoSeleccionado.location && (
                <div className="modal-info-section">
                  <h4>
                    <i class="fi fi-ss-map-pin"></i> Ubicación
                  </h4>
                  <p>{eventoSeleccionado.location}</p>
                </div>
              )}
              <div className="modal-info-section">
                <h4>
                  <i class="fi fi-rs-description-alt"></i> Descripción
                </h4>
                <p>{eventoSeleccionado.description}</p>
              </div>
            </div>
            <div className="modal-footer">
              {eventoSeleccionado?.url && (
                <button
                  className="modal-btn-primary"
                  style={{
                    backgroundColor: getTipoColor(eventoSeleccionado.type),
                  }}
                  onClick={() => window.open(eventoSeleccionado.url, "_blank")}
                >
                  Detalles
                </button>
              )}

              <button className="modal-btn-secondary" onClick={cerrarModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default EventosInstitucionales;
