import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/services/calendario.css";

const CalendarioAcademico = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [eventos, setEventos] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [mostrarPanel, setMostrarPanel] = useState(false);

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
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

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    fetch(`${API_URL}/calendar-events/events`)
      .then((res) => res.json())
      .then((data) => setEventos(data))
      .catch((err) => console.error("Error al cargar eventos:", err));
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setMostrarPanel(false);
    setDiaSeleccionado(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setMostrarPanel(false);
    setDiaSeleccionado(null);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setMostrarPanel(false);
    setDiaSeleccionado(null);
  };

  const hoy = new Date().toDateString();

  const getEventosPorFecha = (fecha) => {
    const fechaISO = fecha.toISOString().split("T")[0];
    return eventos.filter((ev) => ev.start_date === fechaISO);
  };

  const handleDiaClick = (fecha) => {
    const eventosDia = getEventosPorFecha(fecha);
    if (eventosDia.length > 0) {
      setDiaSeleccionado(fecha);
      setMostrarPanel(true);
    }
  };

  const formatearFecha = (fecha) => {
    const dia = fecha.getDate();
    const mes = months[fecha.getMonth()];
    return `${dia} de ${mes}, ${fecha.getFullYear()}`;
  };

  const getTipoColor = (tipo) => {
    const colores = {
      Académico: "#9b0000",
      Evaluación: "#d35400",
      Festivo: "#27ae60",
      Reunión: "#2980b9",
    };
    return colores[tipo] || "#9b0000";
  };

  return (
    <>
      <Header />
      <div className="calendario-page">
        <div className="calendario-wrapper">
          {/* Panel lateral con calendario mini y eventos */}
          <div className={`panel-lateral ${mostrarPanel ? "mostrar" : ""}`}>
            <div className="mini-calendario">
              <div className="mini-header">
                <h3 className="mini-titulo">
                  {months[month]} {year}
                </h3>
              </div>
              <div className="mini-grid">
                {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
                  <div key={i} className="mini-dia-header">
                    {d}
                  </div>
                ))}
                {days.map((day, i) => {
                  if (!day)
                    return <div key={i} className="mini-dia-empty"></div>;
                  const isSelected =
                    diaSeleccionado &&
                    day.toDateString() === diaSeleccionado.toDateString();
                  const isToday = day.toDateString() === hoy;
                  return (
                    <div
                      key={i}
                      className={`mini-dia ${isSelected ? "seleccionado" : ""} ${isToday && !isSelected ? "hoy" : ""}`}
                    >
                      {day.getDate()}
                    </div>
                  );
                })}
              </div>
            </div>

            {diaSeleccionado && (
              <div className="eventos-lista">
                <h3 className="eventos-titulo">Eventos del día</h3>
                <p className="eventos-fecha">
                  {formatearFecha(diaSeleccionado)}
                </p>

                {getEventosPorFecha(diaSeleccionado).map((evento) => (
                  <div key={evento.id} className="evento-card">
                    <div
                      className="evento-indicador"
                      style={{
                        backgroundColor: getTipoColor(evento.type),
                      }}
                    ></div>
                    <div className="evento-content">
                      <h4 className="evento-titulo">{evento.title}</h4>
                      <p className="evento-descripcion">{evento.description}</p>
                      <div className="evento-meta">
                        <span
                          className="evento-tipo"
                          style={{
                            backgroundColor: getTipoColor(evento.type),
                          }}
                        >
                          {evento.type}
                        </span>
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
              <button className="arrow left" onClick={handlePrevMonth}>
                ❮
              </button>
              <h2>
                {months[month]} {year}
              </h2>
              <button className="arrow right" onClick={handleNextMonth}>
                ❯
              </button>
            </div>

            <button className="today-btn" onClick={handleToday}>
              Hoy
            </button>

            <div className="calendar-grid">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(
                (day, i) => (
                  <div key={i} className="calendar-day-header">
                    {day}
                  </div>
                ),
              )}

              {days.map((day, i) => {
                if (!day)
                  return <div key={i} className="calendar-day empty"></div>;

                const eventosDia = getEventosPorFecha(day);
                const isToday = day.toDateString() === hoy;
                const isSelected =
                  diaSeleccionado &&
                  day.toDateString() === diaSeleccionado.toDateString();

                return (
                  <div
                    key={i}
                    className={`calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""} ${eventosDia.length > 0 ? "con-eventos" : ""}`}
                    onClick={() => handleDiaClick(day)}
                  >
                    <span className="day-number">{day.getDate()}</span>

                    {eventosDia.length > 0 && (
                      <div className="puntos-container">
                        {eventosDia.slice(0, 3).map((evento, idx) => (
                          <div
                            key={idx}
                            className="punto"
                            style={{
                              backgroundColor: getTipoColor(evento.tipo_evento),
                            }}
                          ></div>
                        ))}
                        {eventosDia.length > 3 && (
                          <span className="mas-eventos">
                            +{eventosDia.length - 3}
                          </span>
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
