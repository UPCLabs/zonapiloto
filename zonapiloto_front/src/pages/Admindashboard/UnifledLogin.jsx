import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import "../../styles/admin_dashboard/unifledlogin.css";

const UnifiedLogin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("credentials");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [qrData, setQrData] = useState(null);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const checkUser = async () => {
      try {
        const resp = await fetch(`${API_URL}/auth/users/me`, {
          method: "GET",
          credentials: "include",
        });

        if (resp.ok) {
          window.location.href = "/admindash";
        }
      } catch (error) {
        console.error("Error en checkUser()", error);
      }
    };

    checkUser();
  }, [API_URL]);

  const handleCredentialChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleCheckCredentials = async (e) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/check-credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: credentials.username.toLowerCase(),
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Credenciales inválidas");
        return;
      }

      if (!data.valid) {
        setError("Usuario no encontrado");
        return;
      }

      if (!data.hasMfa) {
        await setupMFA();
      } else {
        setStep("verify-mfa");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const setupMFA = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/confirm-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: credentials.username.toLowerCase(),
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al generar MFA");
        return;
      }

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

  const handleMFASubmit = async () => {
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      setError("Por favor ingresa los 6 dígitos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let endpoint;

      if (step === "setup-mfa") {
        endpoint = `${API_URL}/auth/verify-registration`;
      } else {
        endpoint = `${API_URL}/auth/login`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: credentials.username.toLowerCase(),
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
        if (step === "setup-mfa") {
          await setupMFA();
        }
        return;
      }

      if (step === "setup-mfa") {
        setStep("verify-mfa");
        setCode(["", "", "", "", "", ""]);
        setError("");
        setTimeout(() => {
          document.getElementById("code-0")?.focus();
        }, 100);
      } else {
        if (data.user) {
          localStorage.setItem("user", data.user);
          localStorage.setItem("role", data.role);
          window.location.href = "/admindash";
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep("credentials");
    setCode(["", "", "", "", "", ""]);
    setQrData(null);
    setError("");
  };

  return (
    <div className="unified-login-page">
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <header className="login-page-header">
        <button className="home-btn" onClick={() => navigate("/")}>
          <span className="home-icon">🏠</span>
          Inicio
        </button>
      </header>

      <div className="login-main-container">
        <div className="login-card-wrapper">
          <div className="login-info-side">
            <div className="info-content">
              <div className="info-icon-badge">
                <span className="shield-icon">🛡️</span>
              </div>
              <h2 className="info-title">Sistema Seguro</h2>
              <p className="info-description">
                Protegemos tu información con autenticación de dos factores y
                los más altos estándares de seguridad.
              </p>
              <div className="security-features">
                <div className="feature-item">
                  <span className="feature-icon">🔐</span>
                  <span>Encriptación de extremo a extremo</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📱</span>
                  <span>Autenticación de dos factores</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <span>Sesiones seguras</span>

                </div>
              </div>
              <button className="home-btn" onClick={() => navigate("/")}>
                <span className="home-icon">🏠</span>
                Inicio
              </button>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="login-form-side">
            <div className="form-header">
              <h1 className="form-title">Iniciar Sesión</h1>
              <p className="form-subtitle">
                {step === "credentials"
                  ? "Ingresa tus credenciales"
                  : step === "setup-mfa"
                    ? "Configura tu autenticación"
                    : "Verifica tu identidad"}
              </p>
            </div>

            {/* Step 1: Credentials */}
            {step === "credentials" && (
              <form onSubmit={handleCheckCredentials} className="login-form">
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
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleCredentialChange}
                      placeholder="Ingresa tu contraseña"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="toggle-password-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="error-alert">
                    <span className="error-icon">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className={`submit-button ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>
                      <span>Ingresar</span>
                      <span className="button-arrow">→</span>
                    </>
                  )}
                </button>

                <div className="form-divider">
                  <span className="divider-line"></span>
                  <span className="divider-text">¿No tienes cuenta?</span>
                  <span className="divider-line"></span>
                </div>

                <button
                  type="button"
                  className="register-button"
                  onClick={() => navigate("/register")}
                >
                  <span className="register-icon">📝</span>
                  <span>Crear cuenta nueva</span>
                </button>
              </form>
            )}

            {/* Step 2: Setup MFA */}

            {/* falta cambiar contraseña */}
            {step === "setup-mfa" && qrData && (
              <div className="mfa-setup-container">
                <button className="back-button" onClick={handleBack}>
                  <span>←</span>
                  <span>Volver</span>
                </button>

                <div className="mfa-setup-content">
                  <div className="setup-instructions">
                    <h3>Configura tu Autenticación</h3>
                    <p>
                      Escanea el código QR con tu aplicación de autenticación
                    </p>
                  </div>

                  <div className="qr-code-wrapper">
                    <div className="qr-code-container">
                      <QRCodeCanvas
                        value={qrData.qrUrl}
                        size={220}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="H"
                      />
                    </div>
                  </div>

                  <div className="manual-code-section">
                    <p className="manual-code-label">
                      ¿No puedes escanear? Ingresa este código manualmente:
                    </p>
                    <div className="manual-code-box">
                      <code>{qrData.secret}</code>
                    </div>
                  </div>

                  <div className="apps-recommendation">
                    <p className="apps-title">Apps recomendadas:</p>
                    <div className="apps-list">
                      <span className="app-badge">Google Authenticator</span>
                      <span className="app-badge">Microsoft Authenticator</span>
                      <span className="app-badge">Authy</span>
                    </div>
                  </div>
                </div>

                <div className="code-verification-section">
                  <h4 className="verification-title">
                    Ingresa el código para activar
                  </h4>
                  <div className="code-inputs-container" onPaste={handlePaste}>
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onChange={(e) =>
                          handleCodeChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="code-input"
                        autoComplete="off"
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="error-alert">
                      <span className="error-icon">⚠️</span>
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    onClick={handleMFASubmit}
                    className={`submit-button ${loading ? "loading" : ""}`}
                    disabled={loading || code.join("").length !== 6}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        <span>Verificando...</span>
                      </>
                    ) : (
                      <>
                        <span>Activar Autenticación</span>
                        <span className="button-arrow">→</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Verify MFA */}
            {step === "verify-mfa" && (
              <div className="mfa-verify-container">
                <button className="back-button" onClick={handleBack}>
                  <span>←</span>
                  <span>Volver</span>
                </button>

                <div className="verify-welcome">
                  <div className="welcome-icon">👋</div>
                  <h3>¡Bienvenido de nuevo!</h3>
                  <p className="welcome-user">{credentials.username}</p>
                </div>

                <div className="code-verification-section">
                  <h4 className="verification-title">
                    Ingresa tu código de verificación
                  </h4>
                  <p className="verification-subtitle">
                    Abre tu aplicación de autenticación
                  </p>

                  <div className="code-inputs-container" onPaste={handlePaste}>
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onChange={(e) =>
                          handleCodeChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="code-input"
                        autoComplete="off"
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="error-alert">
                      <span className="error-icon">⚠️</span>
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    onClick={handleMFASubmit}
                    className={`submit-button ${loading ? "loading" : ""}`}
                    disabled={loading || code.join("").length !== 6}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        <span>Verificando...</span>
                      </>
                    ) : (
                      <>
                        <span>Verificar e Ingresar</span>
                        <span className="button-arrow">→</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="form-footer">
              <p className="security-badge">
                <span className="lock-icon">🔒</span>
                Conexión segura y encriptada
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;