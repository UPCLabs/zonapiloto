import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/components/header.css";
import logo from "../assets/images/Logo_zona_piloto.png";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActiveLink("/");
    }
  };

  return (
    <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo-link" onClick={handleLogoClick}>
            <div className="logo-wrapper">
              <img src={logo} alt="ZonaPiloto Logo" className="logo" />
              <div className="logo-glow"></div>
            </div>
            <div className="brand-text">
              <h1 className="site-title">ZonaPiloto</h1>
              <span className="site-subtitle">Universidad Piloto</span>
            </div>
          </Link>
        </div>

        <nav className="header-right">
          {[
            { to: "/", label: "Inicio" },
            { to: "/contacto", label: "Contacto" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${activeLink === link.to ? "active" : ""}`}
              onClick={() => setActiveLink(link.to)}
            >
              <span className="nav-text">{link.label}</span>
              <span className="nav-indicator"></span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
