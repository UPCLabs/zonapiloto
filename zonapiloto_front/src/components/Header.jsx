import { Link } from "react-router-dom";
import "../styles/components/header.css";
import logo from "../assets/images/Logo_zona_piloto.png";

function Header() {
    return (
        <header className="header">
            <div className="header-left">
                <Link to="/" className="logo-link">
                    <img src={logo} alt="ZonaPiloto Logo" className="logo" />
                    <h1 className="site-title">ZonaPiloto</h1>
                </Link>
            </div>

            <nav className="header-right">
                <Link to="/">Inicio</Link>
                <Link to="/banco-preguntas">Banco de Preguntas</Link>
                <Link to="/contacto">Contacto</Link>
            </nav>
        </header>
    );
}

export default Header;
