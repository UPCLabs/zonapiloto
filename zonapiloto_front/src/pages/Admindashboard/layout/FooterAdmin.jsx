import React from "react";
import "../../../styles/admin_dashboard/layout/footeradmin.css";

const Footer = () => {
    return (
        <footer className="dashboard-footer">
            <p>© 2025 ZonaPiloto - Sistema de Control y Datos</p>
            <div className="footer-links">
                <a href="#ayuda">Ayuda</a>
                <span>•</span>
                <a href="#privacidad">Privacidad</a>
                <span>•</span>
                <a href="#terminos">Términos</a>
            </div>
        </footer>
    );
};

export default Footer;