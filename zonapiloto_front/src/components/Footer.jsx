import { Link } from "react-router-dom";
import "../styles/footer.css";
import logo from "../assets/images/Logo_zona_piloto.png";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-main">
                <div className="footer-brand">
                    <img src={logo} alt="ZonaPiloto Logo" className="footer-logo" />
                    <div className="footer-info">
                        <h3>ZonaPiloto</h3>
                        <p className="footer-rights">© 2025 Universidad Piloto. Todos los derechos reservados.</p>
                    </div>
                </div>

                <div className="footer-social">
                    <div className="social-icon" title="Facebook">📘</div>
                    <div className="social-icon" title="Instagram">📷</div>
                    <div className="social-icon" title="Twitter">🐦</div>
                    <div className="social-icon" title="LinkedIn">💼</div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-links">
                    <Link to="/servicios">Servicios</Link>
                    <Link to="/soporte">Soporte</Link>
                    <Link to="/privacidad">Privacidad</Link>
                    <Link to="/terminos">Términos</Link>
                    <Link to="/contacto">Contacto</Link>
                </div>
                <p className="footer-copyright">
                    Desarrollado con ❤️ para la comunidad UniPiloto
                </p>
            </div>
        </footer>
    );
}

export default Footer;