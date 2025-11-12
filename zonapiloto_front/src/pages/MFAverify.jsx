import React, { useState, useEffect } from "react";
import "../styles/mfaverify.css";

const MFAVerify = () => {
    const [step, setStep] = useState("loading");
    const [qrData, setQrData] = useState(null);
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        const tempUsername = sessionStorage.getItem("temp_username");
        const tempPassword = sessionStorage.getItem("temp_password");

        if (!tempUsername || !tempPassword) {
            window.location.href = "/loglock";
            return;
        }

        setUsername(tempUsername);
        checkUserStatus(tempUsername, tempPassword);
    }, []);

    const checkUserStatus = async (user, pass) => {
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL;

            // Intenta hacer login con código dummy
            const loginResponse = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: user,
                    password: pass,
                    mfa_code: "000000"
                }),
            });

            // Si el usuario no está registrado (401), necesitamos registrarlo
            if (loginResponse.status === 401) {
                const errorData = await loginResponse.json();

                // Verifica si el error es por MFA o porque el usuario no existe
                if (errorData.error && errorData.error.includes("inválido")) {
                    // El usuario existe pero el código MFA es incorrecto (esperado)
                    setStep("login");
                } else {
                    // El usuario no existe, necesitamos registrarlo
                    await registerUser(user, pass);
                }
            } else {
                // Si obtenemos 200, el código dummy funcionó (no debería pasar)
                setStep("login");
            }
        } catch (err) {
            console.error("Error al verificar estado:", err);
            setError("Error de conexión. Intenta nuevamente.");
            setStep("login"); // Fallback al login
        }
    };

    const registerUser = async (user, pass) => {
        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: user,
                    password: pass,
                    role: "USER"
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error en el registro");
            }

            const data = await response.json();

            if (data.qr_url && data.mfa_secret) {
                setQrData({
                    secret: data.mfa_secret,
                    qrUrl: data.qr_url
                });
                setStep("register");
            } else {
                throw new Error("Respuesta incompleta del servidor");
            }
        } catch (err) {
            console.error("Error en registro:", err);
            setError(err.message || "Error al generar código QR");
            setStep("login"); // Fallback
        }
    };

    const handleCodeChange = (index, value) => {
        if (value.length > 1) value = value.slice(0, 1);
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus al siguiente input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            if (prevInput) prevInput.focus();
        } else if (e.key === "Enter" && code.join("").length === 6) {
            handleVerify();
        }
    };

    const handleVerify = async () => {
        const fullCode = code.join("");

        if (fullCode.length !== 6) {
            setError("Por favor ingresa los 6 dígitos");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const API_URL = import.meta.env.VITE_API_BASE_URL;
            const tempUsername = sessionStorage.getItem("temp_username");
            const tempPassword = sessionStorage.getItem("temp_password");

            if (step === "register") {
                // Verificar código durante el registro
                const response = await fetch(`${API_URL}/auth/verify-registration`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: tempUsername,
                        mfa_code: fullCode
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Registro exitoso, cambiar a login
                    setStep("login");
                    setCode(["", "", "", "", "", ""]);
                    setError("");
                    setTimeout(() => {
                        document.getElementById("code-0")?.focus();
                    }, 100);
                } else {
                    setError(data.error || "Código MFA inválido");
                }
            } else {
                // Login con MFA
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: tempUsername,
                        password: tempPassword,
                        mfa_code: fullCode
                    }),
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    // Login exitoso
                    localStorage.setItem("auth_token", data.token);
                    sessionStorage.removeItem("temp_username");
                    sessionStorage.removeItem("temp_password");
                    window.location.href = "/admin-dashboard";
                } else {
                    setError(data.error || "Código MFA inválido");
                    setCode(["", "", "", "", "", ""]);
                    setTimeout(() => {
                        document.getElementById("code-0")?.focus();
                    }, 100);
                }
            }
        } catch (err) {
            console.error("Error:", err);
            setError("Error de conexión. Intenta nuevamente.");
        } finally {
            setLoading(false);
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

    if (step === "loading") {
        return (
            <div className="mfa-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Verificando estado...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mfa-page">
            <div className="ambient-light left"></div>
            <div className="ambient-light right"></div>

            <div className="mfa-container">
                <div className="mfa-card">
                    <div className="mfa-header">
                        <div className="security-badge">
                            {step === "register" ? "🔐 CONFIGURACIÓN MFA" : "🔓 VERIFICACIÓN MFA"}
                        </div>
                        <h1 className="mfa-title">
                            {step === "register" ? "Configuración Inicial" : "Autenticación"}
                        </h1>
                        <p className="mfa-subtitle">
                            {step === "register"
                                ? "Escanea el código QR con tu app de autenticación"
                                : `Bienvenido, ${username}`}
                        </p>
                    </div>

                    <div className="mfa-content">
                        {step === "register" && qrData && (
                            <div className="qr-section">
                                <div className="qr-wrapper">
                                    <img
                                        src={qrData.qrUrl}
                                        alt="QR Code"
                                        className="qr-image"
                                    />
                                </div>

                                <div className="secret-section">
                                    <p className="secret-label">Código manual (si no puedes escanear):</p>
                                    <div className="secret-code">{qrData.secret}</div>
                                </div>

                                <div className="app-suggestions">
                                    <p className="suggestions-title">Apps compatibles:</p>
                                    <div className="app-badges">
                                        <span className="app-badge">Google Authenticator</span>
                                        <span className="app-badge">Authy</span>
                                        <span className="app-badge">Microsoft Authenticator</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="code-section">
                            <p className="code-label">
                                {step === "register"
                                    ? "Ingresa el código de 6 dígitos para activar MFA"
                                    : "Ingresa tu código de autenticación"}
                            </p>

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
                                <div className="error-banner">
                                    <span className="error-icon">⚠</span>
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleVerify}
                                className={`verify-btn ${loading ? "loading" : ""}`}
                                disabled={loading || code.join("").length !== 6}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Verificando...
                                    </>
                                ) : (
                                    <>
                                        {step === "register" ? "ACTIVAR MFA" : "VERIFICAR"}
                                        <span className="btn-arrow">→</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="mfa-footer">
                        <button
                            className="back-btn"
                            onClick={() => {
                                sessionStorage.clear();
                                window.location.href = "/loglock";
                            }}
                        >
                            ← Volver al inicio
                        </button>
                    </div>
                </div>

                <div className="system-info">
                    <span className="system-text">S.C.D</span>
                    <span className="system-version">v2.0</span>
                </div>
            </div>
        </div>
    );
};

export default MFAVerify;