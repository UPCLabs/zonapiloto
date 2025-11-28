import React from "react";
import "../../../styles/admin_dashboard/sections/addsection.css";

const ConfiguracionSection = () => {
    return (
        <div className="dashboard-section">
            <div className="section-header">
                <h2 className="section-title">
                    <span className="title-icon">⚙️</span>
                    Configuración
                </h2>
                <p className="section-subtitle">Configuración del sistema</p>
            </div>
            <div className="coming-soon">
                <div className="coming-soon-icon">🚧</div>
                <h3>En Desarrollo</h3>
                <p>Esta funcionalidad estará disponible próximamente</p>
            </div>
        </div>
    );
};

export default ConfiguracionSection;