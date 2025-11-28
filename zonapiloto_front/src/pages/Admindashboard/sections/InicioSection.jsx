import React from "react";
import "../../../styles/admin_dashboard/sections/iniciosection.css";

const InicioSection = ({ services, setActiveSection }) => {
    return (
        <div className="dashboard-section">
            <div className="section-header">
                <h2 className="section-title">Panel de Control</h2>
            </div>
            <div className="services-overview">
                <h3 className="subsection-title">Servicios Disponibles</h3>
                <div className="services-grid">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="service-card"
                            onClick={() => setActiveSection(service.id)}
                        >
                            <div className="service-icon">{service.icon}</div>
                            <h4>{service.label}</h4>
                            <p>{service.description}</p>
                            <button className="service-manage-btn">
                                Gestionar →
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InicioSection;