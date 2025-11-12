import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/calendario.css";

const CalendarioAcademico = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [eventos, setEventos] = useState([]);
    const [diaSeleccionado, setDiaSeleccionado] = useState(null);
    const [mostrarPanel, setMostrarPanel] = useState(false);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

    /* 
    Conexión con back
    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_BASE_URL;
        fetch(`${API_URL}/eventos`)
            .then(res => res.json())
            .then(data => setEventos(data))
            .catch(err => console.error("Error al cargar eventos:", err));
    }, []);
    */

    // Ejemplo de eventos
    useEffect(() => {
        const ejemploEventos = [
            {
                id_evento: 1,
                titulo_evento: "Inicio de clases segundo semestre",
                descripcion: "Bienvenida académica y reinicio de actividades universitarias.",
                fecha_inicio: "2025-11-07",
                fecha_fin: "2025-11-07",
                tipo_evento: "Académico",
            },
            {
                id_evento: 2,
                titulo_evento: "Entrega de trabajos finales",
                descripcion: "Fecha límite para subir proyectos y documentos de cierre de semestre.",
                fecha_inicio: "2025-11-15",
                fecha_fin: "2025-11-18",
                tipo_evento: "Académico",
            },
            {
                id_evento: 3,
                titulo_evento: "Evaluación parcial",
                descripcion: "Primer examen del semestre.",
                fecha_inicio: "2025-11-15",
                fecha_fin: "2025-11-15",
                tipo_evento: "Evaluación",
            },
            {
                id_evento: 4,
                titulo_evento: "Día festivo",
                descripcion: "No hay clases.",
                fecha_inicio: "2025-11-11",
                fecha_fin: "2025-11-11",
                tipo_evento: "Festivo",
            },
            {
                id_evento: 5,
                titulo_evento: "Semana de exámenes finales",
                descripcion: "Evaluaciones finales de todas las materias.",
                fecha_inicio: "2025-11-24",
                fecha_fin: "2025-11-29",
                tipo_evento: "Evaluación",
            },
        ];
        setEventos(ejemploEventos);
    }, []);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
        setMostrarPanel(false);
        setDiaSeleccionado(null);
        setEventoSeleccionado(null);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
        setMostrarPanel(false);
        setDiaSeleccionado(null);
        setEventoSeleccionado(null);
    };

    const handleToday = () => {
        setCurrentDate(new Date());
        setMostrarPanel(false);
        setDiaSeleccionado(null);
        setEventoSeleccionado(null);
    };

    const hoy = new Date().toDateString();

    // Verificar si una fecha está dentro del rango de un evento
    const estaEnRangoEvento = (fecha, evento) => {
        const fechaDate = new Date(fecha);
        const inicioDate = new Date(evento.fecha_inicio);
        const finDate = new Date(evento.fecha_fin);

        fechaDate.setHours(0, 0, 0, 0);
        inicioDate.setHours(0, 0, 0, 0);
        finDate.setHours(0, 0, 0, 0);

        return fechaDate >= inicioDate && fechaDate <= finDate;
    };

    // Obtener eventos que incluyen una fecha específica (dentro del rango)
    const getEventosPorFecha = (fecha) => {
        const fechaISO = fecha.toISOString().split("T")[0];
        return eventos.filter((ev) => estaEnRangoEvento(fechaISO, ev));
    };

    // Verificar si un día está en el rango del evento seleccionado
    const esDiaEnRangoSeleccionado = (fecha) => {
        if (!eventoSeleccionado) return false;
        const fechaISO = fecha.toISOString().split("T")[0];
        return estaEnRangoEvento(fechaISO, eventoSeleccionado);
    };

    const handleDiaClick = (fecha) => {
        const eventosDia = getEventosPorFecha(fecha);
        setDiaSeleccionado(fecha);
        setMostrarPanel(true);

        // Si hay eventos, seleccionar el primero
        if (eventosDia.length > 0) {
            setEventoSeleccionado(eventosDia[0]);
        } else {
            setEventoSeleccionado(null);
        }
    };

    const handleEventoClick = (evento) => {
        setEventoSeleccionado(evento);
    };

    const formatearFecha = (fecha) => {
        const dia = fecha.getDate();
        const mes = months[fecha.getMonth()];
        return `${dia} de ${mes}, ${fecha.getFullYear()}`;
    };

    const formatearFechaEvento = (fechaStr) => {
        const fecha = new Date(fechaStr + 'T00:00:00');
        const dia = fecha.getDate();
        const mes = months[fecha.getMonth()];
        return `${dia} de ${mes}, ${fecha.getFullYear()}`;
    };

    const getTipoColor = (tipo) => {
        const colores = {
            "Académico": "#9b0000",
            "Evaluación": "#d35400",
            "Festivo": "#27ae60",
            "Reunión": "#2980b9",
        };
        return colores[tipo] || "#9b0000";
    };

    const esEventoMultiDia = (evento) => {
        return evento.fecha_inicio !== evento.fecha_fin;
    };

    return (
        <>
            <Header />
            <div className="calendario-page">
                <div className="calendario-wrapper">
                    {/* Panel lateral con calendario mini y eventos */}
                    <div className={`panel-lateral ${mostrarPanel ? 'mostrar' : ''}`}>
                        <div className="mini-calendario">
                            <div className="mini-header">
                                <h3 className="mini-titulo">{months[month]} {year}</h3>
                            </div>
                            <div className="mini-grid">
                                {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
                                    <div key={i} className="mini-dia-header">{d}</div>
                                ))}
                                {days.map((day, i) => {
                                    if (!day) return <div key={i} className="mini-dia-empty"></div>;
                                    const isSelected = diaSeleccionado && day.toDateString() === diaSeleccionado.toDateString();
                                    const isToday = day.toDateString() === hoy;
                                    const enRango = esDiaEnRangoSeleccionado(day);
                                    return (
                                        <div
                                            key={i}
                                            className={`mini-dia ${isSelected ? 'seleccionado' : ''} ${isToday && !isSelected ? 'hoy' : ''} ${enRango && !isSelected ? 'en-rango' : ''}`}
                                        >
                                            {day.getDate()}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {diaSeleccionado && (
                            <div className="eventos-lista">
                                <h3 className="eventos-titulo">
                                    {getEventosPorFecha(diaSeleccionado).length > 0
                                        ? 'Eventos del día'
                                        : 'Sin eventos'}
                                </h3>
                                <p className="eventos-fecha">{formatearFecha(diaSeleccionado)}</p>

                                {getEventosPorFecha(diaSeleccionado).length === 0 && (
                                    <div className="sin-eventos-mensaje">
                                        <p>📅 No hay eventos programados para este día</p>
                                    </div>
                                )}

                                {getEventosPorFecha(diaSeleccionado).map((evento) => (
                                    <div
                                        key={evento.id_evento}
                                        className={`evento-card ${eventoSeleccionado?.id_evento === evento.id_evento ? 'evento-activo' : ''}`}
                                        onClick={() => handleEventoClick(evento)}
                                    >
                                        <div
                                            className="evento-indicador"
                                            style={{ backgroundColor: getTipoColor(evento.tipo_evento) }}
                                        ></div>
                                        <div className="evento-content">
                                            <h4 className="evento-titulo">{evento.titulo_evento}</h4>
                                            <p className="evento-descripcion">{evento.descripcion}</p>

                                            {/* Mostrar rango de fechas */}
                                            <div className="evento-fechas">
                                                {esEventoMultiDia(evento) ? (
                                                    <>
                                                        <span className="fecha-rango">
                                                            📅 {formatearFechaEvento(evento.fecha_inicio)}
                                                        </span>
                                                        <span className="fecha-separador">→</span>
                                                        <span className="fecha-rango">
                                                            {formatearFechaEvento(evento.fecha_fin)}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="fecha-unica">
                                                        📅 {formatearFechaEvento(evento.fecha_inicio)}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="evento-meta">
                                                <span
                                                    className="evento-tipo"
                                                    style={{ backgroundColor: getTipoColor(evento.tipo_evento) }}
                                                >
                                                    {evento.tipo_evento}
                                                </span>
                                                {esEventoMultiDia(evento) && (
                                                    <span className="evento-duracion">
                                                        {Math.ceil((new Date(evento.fecha_fin) - new Date(evento.fecha_inicio)) / (1000 * 60 * 60 * 24)) + 1} días
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Calendario principal */}
                    <div className="calendar-container">
                        <div className="calendar-header">
                            <button className="arrow left" onClick={handlePrevMonth}>❮</button>
                            <h2>{months[month]} {year}</h2>
                            <button className="arrow right" onClick={handleNextMonth}>❯</button>
                        </div>

                        <button className="today-btn" onClick={handleToday}>Hoy</button>

                        <div className="calendar-grid">
                            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day, i) => (
                                <div key={i} className="calendar-day-header">{day}</div>
                            ))}

                            {days.map((day, i) => {
                                if (!day) return <div key={i} className="calendar-day empty"></div>;

                                const eventosDia = getEventosPorFecha(day);
                                const isToday = day.toDateString() === hoy;
                                const isSelected = diaSeleccionado && day.toDateString() === diaSeleccionado.toDateString();
                                const enRango = esDiaEnRangoSeleccionado(day);

                                return (
                                    <div
                                        key={i}
                                        className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${enRango && !isSelected ? 'en-rango-evento' : ''} ${eventosDia.length > 0 ? 'con-eventos' : ''}`}
                                        onClick={() => handleDiaClick(day)}
                                    >
                                        <span className="day-number">{day.getDate()}</span>

                                        {eventosDia.length > 0 && (
                                            <div className="puntos-container">
                                                {eventosDia.slice(0, 3).map((evento, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="punto"
                                                        style={{ backgroundColor: getTipoColor(evento.tipo_evento) }}
                                                    ></div>
                                                ))}
                                                {eventosDia.length > 3 && (
                                                    <span className="mas-eventos">+{eventosDia.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CalendarioAcademico;