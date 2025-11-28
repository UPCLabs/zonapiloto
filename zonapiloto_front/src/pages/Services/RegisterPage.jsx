import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/services/registerpage.css";

const RegisterPage = ({ onBack }) => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [selectedRole, setSelectedRole] = useState(null);
  const [step, setStep] = useState(1);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    confirmEmail: "",
    fullName: "",
    roleType: "",
    identityDocument: null,
    chamberOfCommerce: null,
    rut: null,
    requestLetter: null,
    departmentLetter: null,
    laborCertificate: null,
  });

  const [errors, setErrors] = useState({});
  const [emailSent, setEmailSent] = useState(false);

  const roles = [
    {
      id: "RESTAURANTADMIN",
      name: "Administrador de restaurante",
      icon: "🍽️",
      description: "Accede a tus menús y actualízalos",
      color: "#93c563",
    },
    {
      id: "EVENTSADMIN",
      name: "Administrador de Eventos",
      icon: "📅",
      description: "Proporciona información y eventos importantes",
      color: "#b4360f",
    },
    {
      id: "QUESTIONSADMIN",
      name: "Administrador de preguntas",
      icon: "❓",
      description: "Actualiza y maneja las preguntas frecuentes",
      color: "#FF9800",
    },
  ];

  const getRoleDisplayName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : roleId;
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setStep(2);
    setErrors({});
    setFormData((prev) => ({
      ...prev,
      roleType: "",
      identityDocument: null,
      chamberOfCommerce: null,
      rut: null,
      requestLetter: null,
      departmentLetter: null,
      laborCertificate: null,
    }));
  };

  const handleBackToRoles = () => {
    setStep(1);
    setSelectedRole(null);
    setEmailSent(false);
    setErrors({});
  };

  const handleBackToEmail = () => {
    setStep(2);
    setIsEmailVerified(false);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      if (files[0].type !== "application/pdf") {
        setErrors((prev) => ({
          ...prev,
          [name]: "Solo se permiten archivos PDF",
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

  const handleSendVerificationEmail = async () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    if (!formData.confirmEmail) {
      newErrors.confirmEmail = "Confirma tu correo electrónico";
    } else if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = "Los correos no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/send-email-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          email: data.error || "Error al enviar el código de verificación",
        });
        return;
      }

      setEmailSent(true);
      setShowVerificationModal(true);
    } catch (error) {
      setErrors({ email: "Error al enviar el código de verificación" });
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      alert("Por favor ingresa un código válido de 6 dígitos");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/verify-email-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Código de verificación incorrecto");
        return;
      }

      setIsEmailVerified(true);
      setShowVerificationModal(false);
      setStep(3);
    } catch (error) {
      alert("Error al verificar el código");
    }
  };

  const validateFinalForm = () => {
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Nombre completo requerido";
    if (!formData.identityDocument)
      newErrors.identityDocument =
        "Documento de identidad requerido (ambas caras en PDF)";
    if (!acceptedTerms)
      newErrors.acceptedTerms = "Debes aceptar los términos y condiciones";

    if (selectedRole === "RESTAURANTADMIN") {
      if (!formData.roleType) newErrors.roleType = "Rol requerido";
      if (!formData.chamberOfCommerce)
        newErrors.chamberOfCommerce =
          "Certificado de Cámara de Comercio requerido";
      if (!formData.rut) newErrors.rut = "RUT requerido";
      if (!formData.requestLetter)
        newErrors.requestLetter = "Carta de solicitud requerida";
    } else if (selectedRole === "EVENTSADMIN") {
      if (!formData.requestLetter)
        newErrors.requestLetter = "Carta de solicitud requerida";
      if (!formData.departmentLetter)
        newErrors.departmentLetter = "Carta de dependencia requerida";
      if (!formData.laborCertificate)
        newErrors.laborCertificate = "Certificado laboral requerido";
    } else if (selectedRole === "QUESTIONSADMIN") {
      if (!formData.departmentLetter)
        newErrors.departmentLetter = "Carta de dependencia requerida";
      if (!formData.laborCertificate)
        newErrors.laborCertificate = "Certificado laboral requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFinalForm()) {
      return;
    }

    try {
      const submitData = new FormData();

      const userDTO = {
        username: formData.fullName,
        email: formData.email,
        role: selectedRole,
        roleType: formData.roleType || null,
      };

      submitData.append("user", JSON.stringify(userDTO));

      if (formData.identityDocument) {
        submitData.append("documento", formData.identityDocument);
      }

      if (selectedRole === "RESTAURANTADMIN") {
        if (formData.chamberOfCommerce) {
          submitData.append("camara_de_comercio", formData.chamberOfCommerce);
        }
        if (formData.rut) {
          submitData.append("rut", formData.rut);
        }
        if (formData.requestLetter) {
          submitData.append("carta_de_solicitud", formData.requestLetter);
        }
      } else if (selectedRole === "EVENTSADMIN") {
        if (formData.requestLetter) {
          submitData.append("carta_de_solicitud", formData.requestLetter);
        }
        if (formData.departmentLetter) {
          submitData.append("carta_administrativa", formData.departmentLetter);
        }
        if (formData.laborCertificate) {
          submitData.append("certificado_laboral", formData.laborCertificate);
        }
      } else if (selectedRole === "QUESTIONSADMIN") {
        if (formData.departmentLetter) {
          submitData.append("carta_administrativa", formData.departmentLetter);
        }
        if (formData.laborCertificate) {
          submitData.append("certificado_laboral", formData.laborCertificate);
        }
      }

      const response = await fetch(`${API_URL}/auth/registration/register`, {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error al enviar la solicitud");
        return;
      }

      setStep(1);
      setSelectedRole(null);
      setIsEmailVerified(false);
      setEmailSent(false);
      setVerificationCode("");
      setAcceptedTerms(false);
      setFormData({
        email: "",
        confirmEmail: "",
        fullName: "",
        roleType: "",
        identityDocument: null,
        chamberOfCommerce: null,
        rut: null,
        requestLetter: null,
        departmentLetter: null,
        laborCertificate: null,
      });
      setErrors({});
    } catch (error) {
      alert("Error al procesar la solicitud");
    }
  };

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case "RESTAURANTADMIN":
        return (
          <>
            <div className="form-group">
              <label htmlFor="roleType">
                <span className="label-icon">👔</span>
                Rol en el restaurante *
              </label>
              <select
                id="roleType"
                name="roleType"
                value={formData.roleType}
                onChange={handleInputChange}
                className={errors.roleType ? "error" : ""}
              >
                <option value="">Seleccionar...</option>
                <option value="propietario">Propietario</option>
                <option value="administrador">Administrador</option>
              </select>
              {errors.roleType && (
                <span className="error-message">{errors.roleType}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="chamberOfCommerce">
                <span className="label-icon">🏢</span>
                Certificado de Cámara de Comercio (PDF) *
              </label>
              <input
                type="file"
                id="chamberOfCommerce"
                name="chamberOfCommerce"
                accept=".pdf"
                onChange={handleFileChange}
                className={errors.chamberOfCommerce ? "error" : ""}
              />
              {formData.chamberOfCommerce && (
                <span className="file-name">
                  ✓ {formData.chamberOfCommerce.name}
                </span>
              )}
              {errors.chamberOfCommerce && (
                <span className="error-message">
                  {errors.chamberOfCommerce}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="rut">
                <span className="label-icon">📄</span>
                RUT (PDF) *
              </label>
              <input
                type="file"
                id="rut"
                name="rut"
                accept=".pdf"
                onChange={handleFileChange}
                className={errors.rut ? "error" : ""}
              />
              {formData.rut && (
                <span className="file-name">✓ {formData.rut.name}</span>
              )}
              {errors.rut && (
                <span className="error-message">{errors.rut}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="requestLetter">
                <span className="label-icon">✉️</span>
                Carta de solicitud formal firmada (PDF) *
              </label>
              <input
                type="file"
                id="requestLetter"
                name="requestLetter"
                accept=".pdf"
                onChange={handleFileChange}
                className={errors.requestLetter ? "error" : ""}
              />
              {formData.requestLetter && (
                <span className="file-name">
                  ✓ {formData.requestLetter.name}
                </span>
              )}
              {errors.requestLetter && (
                <span className="error-message">{errors.requestLetter}</span>
              )}
            </div>
          </>
        );

      case "EVENTSADMIN":
        return (
          <>
            <div className="form-group">
              <label htmlFor="requestLetter">
                <span className="label-icon">✉️</span>
                Carta formal de solicitud (PDF) *
              </label>
              <input
                type="file"
                id="requestLetter"
                name="requestLetter"
                accept=".pdf"
                onChange={handleFileChange}
                className={errors.requestLetter ? "error" : ""}
              />
              {formData.requestLetter && (
                <span className="file-name">
                  ✓ {formData.requestLetter.name}
                </span>
              )}
              {errors.requestLetter && (
                <span className="error-message">{errors.requestLetter}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="departmentLetter">
                <span className="label-icon">🏛️</span>
                Carta de la dependencia académica/administrativa (PDF) *
              </label>
              <input
                type="file"
                id="departmentLetter"
                name="departmentLetter"
                accept=".pdf"
                onChange={handleFileChange}
                className={errors.departmentLetter ? "error" : ""}
              />
              {formData.departmentLetter && (
                <span className="file-name">
                  ✓ {formData.departmentLetter.name}
                </span>
              )}
              {errors.departmentLetter && (
                <span className="error-message">{errors.departmentLetter}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="laborCertificate">
                <span className="label-icon">📋</span>
                Certificado laboral (PDF) *
              </label>
              <input
                type="file"
                id="laborCertificate"
                name="laborCertificate"
                accept=".pdf"
                onChange={handleFileChange}
                className={errors.laborCertificate ? "error" : ""}
              />
              {formData.laborCertificate && (
                <span className="file-name">
                  ✓ {formData.laborCertificate.name}
                </span>
              )}
              {errors.laborCertificate && (
                <span className="error-message">{errors.laborCertificate}</span>
              )}
            </div>
          </>
        );

      case "QUESTIONSADMIN":
        return (
          <>
            <div className="form-group">
              <label htmlFor="departmentLetter">
                <span className="label-icon">🏛️</span>
                Carta de la dependencia académica/administrativa (PDF) *
              </label>
              <input
                type="file"
                id="departmentLetter"
                name="departmentLetter"
                accept=".pdf"
                onChange={handleFileChange}
                className={errors.departmentLetter ? "error" : ""}
              />
              {formData.departmentLetter && (
                <span className="file-name">
                  ✓ {formData.departmentLetter.name}
                </span>
              )}
              {errors.departmentLetter && (
                <span className="error-message">{errors.departmentLetter}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="laborCertificate">
                <span className="label-icon">📋</span>
                Certificado laboral universitario (PDF) *
              </label>
              <input
                type="file"
                id="laborCertificate"
                name="laborCertificate"
                accept=".pdf"
                onChange={handleFileChange}
                className={errors.laborCertificate ? "error" : ""}
              />
              {formData.laborCertificate && (
                <span className="file-name">
                  ✓ {formData.laborCertificate.name}
                </span>
              )}
              {errors.laborCertificate && (
                <span className="error-message">{errors.laborCertificate}</span>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="register-page">
      <Header />

      <main className="register-main">
        <div className="register-container">
          <div className="register-header">
            <h1>Registro de Administradores</h1>
            <p className="register-subtitle">
              {step === 1 && "Selecciona tu rol de administrador"}
              {step === 2 && "Verifica tu correo electrónico"}
              {step === 3 && "Completa tu información"}
            </p>
          </div>

          {step === 1 && (
            <div className="step-section">
              <h2 className="section-title">Selecciona tu Rol</h2>
              <div className="roles-grid">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    className="role-card"
                    onClick={() => handleRoleSelect(role.id)}
                    style={{ "--role-color": role.color }}
                  >
                    <div className="role-icon">{role.icon}</div>
                    <h3>{role.name}</h3>
                    <p>{role.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-section">
              <button onClick={handleBackToRoles} className="back-button">
                <span>←</span> Volver a roles
              </button>

              <div className="verification-card">
                <div className="role-badge">
                  <span className="role-badge-icon">
                    {roles.find((r) => r.id === selectedRole)?.icon}
                  </span>
                  <h2>{roles.find((r) => r.id === selectedRole)?.name}</h2>
                </div>

                <div className="verification-form">
                  <div className="form-group">
                    <label htmlFor="email">
                      <span className="label-icon">📧</span>
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="ejemplo@correo.com"
                      className={errors.email ? "error" : ""}
                      disabled={emailSent}
                    />
                    {errors.email && (
                      <span className="error-message">{errors.email}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmEmail">
                      <span className="label-icon">✉️</span>
                      Confirmar Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      id="confirmEmail"
                      name="confirmEmail"
                      value={formData.confirmEmail}
                      onChange={handleInputChange}
                      placeholder="Confirma tu correo"
                      className={errors.confirmEmail ? "error" : ""}
                      disabled={emailSent}
                    />
                    {errors.confirmEmail && (
                      <span className="error-message">
                        {errors.confirmEmail}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleSendVerificationEmail}
                    disabled={emailSent}
                    className={`submit-btn ${emailSent ? "disabled" : ""}`}
                  >
                    {emailSent
                      ? "✓ Código enviado"
                      : "Enviar código de verificación"}
                  </button>

                  {emailSent && (
                    <p className="verification-note">
                      Se ha enviado un código de 6 dígitos a tu correo
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && isEmailVerified && (
            <div className="step-section">
              <button onClick={handleBackToEmail} className="back-button">
                <span>←</span> Volver a verificación
              </button>

              <div className="register-form">
                <h2 className="section-title">
                  Información Personal y Documentación
                </h2>

                <div className="form-section locked-section">
                  <h3 className="subsection-title">
                    <span className="lock-icon">🔒</span>
                    Información de Cuenta (No modificable)
                  </h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="emailLocked">
                        <span className="label-icon">📧</span>
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        id="emailLocked"
                        value={formData.email}
                        className="locked-input"
                        disabled
                        readOnly
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="roleLocked">
                        <span className="label-icon">🎭</span>
                        Rol de Administrador
                      </label>
                      <input
                        type="text"
                        id="roleLocked"
                        value={getRoleDisplayName(selectedRole)}
                        className="locked-input"
                        disabled
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="subsection-title">Datos Personales</h3>

                  <div className="form-group">
                    <label htmlFor="fullName">
                      <span className="label-icon">👤</span>
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Ej: Juan Pérez García"
                      className={errors.fullName ? "error" : ""}
                    />
                    {errors.fullName && (
                      <span className="error-message">{errors.fullName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="identityDocument">
                      <span className="label-icon">🪪</span>
                      Documento de Identidad (PDF - Ambas caras en un solo
                      archivo) *
                    </label>
                    <input
                      type="file"
                      id="identityDocument"
                      name="identityDocument"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className={errors.identityDocument ? "error" : ""}
                    />
                    {formData.identityDocument && (
                      <span className="file-name">
                        ✓ {formData.identityDocument.name}
                      </span>
                    )}
                    {errors.identityDocument && (
                      <span className="error-message">
                        {errors.identityDocument}
                      </span>
                    )}
                    <p className="field-note">
                      Por favor, incluye ambas caras (frontal y reverso) de tu
                      documento de identidad en un solo archivo PDF
                    </p>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="subsection-title">Documentación Requerida</h3>
                  {renderRoleSpecificFields()}
                </div>
                <div className="form-section terms-section">
                  <div className="terms-checkbox-container">
                    <label htmlFor="acceptTerms" className="checkbox-label">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        checked={acceptedTerms}
                        onChange={(e) => {
                          setAcceptedTerms(e.target.checked);
                          if (errors.acceptedTerms) {
                            setErrors(prev => ({ ...prev, acceptedTerms: "" }));
                          }
                        }}
                        className={errors.acceptedTerms ? "error" : ""}
                      />
                      <span className="checkbox-text">
                        He leído y acepto la{" "}
                        <a
                          href="/privacidad"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="terms-link"
                        >
                          Política de Privacidad
                        </a>
                        {" "}y{" "}
                        <a
                          href="/terminos"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="terms-link"
                        >
                          Términos y Condiciones
                        </a>
                        {" "}para el tratamiento de mis datos personales *
                      </span>
                    </label>
                    {errors.acceptedTerms && (
                      <span className="error-message terms-error">
                        {errors.acceptedTerms}
                      </span>
                    )}
                  </div>

                  <div className="privacy-notice">
                    <div className="notice-icon">🔒</div>
                    <div className="notice-content">
                      <strong>Protección de Datos</strong>
                      <p>
                        Tus documentos serán almacenados de forma segura y únicamente serán
                        utilizados para verificar tu identidad y validar tu solicitud de
                        administrador. No compartiremos tu información con terceros.
                      </p>
                    </div>
                  </div>
                </div>

                <button onClick={handleSubmit} className="submit-btn">
                  <span className="btn-icon">✨</span>
                  Enviar Solicitud
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {showVerificationModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Verificación de Correo</h3>
            <p className="modal-subtitle">
              Ingresa el código de 6 dígitos enviado a tu correo
            </p>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(
                  e.target.value.replace(/\D/g, "").slice(0, 6),
                )
              }
              placeholder="123456"
              className="verification-input"
              maxLength={6}
            />
            <div className="modal-buttons">
              <button
                onClick={() => setShowVerificationModal(false)}
                className="modal-btn cancel-btn"
              >
                Cancelar
              </button>
              <button
                onClick={handleVerifyCode}
                className="modal-btn verify-btn"
              >
                Verificar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
