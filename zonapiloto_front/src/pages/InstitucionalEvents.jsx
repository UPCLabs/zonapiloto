import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/events.css";

const EventosInstitucionales = () => {
    const [eventos, setEventos] = useState([]);
    const [filtroTipo, setFiltroTipo] = useState("Todos");
    const [busqueda, setBusqueda] = useState("");
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

    /* 
    Conexión con back (mendizzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz)
    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_BASE_URL;
        fetch(`${API_URL}/eventos`)
            .then(res => res.json())
            .then(data => setEventos(data))
            .catch(err => console.error("Error al cargar eventos:", err));
    }, []);
    */

    // Ejemplos de eventos institucionales
    useEffect(() => {
        const ejemploEventos = [
            {
                id_evento: 1,
                titulo_evento: "Feria de Ciencia y Tecnología 2025",
                descripcion: "Muestra anual de proyectos de investigación estudiantil en las áreas de ciencia, tecnología, ingeniería y matemáticas. Incluye presentaciones, demostraciones en vivo y premiación a los mejores proyectos.",
                fecha_inicio: "2025-11-20",
                fecha_fin: "2025-11-22",
                tipo_evento: "Académico",
                ubicacion: "Campus Principal - Auditorio Central"
            },
            {
                id_evento: 2,
                titulo_evento: "Torneo Interuniversitario de Fútbol",
                descripcion: "Competencia deportiva entre universidades de la región. Participan equipos masculinos y femeninos en diferentes categorías.",
                fecha_inicio: "2025-11-15",
                fecha_fin: "2025-11-15",
                tipo_evento: "Deportivo",
                ubicacion: "Polideportivo Universidad"
            },
            {
                id_evento: 3,
                titulo_evento: "Semana Cultural: Arte y Música",
                descripcion: "Celebración de la diversidad cultural con exposiciones de arte, conciertos, teatro y danza. Participación de artistas locales e internacionales.",
                fecha_inicio: "2025-11-25",
                fecha_fin: "2025-11-29",
                tipo_evento: "Cultural",
                ubicacion: "Múltiples espacios del campus"
            },
            {
                id_evento: 4,
                titulo_evento: "Conferencia: Inteligencia Artificial en la Educación",
                descripcion: "Charla magistral del Dr. Carlos Méndez sobre las aplicaciones de la IA en procesos educativos y su impacto en el futuro del aprendizaje.",
                fecha_inicio: "2025-11-18",
                fecha_fin: "2025-11-18",
                tipo_evento: "Académico",
                ubicacion: "Sala de Conferencias - Edificio B"
            },
            {
                id_evento: 5,
                titulo_evento: "Maratón Universitaria por la Salud",
                descripcion: "Carrera atlética de 10K y 5K abierta a toda la comunidad universitaria. Inscripciones abiertas hasta el 10 de noviembre.",
                fecha_inicio: "2025-11-12",
                fecha_fin: "2025-11-12",
                tipo_evento: "Deportivo",
                ubicacion: "Parque Universitario"
            },
            {
                id_evento: 6,
                titulo_evento: "Festival Gastronómico Internacional",
                descripcion: "Muestra de gastronomía de diferentes países con degustaciones, talleres de cocina y competencias culinarias entre estudiantes.",
                fecha_inicio: "2025-11-30",
                fecha_fin: "2025-12-01",
                tipo_evento: "Cultural",
                ubicacion: "Plaza Central del Campus"
            },
            {
                id_evento: 7,
                titulo_evento: "Simposio de Emprendimiento e Innovación",
                descripcion: "Encuentro con emprendedores exitosos, talleres de desarrollo de ideas de negocio y networking con inversionistas.",
                fecha_inicio: "2025-12-05",
                fecha_fin: "2025-12-06",
                tipo_evento: "Académico",
                ubicacion: "Centro de Innovación"
            },
            {
                id_evento: 8,
                titulo_evento: "Noche de Talentos Universitarios",
                descripcion: "Show de variedades donde estudiantes demuestran sus habilidades artísticas en música, danza, comedia y más.",
                fecha_inicio: "2025-12-08",
                fecha_fin: "2025-12-08",
                tipo_evento: "Cultural",
                ubicacion: "Teatro Universitario"
            }
        ];
        setEventos(ejemploEventos);
    }, []);

    const tiposEvento = ["Todos", "Académico", "Deportivo", "Cultural", "Festivo", "Reunión"];

    const getTipoColor = (tipo) => {
        const colores = {
            "Académico": "#9b0000",
            "Deportivo": "#2980b9",
            "Cultural": "#8e44ad",
            "Festivo": "#27ae60",
            "Reunión": "#d35400",
        };
        return colores[tipo] || "#9b0000";
    };

    const formatearFecha = (fechaInicio, fechaFin) => {
        const inicio = new Date(fechaInicio + 'T00:00:00');
        const fin = new Date(fechaFin + 'T00:00:00');

        const opciones = { day: 'numeric', month: 'long', year: 'numeric' };

        if (fechaInicio === fechaFin) {
            return inicio.toLocaleDateString('es-ES', opciones);
        } else {
            return `${inicio.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} - ${fin.toLocaleDateString('es-ES', opciones)}`;
        }
    };

    const eventosFiltrados = eventos.filter(evento => {
        const cumpleTipo = filtroTipo === "Todos" || evento.tipo_evento === filtroTipo;
        const cumpleBusqueda = evento.titulo_evento.toLowerCase().includes(busqueda.toLowerCase()) ||
            evento.descripcion.toLowerCase().includes(busqueda.toLowerCase());
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
                        <h1 className="eventos-titulo-principal">Eventos Institucionales</h1>
                        <p className="eventos-subtitulo">Descubre y participa en las actividades de nuestra comunidad universitaria</p>
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
                                    className={`filtro-btn ${filtroTipo === tipo ? 'activo' : ''}`}
                                    onClick={() => setFiltroTipo(tipo)}
                                    style={filtroTipo === tipo ? { backgroundColor: getTipoColor(tipo) } : {}}
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
                                    key={evento.id_evento}
                                    className="evento-card-institucional"
                                    onClick={() => abrirModal(evento)}
                                >
                                    <div
                                        className="evento-header-card"
                                        style={{ backgroundColor: getTipoColor(evento.tipo_evento) }}
                                    >
                                        <span className="evento-tipo-badge">{evento.tipo_evento}</span>
                                    </div>
                                    <div className="evento-body-card">
                                        <h3 className="evento-titulo-card">{evento.titulo_evento}</h3>
                                        <p className="evento-descripcion-card">
                                            {evento.descripcion.length > 120
                                                ? evento.descripcion.substring(0, 120) + "..."
                                                : evento.descripcion}
                                        </p>
                                        <div className="evento-info-card">
                                            <div className="evento-fecha-card">
                                                <span className="icon">📅</span>
                                                {formatearFecha(evento.fecha_inicio, evento.fecha_fin)}
                                            </div>
                                            {evento.ubicacion && (
                                                <div className="evento-ubicacion-card">
                                                    <span className="icon">📍</span>
                                                    {evento.ubicacion}
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
                        <button className="modal-close" onClick={cerrarModal}>✕</button>
                        <div
                            className="modal-header"
                            style={{ backgroundColor: getTipoColor(eventoSeleccionado.tipo_evento) }}
                        >
                            <span className="modal-tipo-badge">{eventoSeleccionado.tipo_evento}</span>
                            <h2 className="modal-titulo">{eventoSeleccionado.titulo_evento}</h2>
                        </div>
                        <div className="modal-body">
                            <div className="modal-info-section">
                                <h4>📅 Fecha</h4>
                                <p>{formatearFecha(eventoSeleccionado.fecha_inicio, eventoSeleccionado.fecha_fin)}</p>
                            </div>
                            {eventoSeleccionado.ubicacion && (
                                <div className="modal-info-section">
                                    <h4>📍 Ubicación</h4>
                                    <p>{eventoSeleccionado.ubicacion}</p>
                                </div>
                            )}
                            <div className="modal-info-section">
                                <h4>📋 Descripción</h4>
                                <p>{eventoSeleccionado.descripcion}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="modal-btn-primary"
                                style={{ backgroundColor: getTipoColor(eventoSeleccionado.tipo_evento) }}
                            >
                                Registrarme
                            </button>
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