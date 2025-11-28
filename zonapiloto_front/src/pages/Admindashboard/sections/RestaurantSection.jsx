import React, { useState, useEffect } from "react";
import { Loader, AlertCircle, Plus, Edit, Trash2 } from "lucide-react";
import "../../../styles/admin_dashboard/sections/restaurantsection.css";

const RestaurantSection = () => {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedLogo, setSelectedLogo] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [formMode, setFormMode] = useState(null);

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

            if (response.ok) {
                const data = await response.json();
                setRestaurant(data);
                setFormMode(null);
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

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMenuChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedMenu(file);
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

            const endpoint = formMode === 'create'
                ? `${API_URL}/information/restaurants`
                : `${API_URL}/information/restaurants`;

            const response = await fetch(endpoint, {
                method: formMode === 'create' ? "POST" : "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                alert(`Restaurante ${formMode === 'create' ? 'creado' : 'actualizado'} exitosamente`);
                e.target.reset();
                setSelectedLogo(null);
                setSelectedMenu(null);
                setLogoPreview(null);
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

    if (loading) {
        return (
            <div className="dashboard-section">
                <div className="loading-state">
                    <Loader className="spinner" size={48} />
                    <p>Cargando información del restaurante...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-section">
            <div className="section-header">
                <h2 className="section-title">
                    <span className="title-icon">🍽️</span>
                    Mi Restaurante
                </h2>
                <p className="section-subtitle">
                    {restaurant ? "Gestiona la información de tu restaurante" : "Crea tu restaurante"}
                </p>
            </div>

            {/* Información del restaurante existente */}
            {restaurant && formMode !== 'edit' && (
                <div className="list-container">
                    <div className="restaurant-info-card">
                        <div className="restaurant-header-info">
                            <img
                                src={restaurant.logo}
                                alt={restaurant.nombre}
                                className="restaurant-main-logo"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/100?text=Logo';
                                }}
                            />
                            <div className="restaurant-details">
                                <h3>{restaurant.nombre}</h3>
                                <p className="restaurant-location">📍 {restaurant.localizacion}</p>
                                <span className="restaurant-badge">{restaurant.categoria}</span>
                            </div>
                        </div>

                        <div className="restaurant-actions" style={{ marginTop: '20px' }}>
                            <button
                                className="primary-btn"
                                onClick={() => setFormMode('edit')}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <Edit size={18} />
                                Editar Información
                            </button>
                        </div>

                        {restaurant.menuPdfUrl && (
                            <div className="menu-section" style={{ marginTop: '24px' }}>
                                <h4 style={{ marginBottom: '12px', color: '#fff' }}>Menú Actual:</h4>
                                <iframe
                                    src={restaurant.menuPdfUrl}
                                    title={`Menú de ${restaurant.nombre}`}
                                    style={{
                                        width: '100%',
                                        height: '500px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px'
                                    }}
                                    loading="lazy"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Formulario de creación o edición */}
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
                                required
                            />
                            <small style={{ color: '#999', marginTop: '4px', display: 'block' }}>
                                Ingresa la URL de la imagen del logo (debe ser una URL pública)
                            </small>
                        </div>

                        {logoPreview && (
                            <div className="image-preview-container">
                                <label>Vista previa del logo:</label>
                                <div className="image-preview">
                                    <img src={logoPreview} alt="Logo preview" />
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label>URL del Menú PDF *</label>
                            <input
                                type="url"
                                name="menuPdfUrl"
                                defaultValue={restaurant?.menuPdfUrl || ""}
                                placeholder="https://www.canva.com/design/..."
                                required
                            />
                            <small style={{ color: '#999', marginTop: '4px', display: 'block' }}>
                                Sube tu menú a Canva u otra plataforma y pega el enlace de visualización
                            </small>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                            {formMode === 'edit' && (
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={() => {
                                        setFormMode(null);
                                        setLogoPreview(null);
                                        setSelectedLogo(null);
                                        setSelectedMenu(null);
                                    }}
                                >
                                    Cancelar
                                </button>
                            )}
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading ? "Guardando..." : formMode === 'create' ? "Crear Restaurante" : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default RestaurantSection;