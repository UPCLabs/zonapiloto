import "../styles/header.css";
import logo from "../assets/images/logo_zona_piloto.png";

function Header() {
    return (
        <header className="header">
            <div className="logo">
                <img src={logo} alt="Zona Piloto" />
                <h2>Zona Piloto</h2>
            </div>
            <nav className="nav">
                <a href="#">Inicio</a>
                <a href="#">Mi Perfil</a>
                <a href="#">Contacto</a>
            </nav>
        </header>
    );
}

export default Header;
