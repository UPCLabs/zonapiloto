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
  const [newPassword, setNewPassword] = useState({
    password: "",
    confirmPassword: "",
  });
  const [qrData, setQrData] = useState(null);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

    if (!isValidEmail(credentials.username)) {
      setError("Por favor ingresa un correo electrónico válido");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/check-credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.username.toLowerCase(),
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
        setStep("change-password");
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

  const handleNewPasswordChange = (e) => {
    setNewPassword({
      ...newPassword,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!newPassword.password || !newPassword.confirmPassword) {
      setError("Por favor completa ambos campos");
      return;
    }

    if (newPassword.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (newPassword.password !== newPassword.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/confirm-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.username.toLowerCase(),
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al generar MFA");
        setLoading(false);
        return;
      }

      setQrData({
        qrUrl: data.qr_url,
        secret: data.mfa_secret,
      });
      setStep("setup-mfa");
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setError("Error al generar código MFA");
      setLoading(false);
    }
  };

  const setupMFA = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/confirm-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.username.toLowerCase(),
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
      let requestBody;

      if (step === "setup-mfa") {
        endpoint = `${API_URL}/auth/verify-registration`;
        requestBody = {
          email: credentials.username.toLowerCase(),
          password: credentials.password,
          new_password: newPassword.password,
          mfa_code: fullCode,
        };
      } else {
        endpoint = `${API_URL}/auth/login`;
        requestBody = {
          email: credentials.username.toLowerCase(),
          password: credentials.password,
          mfa_code: fullCode,
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
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
        setCredentials({
          ...credentials,
          password: newPassword.password,
        });
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
    setNewPassword({
      password: "",
      confirmPassword: "",
    });
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

          <div className="login-form-side">
            <div className="form-header">
              <h1 className="form-title">Iniciar Sesión</h1>
              <p className="form-subtitle">
                {step === "credentials"
                  ? "Ingresa tus credenciales"
                  : step === "change-password"
                    ? "Crea tu nueva contraseña"
                    : step === "setup-mfa"
                      ? "Configura tu autenticación"
                      : "Verifica tu identidad"}
              </p>
            </div>

            {/* Step 1: Credentials */}
            {step === "credentials" && (
              <form onSubmit={handleCheckCredentials} className="login-form">
                <div className="form-group">
                  <label htmlFor="username">Correo Electrónico</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📧</span>
                    <input
                      type="email"
                      id="username"
                      name="username"
                      value={credentials.username}
                      onChange={handleCredentialChange}
                      placeholder="correo@ejemplo.com"
                      required
                      autoComplete="email"
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

            {/* Step 2: Change Password */}
            {step === "change-password" && (
              <div className="change-password-container">
                <button className="back-button" onClick={handleBack}>
                  <span>←</span>
                  <span>Volver</span>
                </button>

                <div className="password-change-content">
                  <div className="password-icon-wrapper">
                    <span className="password-icon">🔑</span>
                  </div>
                  <h3 className="password-change-title">
                    Configura tu contraseña segura
                  </h3>
                  <p className="password-change-subtitle">
                    Por seguridad, necesitas establecer una nueva contraseña
                    antes de configurar el MFA
                  </p>
                </div>

                <form
                  onSubmit={handleChangePassword}
                  className="password-change-form"
                >
                  <div className="form-group">
                    <label htmlFor="newPassword">Nueva Contraseña</label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        name="password"
                        value={newPassword.password}
                        onChange={handleNewPasswordChange}
                        placeholder="Mínimo 8 caracteres"
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      Confirmar Contraseña
                    </label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={newPassword.confirmPassword}
                        onChange={handleNewPasswordChange}
                        placeholder="Repite tu contraseña"
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="toggle-password-btn"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>

                  <div className="password-requirements">
                    <p className="requirements-title">
                      La contraseña debe tener:
                    </p>
                    <ul className="requirements-list">
                      <li
                        className={
                          newPassword.password.length >= 8 ? "valid" : ""
                        }
                      >
                        <span className="requirement-icon">
                          {newPassword.password.length >= 8 ? "✓" : "○"}
                        </span>
                        Al menos 8 caracteres
                      </li>
                      <li
                        className={
                          newPassword.password &&
                            newPassword.confirmPassword &&
                            newPassword.password === newPassword.confirmPassword
                            ? "valid"
                            : ""
                        }
                      >
                        <span className="requirement-icon">
                          {newPassword.password &&
                            newPassword.confirmPassword &&
                            newPassword.password === newPassword.confirmPassword
                            ? "✓"
                            : "○"}
                        </span>
                        Las contraseñas deben coincidir
                      </li>
                    </ul>
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
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <span>Continuar con MFA</span>
                        <span className="button-arrow">→</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Step 3: Setup MFA */}
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

            {/* Step 4: Verify MFA */}
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
