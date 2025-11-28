import React from "react";
import "../../../styles/admin_dashboard/shared/eventitem.css";

const EventItem = ({
    event,
    formatDate,
    openEditModal,
    handleDelete,
    showDescription = false,
    showTypeAndLocation = false,
}) => {
    return (
        <div className="event-item">
            <div className="event-date">
                <span className="day">{formatDate(event.start_date).split(" ")[0]}</span>
                <span className="month">{formatDate(event.start_date).split(" ")[1]}</span>
            </div>
            <div className="event-details">
                <h4>{event.title}</h4>
                {showDescription && (
                    <>
                        <p>
                            {event.type} - Del{" "}
                            {new Date(event.start_date).toLocaleDateString("es-ES")} al{" "}
                            {new Date(event.end_date).toLocaleDateString("es-ES")}
                        </p>
                        <p style={{ fontSize: "0.85rem", color: "#999" }}>
                            {event.description}
                        </p>
                    </>
                )}
                {showTypeAndLocation && (
                    <>
                        <p>
                            <strong>Tipo:</strong> {event.type} | <strong>Ubicación:</strong>{" "}
                            {event.location}
                        </p>
                        <p
                            style={{
                                fontSize: "0.85rem",
                                color: "#999",
                                marginTop: "8px",
                            }}
                        >
                            Fecha: {new Date(event.start_date).toLocaleDateString("es-ES")}
                        </p>
                        <p
                            style={{
                                fontSize: "0.85rem",
                                color: "#999",
                                marginTop: "4px",
                            }}
                        >
                            {event.description}
                        </p>
                    </>
                )}
            </div>
            <div className="event-actions">
                <button className="icon-btn edit" onClick={openEditModal}>
                    ✏️
                </button>
                <button className="icon-btn delete" onClick={handleDelete}>
                    🗑️
                </button>
            </div>
        </div>
    );
};

export default EventItem;