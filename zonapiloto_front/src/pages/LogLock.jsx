import React, { useState } from "react";
import "../styles/LogLock.css";

const LogLock = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            setError("Por favor completa todos los campos");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_URL}/auth/check-credentials`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                throw new Error("Error en la conexión");
            }

            const isValid = await response.json();

            if (isValid) {
                sessionStorage.setItem("temp_username", formData.username);
                sessionStorage.setItem("temp_password", formData.password);
                window.location.href = "/MFAVerify";
            } else {
                setError("Credenciales inválidas");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("Error de conexión. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="loglock-page">
            <div className="neon-background">
                <div className="neon-line line-1"></div>
                <div className="neon-line line-2"></div>
                <div className="neon-line line-3"></div>
                <div className="neon-circle circle-1"></div>
                <div className="neon-circle circle-2"></div>
            </div>

            <div className="loglock-container">
                <div className="loglock-card">
                    <div className="card-glow"></div>

                    <div className="loglock-header">
                        <div className="icon-badge">🔐</div>
                        <h1 className="loglock-title">
                            <span className="title-word">ZONA</span>
                            <span className="title-word">PILOTO</span>
                        </h1>
                        <p className="loglock-subtitle">Sistema de Gestión Académica</p>
                    </div>

                    <form onSubmit={handleSubmit} className="loglock-form">
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">
                                Usuario
                            </label>
                            <div className="input-wrapper">
                                <span className="input-icon">👤</span>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Ingresa tu usuario"
                                    required
                                    autoComplete="username"
                                />
                                <div className="input-glow"></div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Contraseña
                            </label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Ingresa tu contraseña"
                                    required
                                    autoComplete="current-password"
                                />
                                <div className="input-glow"></div>
                            </div>
                        </div>

                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`submit-btn ${loading ? "loading" : ""}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Verificando...
                                </>
                            ) : (
                                <>
                                    <span>ACCEDER</span>
                                    <span className="btn-arrow">→</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="loglock-footer">
                        <div className="divider">
                            <span className="divider-line"></span>
                            <span className="divider-text">Sistema Seguro</span>
                            <span className="divider-line"></span>
                        </div>
                        <p className="security-note">
                            🔒 Autenticación de dos factores requerida
                        </p>
                    </div>
                </div>

                <div className="scd-logo">
                    <span className="scd-text">S.C.D</span>
                    <span className="scd-subtitle">Sistema de Control y Datos</span>
                </div>
            </div>
        </div>
    );
};

export default LogLock;