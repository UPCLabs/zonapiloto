import { useNavigate } from "react-router-dom";
import BackgroundCarousel from "./BackgroundCarousel";
import "../styles/components/hero.css";

function Hero() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <section className="hero-container">
            <BackgroundCarousel />
            <div className="hero-overlay"></div>

            <div className="hero-content">
                <h1 className="hero-title">
                    ¡Bienvenido a <span>ZonaPiloto</span>!
                </h1>
                <p className="hero-subtitle">
                    Tu espacio para conectar, aprender y crecer dentro de la comunidad Unipiloto.
                </p>
            </div>
        </section>
    );
}

export default Hero;