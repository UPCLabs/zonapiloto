import React, { useState } from "react";
import { Loader, BarChart3, Download, FileText } from "lucide-react";

const GraphicsSection = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleGenerateGraphics = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/report/general`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `graficos-${new Date().toISOString().split("T")[0]}.pdf`;
        document.body.appendChild(link);
        link.click();

        // Limpiar
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setSuccess(true);

        // Limpiar mensaje de éxito después de 5 segundos
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al generar el PDF");
      }
    } catch (err) {
      console.error("Error al generar gráficos:", err);
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-section">
      <div className="admin-section-header">
        <h2 className="admin-section-title">
          <span className="admin-title-icon">📊</span>
          Generación de Gráficos
        </h2>
        <p className="admin-section-subtitle">
          Genera reportes visuales en formato PDF con estadísticas y gráficos
          del sistema
        </p>
      </div>

      <div className="admin-form-container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            padding: "40px 20px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(102, 126, 234, 0.3)",
            }}
          >
            <BarChart3 size={60} color="#fff" />
          </div>

          <div style={{ textAlign: "center", maxWidth: "600px" }}>
            <h3
              style={{
                color: "#fff",
                fontSize: "1.5rem",
                marginBottom: "12px",
                fontWeight: "600",
              }}
            >
              Reportes Estadísticos
            </h3>
            <p
              style={{
                color: "#999",
                fontSize: "1rem",
                lineHeight: "1.6",
              }}
            >
              Genera un documento PDF completo con gráficos y análisis
              detallados de todas las métricas importantes del sistema. El
              reporte incluye estadísticas actualizadas y visualizaciones
              interactivas.
            </p>
          </div>

          {error && (
            <div
              style={{
                width: "100%",
                maxWidth: "500px",
                padding: "16px 20px",
                background: "rgba(255, 82, 82, 0.1)",
                border: "1px solid rgba(255, 82, 82, 0.3)",
                borderRadius: "12px",
                color: "#ff5252",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "0.95rem",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              style={{
                width: "100%",
                maxWidth: "500px",
                padding: "16px 20px",
                background: "rgba(76, 175, 80, 0.1)",
                border: "1px solid rgba(76, 175, 80, 0.3)",
                borderRadius: "12px",
                color: "#4caf50",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                fontSize: "0.95rem",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>✅</span>
              <span>PDF generado exitosamente y descargado</span>
            </div>
          )}

          <button
            className="admin-submit-btn"
            onClick={handleGenerateGraphics}
            disabled={loading}
            style={{
              minWidth: "250px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              fontSize: "1.05rem",
              padding: "16px 32px",
            }}
          >
            {loading ? (
              <>
                <Loader
                  className="spinner"
                  size={20}
                  style={{
                    animation: "spin 1s linear infinite",
                  }}
                />
                Generando PDF...
              </>
            ) : (
              <>
                <Download size={20} />
                Generar Gráficos
              </>
            )}
          </button>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              width: "100%",
              maxWidth: "700px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                padding: "20px",
                background: "rgba(102, 126, 234, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(102, 126, 234, 0.2)",
                textAlign: "center",
              }}
            >
              <FileText
                size={32}
                color="#667eea"
                style={{ marginBottom: "12px" }}
              />
              <div
                style={{ color: "#fff", fontSize: "0.9rem", fontWeight: "600" }}
              >
                Formato
              </div>
              <div
                style={{ color: "#999", fontSize: "0.85rem", marginTop: "4px" }}
              >
                PDF de alta calidad
              </div>
            </div>

            <div
              style={{
                padding: "20px",
                background: "rgba(118, 75, 162, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(118, 75, 162, 0.2)",
                textAlign: "center",
              }}
            >
              <BarChart3
                size={32}
                color="#764ba2"
                style={{ marginBottom: "12px" }}
              />
              <div
                style={{ color: "#fff", fontSize: "0.9rem", fontWeight: "600" }}
              >
                Contenido
              </div>
              <div
                style={{ color: "#999", fontSize: "0.85rem", marginTop: "4px" }}
              >
                Gráficos y estadísticas
              </div>
            </div>

            <div
              style={{
                padding: "20px",
                background: "rgba(76, 175, 80, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(76, 175, 80, 0.2)",
                textAlign: "center",
              }}
            >
              <Download
                size={32}
                color="#4caf50"
                style={{ marginBottom: "12px" }}
              />
              <div
                style={{ color: "#fff", fontSize: "0.9rem", fontWeight: "600" }}
              >
                Descarga
              </div>
              <div
                style={{ color: "#999", fontSize: "0.85rem", marginTop: "4px" }}
              >
                Automática al generar
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
    </div>
  );
};

export default GraphicsSection;
