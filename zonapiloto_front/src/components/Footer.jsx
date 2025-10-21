import { Link } from "react-router-dom";
import "../styles/footer.css";
import logo from "../assets/images/Logo_zona_piloto.png";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-main">
                <img src={logo} alt="ZonaPiloto Logo" className="footer-logo" />
                <p className="footer-rights">
                    ZonaPiloto © 2025 - Todos los derechos reservados
                </p>
            </div>

            <div className="footer-links">
                <Link to="/">Inicio</Link>
                <Link to="/servicios">Servicios</Link>
                <Link to="/banco">Banco de Preguntas</Link>
                <Link to="/contacto">Contacto</Link>
            </div>
        </footer>
    );
}

export default Footer;
