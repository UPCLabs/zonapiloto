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
            <p className="footer-rights">
              © 2025 Universidad Piloto. Todos los derechos reservados.
            </p>
          </div>
        </div>

        <div className="footer-social">
          <div className="social-icon" title="Facebook">
            <a
              href="https://www.facebook.com/UniPilotoOficial/?locale=es_LA"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fi fi-brands-facebook"></i>
            </a>
          </div>

          <div className="social-icon" title="Instagram">
            <a
              href="https://www.instagram.com/unipiloto?igsh=MWc0dHFpYTQ5eTM3aw=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fi fi-brands-instagram"></i>
            </a>
          </div>

          <div className="social-icon" title="X">
            <a
              href="https://x.com/unipiloto"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fi fi-brands-twitter-alt-circle"></i>
            </a>
          </div>
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
          <Link to="/loggin" className="footer-heart">
            <i class="fi fi-sr-heart"></i>
          </Link>{" "}
          para la comunidad UniPiloto
        </p>
      </div>
    </footer>
  );
}

export default Footer;
