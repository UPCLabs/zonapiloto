import React, { useState, useEffect } from "react";
import { Loader, Edit, Trash2, Search, ExternalLink } from "lucide-react";
import "../../../styles/admin_dashboard/sections/restaurantsasection.css";

const RestaurantSASection = () => {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editModal, setEditModal] = useState(null);
    const [logoError, setLogoError] = useState({});
    const [formData, setFormData] = useState({
        nombre: "",
        categoria: "",
        localizacion: "",
        logo: "",
        menuPdfUrl: "",
    });

    useEffect(() => {
        fetchAllRestaurants();
    }, []);

    useEffect(() => {
        if (editModal) {
            setFormData({
                nombre: editModal.name || "",
                categoria: editModal.category || "",
                localizacion: editModal.location || "",
                logo: editModal.logo || "",
                menuPdfUrl: editModal.menuUri || "",
            });
        }
    }, [editModal]);

    const fetchAllRestaurants = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/information/restaurants/admin`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setRestaurants(data);
            } else {
                console.error("Error al cargar restaurantes");
            }
        } catch (error) {
            console.error("Error al cargar restaurantes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este restaurante?")) return;

        try {
            const response = await fetch(`${API_URL}/information/restaurants/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (response.ok) {
                alert("Restaurante eliminado exitosamente");
                await fetchAllRestaurants();
            } else {
                alert("Error al eliminar el restaurante");
            }
        } catch (error) {
            console.error("Error al eliminar restaurante:", error);
            alert("Error al eliminar el restaurante");
        }
    };

    const handleUpdate = async () => {
        if (!formData.nombre || !formData.categoria || !formData.localizacion ||
            !formData.logo || !formData.menuPdfUrl) {
            alert("Por favor completa todos los campos");
            return;
        }

        setLoading(true);

        try {
            const data = {
                name: formData.nombre,
                logo: formData.logo,
                location: formData.localizacion,
                categoria: formData.categoria,
                menuUri: formData.menuPdfUrl,
            };

            const response = await fetch(
                `${API_URL}/information/restaurants/admin/${editModal.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            if (response.ok) {
                alert("Restaurante actualizado exitosamente");
                setEditModal(null);
                setFormData({
                    nombre: "",
                    categoria: "",
                    localizacion: "",
                    logo: "",
                    menuPdfUrl: "",
                });
                await fetchAllRestaurants();
            } else {
                const error = await response.json();
                alert("Error: " + (error.message || "No se pudo actualizar"));
            }
        } catch (error) {
            console.error("Error al actualizar restaurante:", error);
            alert("Error al actualizar el restaurante");
        } finally {
            setLoading(false);
        }
    };

    const filteredRestaurants = restaurants.filter(
        (restaurant) =>
            restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLogoError = (id) => {
        setLogoError((prev) => ({ ...prev, [id]: true }));
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    if (loading && restaurants.length === 0) {
        return (
            <div className="admin-dashboard-section">
                <div className="admin-loading-state">
                    <Loader className="spinner" size={48} />
                    <p>Cargando restaurantes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-section">
            <div className="admin-section-header">
                <h2 className="admin-section-title">
                    <span className="admin-title-icon">🍽️</span>
                    Gestión de Restaurantes
                </h2>
                <p className="admin-section-subtitle">
                    Administra todos los restaurantes registrados en el sistema
                </p>
            </div>

            <div className="admin-list-container">
                <div className="admin-list-header">
                    <div className="rsa-search-bar">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, ubicación o categoría..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="rsa-count">
                        {filteredRestaurants.length} restaurante(s)
                    </div>
                </div>

                {filteredRestaurants.length === 0 ? (
                    <div className="admin-empty-state">
                        <p>
                            {searchTerm
                                ? "No se encontraron restaurantes con ese criterio"
                                : "No hay restaurantes registrados"}
                        </p>
                    </div>
                ) : (
                    <div className="rsa-restaurants-grid">
                        {filteredRestaurants.map((restaurant) => (
                            <div key={restaurant.id} className="rsa-restaurant-card">
                                <img
                                    src={
                                        logoError[restaurant.id]
                                            ? "https://via.placeholder.com/100?text=Sin+Logo"
                                            : restaurant.logo
                                    }
                                    alt={restaurant.name}
                                    onError={() => handleLogoError(restaurant.id)}
                                    className="rsa-restaurant-logo"
                                />

                                <div className="rsa-restaurant-content">
                                    <div className="rsa-restaurant-header">
                                        <div className="rsa-restaurant-info">
                                            <h3 className="rsa-restaurant-name">{restaurant.name}</h3>
                                            <p className="rsa-restaurant-location">
                                                📍 {restaurant.location}
                                            </p>
                                            <span className="rsa-restaurant-badge">
                                                {restaurant.category}
                                            </span>
                                        </div>

                                        <div className="rsa-restaurant-actions">
                                            <button
                                                className="rsa-btn-edit"
                                                onClick={() => setEditModal(restaurant)}
                                            >
                                                <Edit size={16} />
                                                Editar
                                            </button>
                                            <button
                                                className="rsa-btn-delete"
                                                onClick={() => handleDelete(restaurant.id)}
                                            >
                                                <Trash2 size={16} />
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>

                                    {restaurant.menuUri && (
                                        <div className="rsa-menu-link">
                                            <a
                                                href={restaurant.menuUri}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalLink size={16} />
                                                Ver Menú
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de Edición */}
            {editModal && (
                <div className="rsa-modal-overlay" onClick={() => setEditModal(null)}>
                    <div className="rsa-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="rsa-modal-title">Editar Restaurante</h3>

                        <div className="rsa-form">
                            <div className="rsa-form-group">
                                <label>Nombre del Restaurante *</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                                />
                            </div>

                            <div className="rsa-form-group">
                                <label>Categoría *</label>
                                <select
                                    value={formData.categoria}
                                    onChange={(e) => handleInputChange("categoria", e.target.value)}
                                >
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

                            <div className="rsa-form-group">
                                <label>Ubicación *</label>
                                <input
                                    type="text"
                                    value={formData.localizacion}
                                    onChange={(e) => handleInputChange("localizacion", e.target.value)}
                                />
                            </div>

                            <div className="rsa-form-group">
                                <label>URL del Logo *</label>
                                <input
                                    type="url"
                                    value={formData.logo}
                                    onChange={(e) => handleInputChange("logo", e.target.value)}
                                />
                            </div>

                            <div className="rsa-form-group">
                                <label>URL del Menú PDF *</label>
                                <input
                                    type="url"
                                    value={formData.menuPdfUrl}
                                    onChange={(e) => handleInputChange("menuPdfUrl", e.target.value)}
                                />
                            </div>

                            <div className="rsa-form-actions">
                                <button
                                    className="rsa-btn-cancel"
                                    onClick={() => {
                                        setEditModal(null);
                                        setFormData({
                                            nombre: "",
                                            categoria: "",
                                            localizacion: "",
                                            logo: "",
                                            menuPdfUrl: "",
                                        });
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="rsa-btn-submit"
                                    onClick={handleUpdate}
                                    disabled={loading}
                                >
                                    {loading ? "Guardando..." : "Guardar Cambios"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantSASection;