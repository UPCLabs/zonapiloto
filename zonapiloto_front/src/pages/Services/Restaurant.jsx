import React, { useState, useEffect } from 'react';
import { Loader, AlertCircle, Search, ChevronRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../styles/services/restaurant.css';

const Restaurant = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/information/restaurants`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar los restaurantes');
      }

      const data = await response.json();
      setRestaurants(data);

      if (data.length > 0) {
        setSelectedRestaurant(data[0]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar restaurantes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Header />
        <div className="restaurant-loading">
          <Loader className="spinner" size={48} />
          <p>Cargando restaurantes...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="restaurant-error">
          <AlertCircle size={48} />
          <h2>Error al cargar</h2>
          <p>{error}</p>
          <button onClick={fetchRestaurants} className="retry-btn">
            Reintentar
          </button>
        </div>
        <Footer />
      </>
    );
  }

  if (restaurants.length === 0) {
    return (
      <>
        <Header />
        <main className="restaurant-container">
          <div className="restaurant-error">
            <AlertCircle size={48} />
            <h2>No hay restaurantes disponibles</h2>
            <p>Aún no se han registrado restaurantes en el sistema.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="restaurant-container">
        <h1>Menús de Restaurantes</h1>

        <div className="restaurant-layout">
          {/* Sidebar - Lista de Restaurantes */}
          <aside className="restaurants-sidebar">
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Buscar restaurante..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="restaurants-list">
              {filteredRestaurants.length === 0 ? (
                <p className="no-results">No se encontraron restaurantes</p>
              ) : (
                filteredRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className={`restaurant-item ${selectedRestaurant?.id === restaurant.id ? 'active' : ''}`}
                    onClick={() => handleSelectRestaurant(restaurant)}
                  >
                    <img
                      src={restaurant.logo}
                      alt={restaurant.nombre}
                      className="restaurant-item-logo"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/60?text=Logo';
                      }}
                    />
                    <div className="restaurant-item-info">
                      <h3>{restaurant.nombre}</h3>
                      <p className="restaurant-item-category">{restaurant.categoria}</p>
                    </div>
                    <ChevronRight size={20} className="chevron-icon" />
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* Main Content - Menú del Restaurante Seleccionado */}
          <section className="restaurant-content">
            {selectedRestaurant ? (
              <>
                <div className="restaurant-header-info">
                  <img
                    src={selectedRestaurant.logo}
                    alt={selectedRestaurant.nombre}
                    className="restaurant-main-logo"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100?text=Logo';
                    }}
                  />
                  <div className="restaurant-main-details">
                    <h2>{selectedRestaurant.nombre}</h2>
                    <p className="restaurant-main-location">📍 {selectedRestaurant.localizacion}</p>
                    <span className="restaurant-badge">{selectedRestaurant.categoria}</span>
                  </div>
                </div>

                <div className="menu-viewer-container">
                  {selectedRestaurant.menuPdfUrl ? (
                    <iframe
                      src={selectedRestaurant.menuPdfUrl}
                      title={`Menú de ${selectedRestaurant.nombre}`}
                      className="menu-iframe"
                      loading="lazy"
                    />
                  ) : (
                    <div className="no-selection">
                      <AlertCircle size={48} />
                      <p>Este restaurante aún no ha subido su menú</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="no-selection">
                <AlertCircle size={48} />
                <p>Selecciona un restaurante para ver su menú</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Restaurant;