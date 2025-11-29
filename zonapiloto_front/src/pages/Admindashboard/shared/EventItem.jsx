import React from "react";
import "../../../styles/admin_dashboard/shared/eventitem.css";

const formatLocal = (dateString) => {
    return new Date(dateString + "T00:00:00").toLocaleDateString("es-CO", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "America/Bogota",
    });
};

const getDay = (d) =>
    new Date(d + "T00:00:00").toLocaleDateString("es-CO", { day: "numeric" });

const getMonth = (d) =>
    new Date(d + "T00:00:00")
        .toLocaleDateString("es-CO", { month: "short" })
        .replace(".", "")
        .toUpperCase();

const EventItem = ({
    event,
    openEditModal,
    handleDelete,
    showDescription = false,
    showTypeAndLocation = false,
}) => {
    return (
        <div className="event-item">
            <div className="event-date">
                <span className="day">{getDay(event.start_date)}</span>
                <span className="month">{getMonth(event.start_date)}</span>
            </div>

            <div className="event-details">
                <h4>{event.title}</h4>

                {showDescription && (
                    <>
                        <p>
                            {event.type} - Del {formatLocal(event.start_date)} al{" "}
                            {formatLocal(event.end_date)}
                        </p>
                        <p style={{ fontSize: "0.85rem", color: "#999" }}>
                            {event.description}
                        </p>
                    </>
                )}

                {showTypeAndLocation && (
                    <>
                        <p>
                            <strong>Tipo:</strong> {event.type} |{" "}
                            <strong>Ubicación:</strong> {event.location}
                        </p>
                        <p style={{ fontSize: "0.85rem", color: "#999", marginTop: "8px" }}>
                            Fecha: {formatLocal(event.start_date)}
                        </p>
                        <p style={{ fontSize: "0.85rem", color: "#999", marginTop: "4px" }}>
                            {event.description}
                        </p>
                    </>
                )}
            </div>

            <div className="event-actions">
                <button className="icon-btn edit" onClick={openEditModal}>✏️</button>
                <button className="icon-btn delete" onClick={handleDelete}>🗑️</button>
            </div>
        </div>
    );
};

export default EventItem;
