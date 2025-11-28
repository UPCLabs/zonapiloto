import React from "react";
import SearchBox from "../shared/SearchBox";
import EventItem from "../shared/EventItem";
import "../../../styles/admin_dashboard/sections/calendariosection.css";

const CalendarioSection = ({
    calendarEvents,
    loading,
    searchTerm,
    setSearchTerm,
    handleCreate,
    openEditModal,
    handleDelete,
    filterItems,
    formatDate,
}) => {
    const filteredCalendarEvents = filterItems(calendarEvents, [
        "title",
        "description",
        "type",
    ]);

    return (
        <div className="dashboard-section">
            <div className="section-header">
                <h2 className="section-title">
                    <span className="title-icon">📅</span>
                    Calendario Académico
                </h2>
                <p className="section-subtitle">
                    Gestión de fechas y horarios importantes
                </p>
            </div>

            <div className="form-container">
                <h3 className="form-title">Agregar Fecha Importante</h3>
                <form
                    className="data-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const title = formData.get("title");
                        const data = {
                            title: title.toUpperCase(),
                            description: formData.get("description"),
                            type: formData.get("type"),
                            start_date: formData.get("start_date"),
                            end_date: formData.get("end_date"),
                            url: formData.get("url") || undefined,
                        };
                        handleCreate("/information/calendar-events", data);
                        e.target.reset();
                    }}
                >
                    <div className="form-row">
                        <div className="form-group">
                            <label>Título del Evento *</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Ej: Inicio de clases"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Tipo *</label>
                            <select name="type" required>
                                <option value="">Seleccionar...</option>
                                <option value="ACADEMIC">Académico</option>
                                <option value="EVALUATION">Evaluación</option>
                                <option value="HOLIDAY">Festivo</option>
                                <option value="MEETING">Reunión</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Fecha de Inicio *</label>
                            <input type="date" name="start_date" required />
                        </div>
                        <div className="form-group">
                            <label>Fecha Final *</label>
                            <input type="date" name="end_date" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Descripción *</label>
                        <textarea
                            name="description"
                            rows="3"
                            placeholder="Ej: Primer día del semestre"
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Guardando..." : "Agregar al Calendario"}
                    </button>
                </form>
            </div>

            <div className="list-container">
                <div className="list-header">
                    <h3 className="form-title">Eventos Registrados</h3>
                    <SearchBox
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        placeholder="Buscar eventos..."
                    />
                </div>
                {loading ? (
                    <div className="loading-state">Cargando eventos...</div>
                ) : filteredCalendarEvents.length === 0 ? (
                    <div className="empty-state">No hay eventos registrados</div>
                ) : (
                    <div className="event-list">
                        {filteredCalendarEvents.map((event) => (
                            <EventItem
                                key={event.id}
                                event={event}
                                formatDate={formatDate}
                                openEditModal={() => openEditModal("calendar", event)}
                                handleDelete={() =>
                                    handleDelete("/information/calendar-events", event.id)
                                }
                                showDescription={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarioSection;