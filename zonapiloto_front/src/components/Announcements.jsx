import { useState, useEffect } from "react";
import "../styles/components/announcements.css";

function Announcements() {
    const [anuncios, setAnuncios] = useState([]);
    const [imagenesCarrusel, setImagenesCarrusel] = useState([]);
    const [indiceActivo, setIndiceActivo] = useState(0);

    /* 
    Conexión con back para imágenes del carrusel (mendizzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz)
    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_BASE_URL;
        fetch(`${API_URL}/anuncios/imagenes`)
            .then(res => res.json())
            .then(data => setImagenesCarrusel(data))
            .catch(err => console.error("Error al cargar imágenes:", err));
    }, []);
    */

    /* 
    Conexión con back para anuncios de texto (mendizzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz)
    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_BASE_URL;
        fetch(`${API_URL}/anuncios`)
            .then(res => res.json())
            .then(data => setAnuncios(data))
            .catch(err => console.error("Error al cargar anuncios:", err));
    }, []);
    */

    // Ejemplos de imágenes para el carrusel
    useEffect(() => {
        const ejemploImagenes = [
            {
                id: 1,
                url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=400&fit=crop",
                alt: "Concierto Universidad",
                titulo: "Concierto de Fin de Semestre"
            },
            {
                id: 2,
                url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
                alt: "Feria de Ciencias",
                titulo: "Feria de Ciencia y Tecnología"
            },
            {
                id: 3,
                url: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&h=400&fit=crop",
                alt: "Deportes Universidad",
                titulo: "Torneo Interuniversitario"
            },
            {
                id: 4,
                url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop",
                alt: "Conferencia",
                titulo: "Conferencia: IA en Educación"
            }
        ];
        setImagenesCarrusel(ejemploImagenes);
    }, []);

    // Ejemplos de anuncios
    useEffect(() => {
        const ejemploAnuncios = [
            {
                id: 1,
                titulo: "Inscripciones abiertas para el próximo semestre",
                descripcion: "Las inscripciones para el semestre 2025-2 estarán disponibles del 15 al 30 de noviembre. No olvides revisar los requisitos y documentos necesarios.",
                fecha: "2025-11-08",
                tipo: "importante",
                icono: "📚"
            },
            {
                id: 2,
                titulo: "Mantenimiento del sistema",
                descripcion: "El próximo sábado 16 de noviembre realizaremos mantenimiento programado de 2:00 AM a 6:00 AM. Los servicios estarán temporalmente no disponibles.",
                fecha: "2025-11-09",
                tipo: "alerta",
                icono: "🔧"
            },
            {
                id: 3,
                titulo: "Nueva versión de Zona Piloto disponible",
                descripcion: "Hemos actualizado nuestra plataforma con nuevas funcionalidades. Explora las mejoras en el calendario académico y eventos institucionales.",
                fecha: "2025-11-05",
                tipo: "novedad",
                icono: "✨"
            }
        ];
        setAnuncios(ejemploAnuncios);
    }, []);


    useEffect(() => {
        if (imagenesCarrusel.length > 0) {
            const interval = setInterval(() => {
                setIndiceActivo((prev) => (prev + 1) % imagenesCarrusel.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [imagenesCarrusel.length]);

    const irASlide = (indice) => {
        setIndiceActivo(indice);
    };

    const siguiente = () => {
        setIndiceActivo((prev) => (prev + 1) % imagenesCarrusel.length);
    };

    const anterior = () => {
        setIndiceActivo((prev) => (prev - 1 + imagenesCarrusel.length) % imagenesCarrusel.length);
    };

    const getTipoClase = (tipo) => {
        const clases = {
            "importante": "importante",
            "alerta": "alerta",
            "novedad": "novedad",
            "general": "general"
        };
        return clases[tipo] || "general";
    };

    const formatearFecha = (fecha) => {
        const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', opciones);
    };

    return (
        <section className="announcements">
            <div className="announcements-header">
                <div className="announcements-title-container">
                    <span className="announcements-icon"><i class="fi fi-ss-bell"></i></span>
                    <h3 className="announcements-title">Anuncios y Eventos</h3>
                </div>
            </div>


            {imagenesCarrusel.length > 0 && (
                <div className="carousel-container">
                    <div className="carousel-main">
                        {imagenesCarrusel.map((imagen, index) => (
                            <div
                                key={imagen.id}
                                className={`carousel-slide ${index === indiceActivo ? 'active' : ''}`}
                            >
                                <img src={imagen.url} alt={imagen.alt} />
                                <div className="carousel-caption">
                                    <h4>{imagen.titulo}</h4>
                                </div>
                            </div>
                        ))}


                        <button className="carousel-btn prev" onClick={anterior}>
                            ❮
                        </button>
                        <button className="carousel-btn next" onClick={siguiente}>
                            ❯
                        </button>
                    </div>


                    <div className="carousel-indicators">
                        {imagenesCarrusel.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === indiceActivo ? 'active' : ''}`}
                                onClick={() => irASlide(index)}
                            />
                        ))}
                    </div>
                </div>
            )}


            {anuncios.length > 0 && (
                <>
                    <div className="section-divider">
                        <h4 className="section-subtitle">Anuncios Importantes</h4>
                        <span className="announcements-badge">{anuncios.length} {anuncios.length === 1 ? 'anuncio' : 'anuncios'}</span>
                    </div>

                    <div className="announcements-grid">
                        {anuncios.map((anuncio) => (
                            <div
                                key={anuncio.id}
                                className={`announcement-card ${getTipoClase(anuncio.tipo)}`}
                            >
                                <div className="announcement-card-header">
                                    <span className="announcement-emoji">{anuncio.icono}</span>
                                    <span className="announcement-fecha">{formatearFecha(anuncio.fecha)}</span>
                                </div>
                                <h4 className="announcement-card-title">{anuncio.titulo}</h4>
                                <p className="announcement-card-desc">{anuncio.descripcion}</p>
                                <div className={`announcement-tipo-badge ${getTipoClase(anuncio.tipo)}`}>
                                    {anuncio.tipo.toUpperCase()}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {anuncios.length === 0 && imagenesCarrusel.length === 0 && (
                <div className="announcement-empty">
                    <span className="empty-icon">📭</span>
                    <p className="empty-text">No hay anuncios nuevos por el momento</p>
                    <p className="empty-subtext">Te notificaremos cuando haya novedades</p>
                </div>
            )}
        </section>
    );
}

export default Announcements;