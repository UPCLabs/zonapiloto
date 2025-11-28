import React, { useState, useEffect } from 'react';
import { Loader, AlertCircle, Search, ChevronRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../styles/services/restaurant.css';

// Mock de datos de ejemplo
const MOCK_RESTAURANTS = [
  {
    id: "1",
    usuarioId: "user_123",
    nombre: "La Parrilla del Chef",
    logo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
    localizacion: "Calle 13 #45-67, Soacha Centro",
    categoria: "Carnes y Parrilla",
    menuPdfUrl: "https://www.canva.com/design/DAG5NrWWGa4/6AOGyaC0bU1ps1Wyv_eO4w/view?embed"
  },
  {
    id: "2",
    usuarioId: "user_456",
    nombre: "Sushi Express Tokyo",
    logo: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400",
    localizacion: "Av. Soacha #23-10, Plaza Mayor",
    categoria: "Comida Japonesa",
    menuPdfUrl: "https://www.canva.com/design/DAG5NrWWGa4/6AOGyaC0bU1ps1Wyv_eO4w/view?embed"
  },
  {
    id: "3",
    usuarioId: "user_789",
    nombre: "Pizzería Bella Napoli",
    logo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    localizacion: "Carrera 7 #12-34, Compartir",
    categoria: "Comida Italiana",
    menuPdfUrl: "https://www.canva.com/design/DAG5NrWWGa4/6AOGyaC0bU1ps1Wyv_eO4w/view?embed"
  },
  {
    id: "4",
    usuarioId: "user_321",
    nombre: "Café & Postres DeliciOso",
    logo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
    localizacion: "Calle 5 #8-20, León XIII",
    categoria: "Café y Postres",
    menuPdfUrl: "https://www.canva.com/design/DAG5NrWWGa4/6AOGyaC0bU1ps1Wyv_eO4w/view?embed"
  },
  {
    id: "5",
    usuarioId: "user_654",
    nombre: "Tacos & Burritos Azteca",
    logo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
    localizacion: "Calle 15 Sur #3-45, San Mateo",
    categoria: "Comida Mexicana",
    menuPdfUrl: "https://www.canva.com/design/DAG5NrWWGa4/6AOGyaC0bU1ps1Wyv_eO4w/view?embed"
  }
];

const Restaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [useMock, setUseMock] = useState(true); // Cambiar a false para usar API real

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      if (useMock) {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500));
        setRestaurants(MOCK_RESTAURANTS);
        setSelectedRestaurant(MOCK_RESTAURANTS[0]); // Seleccionar el primero por defecto
      } else {
        // Usar API real
        const response = await fetch(`https://tu-api.com/api/restaurants`);

        if (!response.ok) throw new Error('Error al cargar los restaurantes');

        const data = await response.json();
        setRestaurants(data);
        if (data.length > 0) {
          setSelectedRestaurant(data[0]);
        }
      }
    } catch (err) {
      setError(err.message);
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
                  <iframe
                    src={selectedRestaurant.menuPdfUrl}
                    title={`Menú de ${selectedRestaurant.nombre}`}
                    className="menu-iframe"
                    loading="lazy"
                  />
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