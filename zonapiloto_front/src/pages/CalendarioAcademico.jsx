import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/calendario.css";

const CalendarioAcademico = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [eventos, setEventos] = useState([]);
    const [hoverEvento, setHoverEvento] = useState(null);
    const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

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
Conexión con back (mendizzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz)
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
                fecha_inicio: "2025-10-07",
                fecha_fin: "2025-10-07",
                tipo_evento: "Académico",
            },
            {
                id_evento: 2,
                titulo_evento: "Entrega de trabajos finales",
                descripcion: "Fecha límite para subir proyectos y documentos de cierre de semestre.",
                fecha_inicio: "2025-10-28",
                fecha_fin: "2025-10-28",
                tipo_evento: "Académico",
            },
        ];
        setEventos(ejemploEventos);
    }, []);

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const handleToday = () => setCurrentDate(new Date());

    const hoy = new Date().toDateString();

    const getEventoPorFecha = (fecha) => {
        const fechaISO = fecha.toISOString().split("T")[0];
        return eventos.filter((ev) => ev.fecha_inicio === fechaISO);
    };


    const handleHover = (evento, e) => {
        const rect = e.target.getBoundingClientRect();
        setHoverEvento(evento);
        setHoverPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
    };

    const handleLeave = () => setHoverEvento(null);

    return (
        <>
            <Header />
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

                        const eventosDia = getEventoPorFecha(day);
                        const isToday = day.toDateString() === hoy;

                        return (
                            <div key={i} className={`calendar-day ${isToday ? "today" : ""}`}>
                                <span className="day-number">{day.getDate()}</span>

                                {eventosDia.length > 0 && (
                                    <div
                                        className="event-title"
                                        onMouseEnter={(e) => handleHover(eventosDia[0], e)}
                                        onMouseLeave={handleLeave}
                                        onClick={(e) => handleHover(eventosDia[0], e)}
                                    >
                                        {eventosDia[0].titulo_evento}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {hoverEvento && (
                <div
                    className="tooltip-flotante"
                    style={{ top: hoverPos.y, left: hoverPos.x }}
                >
                    <h4>{hoverEvento.titulo_evento}</h4>
                    <p>{hoverEvento.descripcion}</p>
                    <small>
                        <b>Tipo:</b> {hoverEvento.tipo_evento}<br />
                        <b>Fecha:</b> {hoverEvento.fecha_inicio}
                    </small>
                </div>
            )}

            <Footer />
        </>
    );
};

export default CalendarioAcademico;
