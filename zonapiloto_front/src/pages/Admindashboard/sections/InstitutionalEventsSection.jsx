import React from "react";
import SearchBox from "../shared/SearchBox";
import EventItem from "../shared/EventItem";

const EventosInstitucionalesSection = ({
    institutionalEvents,
    loading,
    searchTerm,
    setSearchTerm,
    handleCreate,
    openEditModal,
    handleDelete,
    filterItems,
    formatDate,
}) => {
    const filteredInstitutionalEvents = filterItems(institutionalEvents, [
        "title",
        "description",
        "location",
        "type",
    ]);

    return (
        <div className="admin-dashboard-section">
            <div className="admin-section-header">
                <h2 className="admin-section-title">
                    <span className="admin-title-icon">🎉</span>
                    Eventos Institucionales
                </h2>
                <p className="admin-section-subtitle">
                    Gestión de eventos y actividades institucionales
                </p>
            </div>

            <div className="admin-form-container">
                <h3 className="admin-form-title">Crear Nuevo Evento</h3>
                <form
                    className="admin-data-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const data = {
                            title: formData.get("title"),
                            description: formData.get("description"),
                            start_date: formData.get("start_date"),
                            type: formData.get("type"),
                            location: formData.get("location"),
                            url: formData.get("url") || undefined,
                        };
                        handleCreate("/information/institutional-events", data);
                        e.target.reset();
                    }}
                >
                    <div className="admin-form-group">
                        <label>Título del Evento *</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Ej: Feria de Ciencia y Tecnología 2025"
                            required
                        />
                    </div>
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label>Fecha *</label>
                            <input type="date" name="start_date" required />
                        </div>
                    </div>
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label>Tipo de evento *</label>
                            <select name="type" required>
                                <option value="">Seleccionar...</option>
                                <option value="ACADEMIC">Académico</option>
                                <option value="SPORT">Deportivo</option>
                                <option value="CULTURAL">Cultural</option>
                                <option value="MEETING">Reunión</option>
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label>Ubicación *</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="Campus Principal - Auditorio Central"
                                required
                            />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>URL (Opcional)</label>
                        <input
                            type="url"
                            name="url"
                            placeholder="https://ejemplo.com"
                        />
                    </div>
                    <div className="admin-form-group">
                        <label>Descripción *</label>
                        <textarea
                            name="description"
                            rows="4"
                            placeholder="Describe el evento en detalle..."
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="admin-submit-btn" disabled={loading}>
                        {loading ? "Guardando..." : "Crear Evento"}
                    </button>
                </form>
            </div>

            <div className="admin-list-container">
                <div className="admin-list-header">
                    <h3 className="admin-form-title">Eventos Programados</h3>
                    <SearchBox
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        placeholder="Buscar eventos..."
                    />
                </div>
                {loading ? (
                    <div className="admin-loading-state">Cargando eventos...</div>
                ) : filteredInstitutionalEvents.length === 0 ? (
                    <div className="admin-empty-state">No hay eventos programados</div>
                ) : (
                    <div className="event-list">
                        {filteredInstitutionalEvents.map((event) => (
                            <EventItem
                                key={event.id}
                                event={event}
                                formatDate={formatDate}
                                openEditModal={() => openEditModal("institutional", event)}
                                handleDelete={() =>
                                    handleDelete("/information/institutional-events", event.id)
                                }
                                showTypeAndLocation={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventosInstitucionalesSection;