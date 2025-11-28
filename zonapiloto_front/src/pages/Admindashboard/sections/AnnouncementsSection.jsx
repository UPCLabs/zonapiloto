import React from "react";
import SearchBox from "../shared/SearchBox";
import DataTable from "../shared/DataTable";
import CarouselGrid from "../shared/CarouselGrid";
import "../../../styles/admin_dashboard/sections/anunciossection.css";

const AnunciosSection = ({
    announcements,
    carouselImages,
    loading,
    searchTerm,
    setSearchTerm,
    handleCreate,
    handleCreatePhotoAnnouncement,
    openEditModal,
    handleDelete,
    filterItems,
    handleFileChange,
    imagePreview,
    API_URL,
}) => {
    const filteredAnnouncements = filterItems(announcements, [
        "title",
        "description",
        "type",
    ]);
    const filteredCarouselImages = filterItems(carouselImages, ["title"]);

    return (
        <div className="admin-dashboard-section">
            <div className="admin-section-header">
                <h2 className="admin-section-title">
                    <span className="admin-title-icon">📢</span>
                    Anuncios - Página Principal
                </h2>
                <p className="admin-section-subtitle">
                    Gestión de anuncios visibles en la página principal
                </p>
            </div>

            <div className="admin-form-container">
                <h3 className="admin-form-title">📝 Anuncios de Texto</h3>
                <form
                    className="admin-data-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const data = {
                            title: formData.get("title"),
                            description: formData.get("description"),
                            date: formData.get("date"),
                            type: formData.get("type"),
                        };
                        handleCreate("/information/advertisements", data);
                        e.target.reset();
                    }}
                >
                    <div className="admin-form-group">
                        <label>Título del Anuncio *</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Ej: Inscripciones abiertas para el próximo semestre"
                            required
                        />
                    </div>
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label>Fecha *</label>
                            <input type="date" name="date" required />
                        </div>
                        <div className="admin-form-group">
                            <label>Tipo *</label>
                            <select name="type" required>
                                <option value="">Seleccionar...</option>
                                <option value="important">Importante</option>
                                <option value="alert">Alerta</option>
                                <option value="news">Novedad</option>
                                <option value="general">General</option>
                            </select>
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Descripción *</label>
                        <textarea
                            name="description"
                            rows="4"
                            placeholder="Describe el anuncio en detalle..."
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="admin-submit-btn" disabled={loading}>
                        {loading ? "Guardando..." : "Publicar Anuncio"}
                    </button>
                </form>
            </div>

            <div className="admin-list-container">
                <div className="admin-list-header">
                    <h3 className="admin-form-title">Anuncios de Texto Publicados</h3>
                    <SearchBox
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        placeholder="Buscar anuncios..."
                    />
                </div>
                {loading ? (
                    <div className="admin-loading-state">Cargando anuncios...</div>
                ) : filteredAnnouncements.length === 0 ? (
                    <div className="admin-empty-state">No hay anuncios publicados</div>
                ) : (
                    <DataTable
                        headers={["Título", "Tipo", "Fecha", "Acciones"]}
                        data={filteredAnnouncements}
                        renderRow={(announcement) => (
                            <>
                                <span
                                    style={{
                                        maxWidth: "300px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {announcement.title}
                                </span>
                                <span
                                    className="role-badge"
                                    style={{
                                        background:
                                            announcement.type === "important"
                                                ? "rgba(255, 136, 0, 0.2)"
                                                : announcement.type === "alert"
                                                    ? "rgba(255, 0, 0, 0.2)"
                                                    : "rgba(0, 136, 255, 0.2)",
                                        color:
                                            announcement.type === "important"
                                                ? "#ffa500"
                                                : announcement.type === "alert"
                                                    ? "#ff0000"
                                                    : "#0088ff",
                                    }}
                                >
                                    {announcement.type}
                                </span>
                                <span>
                                    {new Date(announcement.date).toLocaleDateString("es-ES")}
                                </span>
                                <div className="row-actions">
                                    <button
                                        className="icon-btn edit"
                                        onClick={() => openEditModal("announcement", announcement)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="icon-btn view"
                                        onClick={() =>
                                            alert(
                                                `${announcement.title}\n\n${announcement.description}`
                                            )
                                        }
                                    >
                                        👁️
                                    </button>
                                    <button
                                        className="icon-btn delete"
                                        onClick={() =>
                                            handleDelete("/information/advertisements", announcement.id)
                                        }
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </>
                        )}
                    />
                )}
            </div>

            <div className="admin-form-container" style={{ marginTop: "40px" }}>
                <h3 className="admin-form-title">🖼️ Carrusel de Imágenes</h3>
                <form className="admin-data-form" onSubmit={handleCreatePhotoAnnouncement}>
                    <div className="admin-form-group">
                        <label>Título de la Imagen *</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="Ej: Evento de Graduación 2025"
                            required
                        />
                    </div>
                    <div className="admin-form-group">
                        <label>Seleccionar Imagen *</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                            className="admin-file-input"
                        />
                        <p
                            style={{
                                fontSize: "0.85rem",
                                color: "#999",
                                marginTop: "8px",
                            }}
                        >
                            Formatos: JPG, PNG (Máx. 20MB)
                        </p>
                    </div>
                    {imagePreview && (
                        <div className="admin-image-preview-container">
                            <label>Vista Previa:</label>
                            <div className="admin-image-preview">
                                <img src={imagePreview} alt="Preview" />
                            </div>
                        </div>
                    )}
                    <button type="submit" className="admin-submit-btn" disabled={loading}>
                        {loading ? "Subiendo..." : "Subir Imagen al Carrusel"}
                    </button>
                </form>
            </div>

            <div className="admin-list-container">
                <div className="admin-list-header">
                    <h3 className="admin-form-title">Imágenes del Carrusel</h3>
                    <SearchBox
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        placeholder="Buscar imágenes..."
                    />
                </div>
                {loading ? (
                    <div className="admin-loading-state">Cargando imágenes...</div>
                ) : filteredCarouselImages.length === 0 ? (
                    <div className="admin-empty-state">No hay imágenes en el carrusel</div>
                ) : (
                    <CarouselGrid
                        images={filteredCarouselImages}
                        API_URL={API_URL}
                        openEditModal={openEditModal}
                        handleDelete={handleDelete}
                    />
                )}
            </div>
        </div>
    );
};

export default AnunciosSection;