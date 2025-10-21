import "../styles/header.css";
import logo from "../assets/images/logo_zona_piloto.png";
import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="header">
            <div className="logo">
                <img src={logo} alt="Zona Piloto" />
                <h2>Zona Piloto</h2>
            </div>
            <nav className="nav">
                <Link to="/">Inicio</Link>
                <a href="#">Contacto</a>
            </nav>
        </header>
    );
}

export default Header;
