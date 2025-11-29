import React, { useState, useEffect } from "react";
import { Loader, Plus, Edit, Trash2 } from "lucide-react";
import "../../../styles/admin_dashboard/sections/restaurantsection.css";

const RestaurantSection = () => {
<<<<<<< Updated upstream
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null); // null, 'create', 'edit'
  const [logoPreview, setLogoPreview] = useState(null);
=======
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formMode, setFormMode] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoError, setLogoError] = useState(false);
    const [previewLogoError, setPreviewLogoError] = useState(false);
>>>>>>> Stashed changes

  useEffect(() => {
    fetchOwnRestaurant();
  }, []);

  const fetchOwnRestaurant = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/information/restaurants/own`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

<<<<<<< Updated upstream
      if (response.ok) {
        const data = await response.json();
        setRestaurant(data);
        setFormMode(null);
      } else if (response.status === 404) {
        setRestaurant(null);
        setFormMode("create");
      }
    } catch (error) {
      console.error("Error al cargar restaurante:", error);
    } finally {
      setLoading(false);
=======
            if (response.ok) {
                const data = await response.json();
                setRestaurant(data);
                setFormMode(null);
                setLogoError(false); // Reset error al cargar nuevo restaurante
            } else if (response.status === 404) {
                setRestaurant(null);
                setFormMode('create');
            }
        } catch (error) {
            console.error("Error al cargar restaurante:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUrlChange = (e) => {
        const url = e.target.value;
        if (url && url.trim()) {
            setLogoPreview(url);
            setPreviewLogoError(false); // Reset error cuando cambia la URL
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.target);
            const data = {
                nombre: formData.get("nombre"),
                logo: formData.get("logo"),
                localizacion: formData.get("localizacion"),
                categoria: formData.get("categoria"),
                menuPdfUrl: formData.get("menuPdfUrl"),
            };

            const endpoint = `${API_URL}/information/restaurants`;
            const method = formMode === 'create' ? "POST" : "PUT";

            const response = await fetch(endpoint, {
                method: method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert(`Restaurante ${formMode === 'create' ? 'creado' : 'actualizado'} exitosamente`);
                e.target.reset();
                setLogoPreview(null);
                setPreviewLogoError(false);
                await fetchOwnRestaurant();
            } else {
                const error = await response.json();
                alert("Error: " + (error.message || error.error || "No se pudo guardar el restaurante"));
            }
        } catch (error) {
            console.error("Error al guardar restaurante:", error);
            alert("Error al guardar el restaurante");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !restaurant && formMode !== 'create') {
        return (
            <div className="admin-dashboard-section">
                <div className="admin-loading-state">
                    <Loader className="spinner" size={48} />
                    <p>Cargando información del restaurante...</p>
                </div>
            </div>
        );
>>>>>>> Stashed changes
    }
  };

  const handleLogoUrlChange = (e) => {
    const url = e.target.value;
    if (url && url.trim()) {
      setLogoPreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const data = {
        name: formData.get("nombre"),
        logo: formData.get("logo"),
        location: formData.get("localizacion"),
        categoria: formData.get("categoria"),
        menuUri: formData.get("menuPdfUrl"),
      };

      const endpoint = `${API_URL}/information/restaurants`;
      const method = formMode === "create" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method: method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert(
          `Restaurante ${formMode === "create" ? "creado" : "actualizado"} exitosamente`,
        );
        e.target.reset();
        setLogoPreview(null);
        await fetchOwnRestaurant();
      } else {
        const error = await response.json();
        alert(
          "Error: " +
          (error.message ||
            error.error ||
            "No se pudo guardar el restaurante"),
        );
      }
    } catch (error) {
      console.error("Error al guardar restaurante:", error);
      alert("Error al guardar el restaurante");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !restaurant && formMode !== "create") {
    return (
      <div className="admin-dashboard-section">
        <div className="admin-loading-state">
          <Loader className="spinner" size={48} />
          <p>Cargando información del restaurante...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-section">
      <div className="admin-section-header">
        <h2 className="admin-section-title">
          <span className="admin-title-icon">🍽️</span>
          Mi Restaurante
        </h2>
        <p className="admin-section-subtitle">
          {restaurant
            ? "Gestiona la información de tu restaurante"
            : "Crea tu restaurante y comparte tu menú"}
        </p>
      </div>

      {/* Vista del restaurante existente */}
      {restaurant && formMode !== "edit" && (
        <div className="admin-list-container">
          <div className="restaurant-info-card">
            <div className="restaurant-header-info">
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="restaurant-main-logo"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/100?text=Sin+Logo";
                }}
              />
              <div className="restaurant-details">
                <h3>{restaurant.name}</h3>
                <p className="restaurant-location">📍 {restaurant.location}</p>
                <span className="restaurant-badge">{restaurant.category}</span>
              </div>
            </div>
<<<<<<< Updated upstream

            <div className="restaurant-actions">
              <button
                className="primary-btn"
                onClick={() => {
                  setFormMode("edit");
                  setLogoPreview(restaurant.logo);
                }}
              >
                <Edit size={18} />
                Editar Información
              </button>
            </div>

            {restaurant.menuPdfUrl && (
              <div className="menu-section">
                <h4>Menú Actual:</h4>
                <iframe
                  src={restaurant.menuUri}
                  title={`Menú de ${restaurant.name}`}
                  className="menu-iframe"
                  loading="lazy"
                />
              </div>
=======
            {restaurant && formMode !== 'edit' && (
                <div className="admin-list-container">
                    <div className="restaurant-info-card">
                        <div className="restaurant-header-info">
                            {!logoError ? (
                                <img
                                    src={restaurant.logo}
                                    alt={restaurant.nombre}
                                    className="restaurant-main-logo"
                                    onError={(e) => {
                                        setLogoError(true);
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="restaurant-main-logo logo-error-placeholder">
                                    <span>❌</span>
                                    <small>Logo no disponible</small>
                                </div>
                            )}
                            <div className="restaurant-details">
                                <h3>{restaurant.nombre}</h3>
                                <p className="restaurant-location">📍 {restaurant.localizacion}</p>
                                <span className="restaurant-badge">{restaurant.categoria}</span>
                            </div>
                        </div>

                        <div className="restaurant-actions">
                            <button
                                className="primary-btn"
                                onClick={() => {
                                    setFormMode('edit');
                                    setLogoPreview(restaurant.logo);
                                    setPreviewLogoError(false);
                                }}
                            >
                                <Edit size={18} />
                                Editar Información
                            </button>
                        </div>

                        {restaurant.menuPdfUrl && (
                            <div className="menu-section">
                                <h4>Menú Actual:</h4>
                                <iframe
                                    src={restaurant.menuPdfUrl}
                                    title={`Menú de ${restaurant.nombre}`}
                                    className="menu-iframe"
                                    loading="lazy"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
            {(formMode === 'create' || formMode === 'edit') && (
                <div className="form-container">
                    <div className="form-title">
                        <Plus size={24} />
                        {formMode === 'create' ? 'Crear Restaurante' : 'Editar Restaurante'}
                    </div>

                    <form className="data-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nombre del Restaurante *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    defaultValue={restaurant?.nombre || ""}
                                    placeholder="Ej: La Parrilla del Chef"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Categoría *</label>
                                <select
                                    name="categoria"
                                    defaultValue={restaurant?.categoria || ""}
                                    required
                                >
                                    <option value="">Seleccionar categoría...</option>
                                    <option value="Comida Rápida">Comida Rápida</option>
                                    <option value="Carnes y Parrilla">Carnes y Parrilla</option>
                                    <option value="Comida Japonesa">Comida Japonesa</option>
                                    <option value="Comida Italiana">Comida Italiana</option>
                                    <option value="Comida Mexicana">Comida Mexicana</option>
                                    <option value="Café y Postres">Café y Postres</option>
                                    <option value="Comida Colombiana">Comida Colombiana</option>
                                    <option value="Comida China">Comida China</option>
                                    <option value="Pizzería">Pizzería</option>
                                    <option value="Vegetariano/Vegano">Vegetariano/Vegano</option>
                                    <option value="Mariscos">Mariscos</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Ubicación *</label>
                            <input
                                type="text"
                                name="localizacion"
                                defaultValue={restaurant?.localizacion || ""}
                                placeholder="Ej: Calle 13 #45-67, Soacha Centro"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>URL del Logo *</label>
                            <input
                                type="url"
                                name="logo"
                                defaultValue={restaurant?.logo || ""}
                                placeholder="https://ejemplo.com/logo.jpg"
                                onChange={handleLogoUrlChange}
                                required
                            />
                            <small className="form-help-text">
                                Ingresa la URL de la imagen del logo (debe ser una URL pública accesible)
                            </small>
                        </div>

                        {logoPreview && (
                            <div className="image-preview-container">
                                <label>Vista previa del logo:</label>
                                <div className="image-preview">
                                    {!previewLogoError ? (
                                        <img
                                            src={logoPreview}
                                            alt="Logo preview"
                                            onError={(e) => {
                                                setPreviewLogoError(true);
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="preview-error-message">
                                            <span className="error-icon">⚠️</span>
                                            <p><strong>Error al cargar la imagen</strong></p>
                                            <p>La URL no es válida o no es pública. Por favor verifica que:</p>
                                            <ul>
                                                <li>La URL sea correcta y accesible</li>
                                                <li>La imagen sea pública (no requiera autenticación)</li>
                                                <li>El formato sea válido (jpg, png, etc.)</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label>URL del Menú PDF *</label>
                            <input
                                type="url"
                                name="menuPdfUrl"
                                defaultValue={restaurant?.menuPdfUrl || ""}
                                placeholder="https://drive.google.com/file/d/... o https://canva.com/design/..."
                                required
                            />
                            <small className="form-help-text">
                                Sube tu menú a Google Drive, Canva u otra plataforma y pega el enlace público
                            </small>
                        </div>

                        <div className="form-actions">
                            {formMode === 'edit' && (
                                <button
                                    type="button"
                                    className="admin-secondary-btn"
                                    onClick={() => {
                                        setFormMode(null);
                                        setLogoPreview(null);
                                        setPreviewLogoError(false);
                                    }}
                                >
                                    Cancelar
                                </button>
                            )}
                            <button
                                type="submit"
                                className="admin-submit-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "Guardando..."
                                    : formMode === 'create'
                                        ? "Crear Restaurante"
                                        : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                </div>
>>>>>>> Stashed changes
            )}
          </div>
        </div>
      )}

      {/* Formulario de creación o edición */}
      {(formMode === "create" || formMode === "edit") && (
        <div className="form-container">
          <div className="form-title">
            <Plus size={24} />
            {formMode === "create" ? "Crear Restaurante" : "Editar Restaurante"}
          </div>

          <form className="data-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre del Restaurante *</label>
                <input
                  type="text"
                  name="nombre"
                  defaultValue={restaurant?.name || ""}
                  placeholder="Ej: La Parrilla del Chef"
                  required
                />
              </div>

              <div className="form-group">
                <label>Categoría *</label>
                <select
                  name="categoria"
                  defaultValue={restaurant?.category || ""}
                  required
                >
                  <option value="">Seleccionar categoría...</option>
                  <option value="Comida Rápida">Comida Rápida</option>
                  <option value="Carnes y Parrilla">Carnes y Parrilla</option>
                  <option value="Comida Japonesa">Comida Japonesa</option>
                  <option value="Comida Italiana">Comida Italiana</option>
                  <option value="Comida Mexicana">Comida Mexicana</option>
                  <option value="Café y Postres">Café y Postres</option>
                  <option value="Comida Colombiana">Comida Colombiana</option>
                  <option value="Comida China">Comida China</option>
                  <option value="Pizzería">Pizzería</option>
                  <option value="Vegetariano/Vegano">Vegetariano/Vegano</option>
                  <option value="Mariscos">Mariscos</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Ubicación *</label>
              <input
                type="text"
                name="localizacion"
                defaultValue={restaurant?.location || ""}
                placeholder="Ej: Calle 13 #45-67, Soacha Centro"
                required
              />
            </div>

            <div className="form-group">
              <label>URL del Logo *</label>
              <input
                type="url"
                name="logo"
                defaultValue={restaurant?.logo || ""}
                placeholder="https://ejemplo.com/logo.jpg"
                onChange={handleLogoUrlChange}
                required
              />
              <small className="form-help-text">
                Ingresa la URL de la imagen del logo (debe ser una URL pública
                accesible)
              </small>
            </div>

            {logoPreview && (
              <div className="image-preview-container">
                <label>Vista previa del logo:</label>
                <div className="image-preview">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/200?text=URL+Inválida";
                    }}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>URL del Menú PDF *</label>
              <input
                type="url"
                name="menuPdfUrl"
                defaultValue={restaurant?.menuUri || ""}
                placeholder="https://drive.google.com/file/d/... o https://canva.com/design/..."
                required
              />
              <small className="form-help-text">
                Sube tu menú a Google Drive, Canva u otra plataforma y pega el
                enlace público
              </small>
            </div>

            <div className="form-actions">
              {formMode === "edit" && (
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={() => {
                    setFormMode(null);
                    setLogoPreview(null);
                  }}
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="admin-submit-btn"
                disabled={loading}
              >
                {loading
                  ? "Guardando..."
                  : formMode === "create"
                    ? "Crear Restaurante"
                    : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RestaurantSection;