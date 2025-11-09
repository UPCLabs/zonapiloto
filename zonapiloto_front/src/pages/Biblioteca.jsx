import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/biblioteca.css";

const Biblioteca = () => {
    const [currentIndex, setCurrentIndex] = useState(0);


    const imagenes = [
        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80",
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80",
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80",
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
        "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&q=80"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % imagenes.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [imagenes.length]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imagenes.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? imagenes.length - 1 : prevIndex - 1
        );
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
                            La Biblioteca de la Universidad Piloto de Colombia es un espacio moderno y
                            dinámico dedicado al apoyo académico e investigativo de nuestra comunidad
                            universitaria. Contamos con amplias colecciones bibliográficas, recursos
                            digitales y espacios diseñados para el estudio individual y colaborativo.
                        </p>

                        <div className="info-grid">
                            <div className="info-card">
                                <div className="icon">📚</div>
                                <h3>Colecciones</h3>
                                <p>Más de 50,000 títulos entre libros físicos y digitales en diversas áreas del conocimiento</p>
                            </div>
                            <div className="info-card">
                                <div className="icon">💻</div>
                                <h3>Recursos Digitales</h3>
                                <p>Acceso a bases de datos especializadas, revistas científicas y e-books</p>
                            </div>
                            <div className="info-card">
                                <div className="icon">🎯</div>
                                <h3>Espacios de Estudio</h3>
                                <p>Salas de lectura, cubículos individuales y espacios colaborativos equipados</p>
                            </div>
                            <div className="info-card">
                                <div className="icon">👥</div>
                                <h3>Atención Personalizada</h3>
                                <p>Nuestro equipo está disponible para asesorarte en tus búsquedas de información</p>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="carousel-section">
                    <div className="container">
                        <h2>Nuestras Instalaciones</h2>
                        <div className="carousel-container">
                            <button className="carousel-btn prev" onClick={prevSlide}>
                                ❮
                            </button>

                            <div className="carousel-wrapper">
                                <div
                                    className="carousel-track"
                                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                                >
                                    {imagenes.map((img, index) => (
                                        <div key={index} className="carousel-slide">
                                            <img src={img} alt={`Biblioteca ${index + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="carousel-btn next" onClick={nextSlide}>
                                ❯
                            </button>

                            <div className="carousel-dots">
                                {imagenes.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                                        onClick={() => goToSlide(index)}
                                    />
                                ))}
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
                            Consulta nuestro catálogo, reserva materiales y accede a todos los recursos digitales disponibles
                        </p>
                        <a
                            href="https://www.unipiloto.edu.co/biblioteca"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="acceso-btn"
                        >
                            <span className="btn-icon">🌐</span>
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