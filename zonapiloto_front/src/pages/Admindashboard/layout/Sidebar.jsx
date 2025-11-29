import React from "react";
import "../../../styles/admin_dashboard/layout/Sidebar.css";

const Sidebar = ({
  menuOpen,
  setMenuOpen,
  username,
  userRole,
  activeSection,
  setActiveSection,
  setSearchTerm,
  handleLogout,
  filteredMenuItems,
}) => {
  return (
    <>
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">S.C.D</div>
          <p className="logo-subtitle">Sistema de Control</p>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            <span>👤</span>
          </div>
          <div className="user-details">
            <h4>{username}</h4>
            <p>
              {userRole === "SUPERADMIN"
                ? "Super Admin"
                : userRole === "ADMIN"
                  ? "Administrador"
                  : "Usuario"}
            </p>
          </div>
          <div className="user-status online"></div>
        </div>

        <nav className="sidebar-menu">
          {filteredMenuItems.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveSection(item.id);
                setMenuOpen(false);
                setSearchTerm("");
              }}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
