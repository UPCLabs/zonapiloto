import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/services/library.css";

import img1 from "../../assets/images/biblioteca/biblioteca1.jpeg";
import img2 from "../../assets/images/biblioteca/biblioteca2.jpeg";
import img3 from "../../assets/images/biblioteca/biblioteca3.jpeg";
import img4 from "../../assets/images/biblioteca/biblioteca4.jpeg";
import img5 from "../../assets/images/biblioteca/biblioteca5.jpeg";

const Biblioteca = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const imagenes = [img1, img2, img3, img4, img5];
  const minSwipeDistance = 50;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning]);

  const goToSlide = (index) => {
    if (!isTransitioning && index !== currentIndex) {
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagenes.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? imagenes.length - 1 : prevIndex - 1,
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div className="biblioteca-page">
      <Header />

      <main className="biblioteca-content">
        <section className="biblioteca-hero">
          <div className="hero-overlay">
            <h1>Biblioteca Universidad Piloto de Colombia</h1>
            <p>Tu centro de conocimiento y aprendizaje</p>
          </div>
        </section>

        <section className="info-section">
          <div className="container">
            <h2>Bienvenido a Nuestra Biblioteca</h2>
            <p className="intro-text">
              La Biblioteca de la Universidad Piloto de Colombia es un espacio
              moderno y dinámico dedicado al apoyo académico e investigativo de
              nuestra comunidad universitaria. Contamos con amplias colecciones
              bibliográficas, recursos digitales y espacios diseñados para el
              estudio individual y colaborativo.
            </p>

            <div className="info-grid">
              <div className="info-card">
                <div className="icon">
                  <i class="fi fi-sc-books"></i>
                </div>
                <h3>Colecciones</h3>
                <p>
                  Más de 50,000 títulos entre libros físicos y digitales en
                  diversas áreas del conocimiento
                </p>
              </div>
              <div className="info-card">
                <div className="icon">
                  <i class="fi fi-ss-laptop"></i>
                </div>
                <h3>Recursos Digitales</h3>
                <p>
                  Acceso a bases de datos especializadas, revistas científicas y
                  e-books
                </p>
              </div>
              <div className="info-card">
                <div className="icon">
                  <i class="fi fi-rr-model-cube-space"></i>
                </div>
                <h3>Espacios de Estudio</h3>
                <p>
                  Salas de lectura, cubículos individuales y espacios
                  colaborativos equipados
                </p>
              </div>
              <div className="info-card">
                <div className="icon">
                  <i class="fi fi-sr-users-alt"></i>
                </div>
                <h3>Atención Personalizada</h3>
                <p>
                  Nuestro equipo está disponible para asesorarte en tus
                  búsquedas de información
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="carousel-section">
          <div className="container">
            <h2>Nuestras Instalaciones</h2>
            <div className="carousel-container">
              <button
                className="carousel-btn prev"
                onClick={prevSlide}
                disabled={isTransitioning}
                aria-label="Imagen anterior"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <div
                className="carousel-wrapper"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {imagenes.map((img, index) => (
                  <div
                    key={index}
                    className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
                    style={{
                      display: index === currentIndex ? "block" : "none",
                    }}
                  >
                    <img
                      src={img}
                      alt={`Instalaciones de la Biblioteca - Vista ${index + 1}`}
                    />
                    <div className="slide-overlay">
                      <span className="slide-number">
                        {index + 1} / {imagenes.length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="carousel-btn next"
                onClick={nextSlide}
                disabled={isTransitioning}
                aria-label="Siguiente imagen"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              <div className="carousel-dots">
                {imagenes.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentIndex ? "active" : ""}`}
                    onClick={() => goToSlide(index)}
                    disabled={isTransitioning}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>

              <div className="carousel-progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${((currentIndex + 1) / imagenes.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="servicios-section">
          <div className="container">
            <h2>Servicios Disponibles</h2>
            <div className="servicios-grid">
              <div className="servicio-item">
                <h3>Préstamo de Material</h3>
                <p>Préstamo interno y externo de material bibliográfico</p>
              </div>
              <div className="servicio-item">
                <h3>Renovación y Reservas</h3>
                <p>Gestiona tus préstamos de manera online</p>
              </div>
              <div className="servicio-item">
                <h3>Búsqueda Especializada</h3>
                <p>Apoyo en búsqueda de información académica</p>
              </div>
              <div className="servicio-item">
                <h3>Formación de Usuarios</h3>
                <p>Talleres sobre uso de recursos y bases de datos</p>
              </div>
            </div>
          </div>
        </section>

        <section className="acceso-section">
          <div className="container">
            <h2>Accede al Portal de la Biblioteca</h2>
            <p className="acceso-desc">
              Consulta nuestro catálogo, reserva materiales y accede a todos los
              recursos digitales disponibles
            </p>
            <a
              href="https://www.unipiloto.edu.co/biblioteca"
              target="_blank"
              rel="noopener noreferrer"
              className="acceso-btn"
            >
              <span className="btn-icon">
                <i class="fi fi-rr-site-alt"></i>
              </span>
              <span>Ingresar a la Biblioteca</span>
              <span className="btn-arrow">→</span>
            </a>
          </div>
        </section>

        <section className="horarios-section">
          <div className="container">
            <h2>Horarios de Atención</h2>
            <div className="horarios-content">
              <div className="horario-item">
                <h3>Lunes a Viernes</h3>
                <p className="horario-time">7:00 AM - 9:00 PM</p>
              </div>
              <div className="horario-item">
                <h3>Sábados</h3>
                <p className="horario-time">8:00 AM - 5:00 PM</p>
              </div>
              <div className="horario-item">
                <h3>Domingos y Festivos</h3>
                <p className="horario-time">Cerrado</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Biblioteca;
