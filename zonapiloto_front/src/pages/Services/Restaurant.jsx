import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Loader, AlertCircle, Search, ChevronRight, MapPin } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/services/restaurant.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Componente para actualizar la vista del mapa
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 16, { animate: true });
    }
  }, [center, map]);
  return null;
};

const Restaurant = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mapCenter, setMapCenter] = useState([4.5869, -74.1653]); // Bogotá por defecto
  const [geocodedLocation, setGeocodedLocation] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Geocodificar dirección cuando cambia el restaurante seleccionado
  useEffect(() => {
    if (selectedRestaurant?.location) {
      geocodeAddress(selectedRestaurant.location);
    }
  }, [selectedRestaurant]);

  const geocodeAddress = async (address) => {
    try {
      // Usar Nominatim (OpenStreetMap) para geocodificar
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newCenter = [parseFloat(lat), parseFloat(lon)];
        setMapCenter(newCenter);
        setGeocodedLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        // Si no se encuentra, usar ubicación por defecto (Soacha, Colombia)
        setMapCenter([4.5869, -74.2169]);
        setGeocodedLocation(null);
      }
    } catch (err) {
      console.error("Error al geocodificar:", err);
      setMapCenter([4.5869, -74.2169]);
      setGeocodedLocation(null);
    }
  };

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));


      setRestaurants(mockData);

      if (mockData.length > 0) {
        setSelectedRestaurant(mockData[0]);
      }

      const response = await fetch(`${API_URL}/information/restaurants`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar los restaurantes");
      }

      const data = await response.json();
      setRestaurants(data);

      if (data.length > 0) {
        setSelectedRestaurant(data[0]);
      }

    } catch (err) {
      setError(err.message);
      console.error("Error al cargar restaurantes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(searchTerm.toLowerCase()),
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
                    className={`restaurant-item ${selectedRestaurant?.id === restaurant.id ? "active" : ""}`}
                    onClick={() => handleSelectRestaurant(restaurant)}
                  >
                    <img
                      src={restaurant.logo}
                      alt={restaurant.name}
                      className="restaurant-item-logo"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/60?text=Logo";
                      }}
                    />
                    <div className="restaurant-item-info">
                      <h3>{restaurant.name}</h3>
                      <p className="restaurant-item-category">
                        {restaurant.category}
                      </p>
                    </div>
                    <ChevronRight size={20} className="chevron-icon" />
                  </div>
                ))
              )}
            </div>
          </aside>

          {/* Main Content - Menú y Mapa del Restaurante Seleccionado */}
          <section className="restaurant-content">
            {selectedRestaurant ? (
              <>
                <div className="restaurant-header-info">
                  <img
                    src={selectedRestaurant.logo}
                    alt={selectedRestaurant.name}
                    className="restaurant-main-logo"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/100?text=Logo";
                    }}
                  />
                  <div className="restaurant-main-details">
                    <h2>{selectedRestaurant.name}</h2>
                    <p className="restaurant-main-location">
                      📍 {selectedRestaurant.location}
                    </p>
                    <span className="restaurant-badge">
                      {selectedRestaurant.category}
                    </span>
                  </div>
                </div>

                {/* Sección del Mapa */}
                <div className="map-section">
                  <h3 className="map-title">
                    <MapPin size={20} style={{ marginRight: '8px' }} />
                    Ubicación del Restaurante
                  </h3>
                  <div className="map-container">
                    <MapContainer
                      center={mapCenter}
                      zoom={16}
                      style={{ height: "100%", width: "100%", borderRadius: "8px" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {geocodedLocation && (
                        <Marker position={[geocodedLocation.lat, geocodedLocation.lng]}>
                          <Popup>
                            <strong>{selectedRestaurant.name}</strong>
                            <br />
                            {selectedRestaurant.location}
                          </Popup>
                        </Marker>
                      )}
                      <MapUpdater center={mapCenter} />
                    </MapContainer>
                  </div>
                  {!geocodedLocation && (
                    <p className="map-warning">
                      ⚠️ No se pudo geocodificar la dirección exacta
                    </p>
                  )}
                </div>

                {/* Sección del Menú */}
                <div className="menu-section">
                  <h3 className="menu-title">🍽️ Menú del Restaurante</h3>
                  <div className="menu-viewer-container">
                    {selectedRestaurant.menuUri ? (
                      <div className="menu-link-container">
                        <a
                          href={selectedRestaurant.menuUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="open-menu-btn"
                        >
                          Abrir menú en otra pestaña
                        </a>
                      </div>
                    ) : (
                      <div className="no-selection">
                        <AlertCircle size={48} />
                        <p>Este restaurante aún no ha subido su menú</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="no-selection">
                <AlertCircle size={48} />
                <p>Selecciona un restaurante para ver su menú y ubicación</p>
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