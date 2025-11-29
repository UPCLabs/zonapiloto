import React from "react";
import SearchBox from "../shared/SearchBox";
import EventItem from "../shared/EventItem";

const CalendarioSection = ({
    calendarEvents,
    loading,
    searchTerm,
    setSearchTerm,
    handleCreate,
    openEditModal,
    handleDelete,
    filterItems,
}) => {
    const filteredCalendarEvents = filterItems(calendarEvents, [
        "title",
        "description",
        "type",
    ]);

    return (
        <div className="admin-dashboard-section">
            <div className="admin-section-header">
                <h2 className="admin-section-title">
                    <span className="admin-title-icon">📅</span>
                    Calendario Académico
                </h2>
                <p className="admin-section-subtitle">
                    Gestión de fechas y horarios importantes
                </p>
            </div>

            <div className="admin-form-container">
                <h3 className="admin-form-title">Agregar Fecha Importante</h3>
                <form
                    className="admin-data-form"
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
                        <div className="admin-form-group">
                            <label>Título del Evento *</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Ej: Inicio de clases"
                                required
                            />
                        </div>
                        <div className="admin-form-group">
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
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label>Fecha de Inicio *</label>
                            <input type="date" name="start_date" required />
                        </div>
                        <div className="admin-form-group">
                            <label>Fecha Final *</label>
                            <input type="date" name="end_date" required />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Descripción *</label>
                        <textarea
                            name="description"
                            rows="3"
                            placeholder="Ej: Primer día del semestre"
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="admin-submit-btn" disabled={loading}>
                        {loading ? "Guardando..." : "Agregar al Calendario"}
                    </button>
                </form>
            </div>

            <div className="admin-list-container">
                <div className="admin-list-header">
                    <h3 className="admin-form-title">Eventos Registrados</h3>
                    <SearchBox
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        placeholder="Buscar eventos..."
                    />
                </div>
                {loading ? (
                    <div className="admin-loading-state">Cargando eventos...</div>
                ) : filteredCalendarEvents.length === 0 ? (
                    <div className="admin-empty-state">No hay eventos registrados</div>
                ) : (
                    <div className="admin-event-list">
                        {filteredCalendarEvents.map((event) => (
                            <EventItem
                                key={event.id}
                                event={event}
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