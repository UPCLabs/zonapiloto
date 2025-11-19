import { Link } from "react-router-dom";
import "../styles/components/footer.css";
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
                    <div className="social-icon" title="Facebook"><i class="fi fi-brands-facebook"></i></div>
                    <div className="social-icon" title="Instagram"><i class="fi fi-brands-instagram"></i></div>
                    <div className="social-icon" title="X"><i class="fi fi-brands-twitter-alt-circle"></i></div>
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
                    Desarrollado con{" "}
                    <Link to="/admindash" className="footer-heart">
                        <i class="fi fi-sr-heart"></i>
                    </Link>{" "}
                    para la comunidad UniPiloto
                </p>

            </div>
        </footer>
    );
}

export default Footer;