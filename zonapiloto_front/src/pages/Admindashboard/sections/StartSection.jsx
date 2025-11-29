import React from "react";
import "../../../styles/admin_dashboard/sections/startsection.css";

const InicioSection = ({ services, setActiveSection }) => {
    return (
        <div className="admin-dashboard-section">
            <div className="admin-section-header">
                <h2 className="admin-section-title">Panel de Control</h2>
            </div>
            <div className="admin-services-overview">
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