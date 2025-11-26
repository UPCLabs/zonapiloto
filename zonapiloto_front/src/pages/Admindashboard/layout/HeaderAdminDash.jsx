import React from "react";
import "../../../styles/admin_dashboard/layout/HeaderAdminDash.css";

const Header = ({ menuOpen, setMenuOpen }) => {
    return (
        <header className="dashboard-header">
            <button
                className="menu-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <h1 className="dashboard-title">Sistema de Control y Datos</h1>

            <div className="header-actions">
                <button className="header-btn" title="Buscar">
                    <span>🔍</span>
                </button>
                <button className="header-btn" title="Notificaciones">
                    <span>🔔</span>
                    <span className="notification-badge">3</span>
                </button>
                <button className="header-btn profile-btn" title="Perfil">
                    <span>👤</span>
                </button>
            </div>
        </header>
    );
};

export default Header;