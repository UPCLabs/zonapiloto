import React, { useState } from "react";
import "../../styles/admin_dashboard/unifledlogin.css";

const UnifiedLogin = () => {
    // Estados principales
    const [step, setStep] = useState("credentials"); // credentials | setup-mfa | verify-mfa
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [qrData, setQrData] = useState(null);
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Manejo de cambios en credenciales
    const handleCredentialChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    // Paso 1: Verificar credenciales
    const handleCheckCredentials = async (e) => {
        e.preventDefault();

        if (!credentials.username || !credentials.password) {
            setError("Por favor completa todos los campos");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL;

            // Endpoint: /auth/check-credentials
            const response = await fetch(`${API_URL}/auth/check-credentials`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: credentials.username,
                    password: credentials.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Credenciales inválidas");
                return;
            }

            // data = { exists: true/false, hasMfa: true/false }
            if (!data.exists) {
                setError("Usuario no encontrado");
                return;
            }

            if (!data.hasMfa) {
                // Necesita configurar MFA
                await setupMFA();
            } else {
                // Ya tiene MFA, ir a verificación
                handleMFASubmit("verify-mfa");
            }

        } catch (err) {
            console.error("Error:", err);
            setError("Error de conexión. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    // Paso 2: Configurar MFA (generar QR)
    const setupMFA = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL;

            // Endpoint: /auth/confirm-registration
            const response = await fetch(`${API_URL}/auth/confirm-registration`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: credentials.username,
                    password: credentials.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Error al generar MFA");
                return;
            }

            // data = { qr_url: "...", mfa_secret: "..." }
            setQrData({
                qrUrl: data.qr_url,
                secret: data.mfa_secret,
            });
            setStep("setup-mfa");

        } catch (err) {
            console.error("Error generando MFA:", err);
            setError("Error al generar código MFA");
        }
    };

    // Manejo de códigos MFA
    const handleCodeChange = (index, value) => {
        if (value.length > 1) value = value.slice(0, 1);
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            document.getElementById(`code-${index + 1}`)?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            document.getElementById(`code-${index - 1}`)?.focus();
        } else if (e.key === "Enter" && code.join("").length === 6) {
            handleMFASubmit();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);

        if (!/^\d+$/.test(pastedData)) {
            setError("Solo se permiten números");
            return;
        }

        const newCode = pastedData.split("");
        while (newCode.length < 6) newCode.push("");
        setCode(newCode);

        const lastIndex = Math.min(pastedData.length, 5);
        setTimeout(() => {
            document.getElementById(`code-${lastIndex}`)?.focus();
        }, 0);
    };

    // Paso 3: Verificar código MFA
    const handleMFASubmit = async () => {
        const fullCode = code.join("");

        if (fullCode.length !== 6) {
            setError("Por favor ingresa los 6 dígitos");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL;
            let endpoint, successMessage;

            if (step === "setup-mfa") {
                // Verificar primer setup de MFA
                endpoint = `${API_URL}/auth/verify-registration`;
                successMessage = "MFA configurado exitosamente";
            } else {
                // Login normal con MFA
                endpoint = `${API_URL}/auth/login`;
            }

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: credentials.username,
                    password: credentials.password,
                    mfa_code: fullCode,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Código MFA inválido");
                setCode(["", "", "", "", "", ""]);
                setTimeout(() => {
                    document.getElementById("code-0")?.focus();
                }, 100);
                return;
            }

            if (step === "setup-mfa") {
                // Después de configurar MFA, hacer login
                setStep("verify-mfa");
                setCode(["", "", "", "", "", ""]);
                setError("");
                setTimeout(() => {
                    document.getElementById("code-0")?.focus();
                }, 100);
            } else {
                // Login exitoso, guardar token
                if (data.token) {
                    localStorage.setItem("auth_token", data.token);
                    window.location.href = "/AdminDash";
                }
            }

        } catch (err) {
            console.error("Error:", err);
            setError("Error de conexión. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    // Función para volver atrás
    const handleBack = () => {
        setStep("credentials");
        setCode(["", "", "", "", "", ""]);
        setQrData(null);
        setError("");
    };

    return (
        <div className="unified-login-page">
            <div className="neon-background">
                <div className="neon-line line-1"></div>
                <div className="neon-line line-2"></div>
                <div className="neon-line line-3"></div>
                <div className="neon-circle circle-1"></div>
                <div className="neon-circle circle-2"></div>
            </div>

            <div className="login-container">
                <div className="login-card">
                    <div className="card-glow"></div>

                    {/* Header */}
                    <div className="login-header">
                        <div className="icon-badge">🔐</div>
                        <h1 className="login-title">
                            <span className="title-word">S.C.D</span>
                        </h1>
                        <p className="login-subtitle">Sistema de Control y Datos</p>
                    </div>

                    {/* Paso 1: Credenciales */}
                    {step === "credentials" && (
                        <form onSubmit={handleCheckCredentials} className="credentials-form">
                            <div className="form-group">
                                <label htmlFor="username">Usuario</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">👤</span>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={credentials.username}
                                        onChange={handleCredentialChange}
                                        placeholder="Ingresa tu usuario"
                                        required
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Contraseña</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">🔒</span>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleCredentialChange}
                                        placeholder="Ingresa tu contraseña"
                                        required
                                        autoComplete="current-password"
                                    />
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
                                        <span>INGRESAR</span>
                                        <span className="btn-arrow">→</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Panel MFA deslizante */}
                    <div className={`mfa-panel ${step !== "credentials" ? "active" : ""}`}>
                        <button className="back-btn" onClick={handleBack}>
                            ← Volver
                        </button>

                        {/* Configuración MFA */}
                        {step === "setup-mfa" && qrData && (
                            <div className="mfa-setup">
                                <h2 className="mfa-title">Configurar Autenticación</h2>
                                <p className="mfa-subtitle">Escanea el código QR con tu app</p>

                                <div className="qr-container">
                                    <img src={qrData.qrUrl} alt="QR Code" className="qr-image" />
                                </div>

                                <div className="secret-container">
                                    <p className="secret-label">Código manual:</p>
                                    <div className="secret-code">{qrData.secret}</div>
                                </div>

                                <div className="apps-info">
                                    <p>Apps compatibles:</p>
                                    <div className="app-badges">
                                        <span>Google Authenticator</span>
                                        <span>Authy</span>
                                        <span>Microsoft Authenticator</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Verificación MFA */}
                        {(step === "setup-mfa" || step === "verify-mfa") && (
                            <div className="mfa-verify">
                                <h3 className="verify-title">
                                    {step === "setup-mfa"
                                        ? "Ingresa el código para activar"
                                        : `Bienvenido, ${credentials.username}`
                                    }
                                </h3>

                                <div className="code-inputs" onPaste={handlePaste}>
                                    {code.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`code-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleCodeChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="code-input"
                                            autoComplete="off"
                                        />
                                    ))}
                                </div>

                                {error && (
                                    <div className="error-message">
                                        <span className="error-icon">⚠</span>
                                        {error}
                                    </div>
                                )}

                                <button
                                    onClick={handleMFASubmit}
                                    className={`submit-btn ${loading ? "loading" : ""}`}
                                    disabled={loading || code.join("").length !== 6}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner"></span>
                                            Verificando...
                                        </>
                                    ) : (
                                        <>
                                            {step === "setup-mfa" ? "ACTIVAR MFA" : "VERIFICAR"}
                                            <span className="btn-arrow">→</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="login-footer">
                        <div className="divider">
                            <span className="divider-line"></span>
                            <span className="divider-text">Sistema Seguro</span>
                            <span className="divider-line"></span>
                        </div>
                        <p className="security-note">
                            🔒 Autenticación de dos factores
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnifiedLogin;