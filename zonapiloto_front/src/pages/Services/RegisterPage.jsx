import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/services/registerpage.css";

const RegisterPage = ({ onBack }) => {
    const [selectedRole, setSelectedRole] = useState(null);
    const [formData, setFormData] = useState({
        // Campos comunes
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: "",
        // Campos específicos por rol
        fullName: "",
        documentNumber: "",
        phone: "",
        address: "",
        specialty: "",
        studentCode: "",
        grade: "",
        parentName: "",
        parentPhone: "",
        department: "",
        position: "",
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const roles = [
        {
            id: "student",
            name: "Estudiante",
            icon: "🎓",
            description: "Accede a tus cursos y calificaciones",
            color: "#4CAF50"
        },
        {
            id: "teacher",
            name: "Docente",
            icon: "👨‍🏫",
            description: "Gestiona tus clases y estudiantes",
            color: "#2196F3"
        },
        {
            id: "parent",
            name: "Padre/Madre",
            icon: "👨‍👩‍👧",
            description: "Monitorea el progreso de tus hijos",
            color: "#FF9800"
        },
        {
            id: "administrative",
            name: "Administrativo",
            icon: "💼",
            description: "Administra procesos institucionales",
            color: "#9C27B0"
        },
        {
            id: "other",
            name: "Otro",
            icon: "👤",
            description: "Registro para otros perfiles",
            color: "#607D8B"
        }
    ];

    const handleRoleSelect = (roleId) => {
        setSelectedRole(roleId);
        setErrors({});
        // Limpiar campos específicos al cambiar de rol
        setFormData(prev => ({
            ...prev,
            fullName: "",
            documentNumber: "",
            phone: "",
            address: "",
            specialty: "",
            studentCode: "",
            grade: "",
            parentName: "",
            parentPhone: "",
            department: "",
            position: "",
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validación de email
        if (!formData.email) {
            newErrors.email = "El correo electrónico es requerido";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Correo electrónico inválido";
        }

        // Validación de confirmación de email
        if (!formData.confirmEmail) {
            newErrors.confirmEmail = "Confirma tu correo electrónico";
        } else if (formData.email !== formData.confirmEmail) {
            newErrors.confirmEmail = "Los correos no coinciden";
        }

        // Validación de contraseña
        if (!formData.password) {
            newErrors.password = "La contraseña es requerida";
        } else if (formData.password.length < 8) {
            newErrors.password = "La contraseña debe tener al menos 8 caracteres";
        }

        // Validación de confirmación de contraseña
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirma tu contraseña";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        // Validaciones específicas por rol
        if (selectedRole === "student") {
            if (!formData.fullName) newErrors.fullName = "Nombre completo requerido";
            if (!formData.studentCode) newErrors.studentCode = "Código estudiantil requerido";
            if (!formData.grade) newErrors.grade = "Grado requerido";
        } else if (selectedRole === "teacher") {
            if (!formData.fullName) newErrors.fullName = "Nombre completo requerido";
            if (!formData.documentNumber) newErrors.documentNumber = "Documento requerido";
            if (!formData.specialty) newErrors.specialty = "Especialidad requerida";
        } else if (selectedRole === "parent") {
            if (!formData.fullName) newErrors.fullName = "Nombre completo requerido";
            if (!formData.documentNumber) newErrors.documentNumber = "Documento requerido";
            if (!formData.phone) newErrors.phone = "Teléfono requerido";
        } else if (selectedRole === "administrative") {
            if (!formData.fullName) newErrors.fullName = "Nombre completo requerido";
            if (!formData.documentNumber) newErrors.documentNumber = "Documento requerido";
            if (!formData.department) newErrors.department = "Departamento requerido";
            if (!formData.position) newErrors.position = "Cargo requerido";
        } else if (selectedRole === "other") {
            if (!formData.fullName) newErrors.fullName = "Nombre completo requerido";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Aquí harías la llamada a tu API
            console.log("Formulario válido", {
                role: selectedRole,
                ...formData
            });

            alert("Registro exitoso! (Conectar con backend)");
            // onBack(); // Volver a la página principal
        }
    };

    const renderRoleSpecificFields = () => {
        switch (selectedRole) {
            case "student":
                return (
                    <>
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
                            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="studentCode">
                                    <span className="label-icon">🎫</span>
                                    Código Estudiantil *
                                </label>
                                <input
                                    type="text"
                                    id="studentCode"
                                    name="studentCode"
                                    value={formData.studentCode}
                                    onChange={handleInputChange}
                                    placeholder="Ej: EST-2024-001"
                                    className={errors.studentCode ? "error" : ""}
                                />
                                {errors.studentCode && <span className="error-message">{errors.studentCode}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="grade">
                                    <span className="label-icon">📚</span>
                                    Grado *
                                </label>
                                <select
                                    id="grade"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleInputChange}
                                    className={errors.grade ? "error" : ""}
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="1">Primero</option>
                                    <option value="2">Segundo</option>
                                    <option value="3">Tercero</option>
                                    <option value="4">Cuarto</option>
                                    <option value="5">Quinto</option>
                                    <option value="6">Sexto</option>
                                    <option value="7">Séptimo</option>
                                    <option value="8">Octavo</option>
                                    <option value="9">Noveno</option>
                                    <option value="10">Décimo</option>
                                    <option value="11">Undécimo</option>
                                </select>
                                {errors.grade && <span className="error-message">{errors.grade}</span>}
                            </div>
                        </div>
                    </>
                );

            case "teacher":
                return (
                    <>
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
                                placeholder="Ej: María González López"
                                className={errors.fullName ? "error" : ""}
                            />
                            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="documentNumber">
                                    <span className="label-icon">🪪</span>
                                    Documento de Identidad *
                                </label>
                                <input
                                    type="text"
                                    id="documentNumber"
                                    name="documentNumber"
                                    value={formData.documentNumber}
                                    onChange={handleInputChange}
                                    placeholder="Ej: 123456789"
                                    className={errors.documentNumber ? "error" : ""}
                                />
                                {errors.documentNumber && <span className="error-message">{errors.documentNumber}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="specialty">
                                    <span className="label-icon">🎯</span>
                                    Especialidad *
                                </label>
                                <input
                                    type="text"
                                    id="specialty"
                                    name="specialty"
                                    value={formData.specialty}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Matemáticas"
                                    className={errors.specialty ? "error" : ""}
                                />
                                {errors.specialty && <span className="error-message">{errors.specialty}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">
                                <span className="label-icon">📱</span>
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Ej: +57 300 123 4567"
                            />
                        </div>
                    </>
                );

            case "parent":
                return (
                    <>
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
                                placeholder="Ej: Carlos Rodríguez"
                                className={errors.fullName ? "error" : ""}
                            />
                            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="documentNumber">
                                    <span className="label-icon">🪪</span>
                                    Documento de Identidad *
                                </label>
                                <input
                                    type="text"
                                    id="documentNumber"
                                    name="documentNumber"
                                    value={formData.documentNumber}
                                    onChange={handleInputChange}
                                    placeholder="Ej: 987654321"
                                    className={errors.documentNumber ? "error" : ""}
                                />
                                {errors.documentNumber && <span className="error-message">{errors.documentNumber}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">
                                    <span className="label-icon">📱</span>
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Ej: +57 300 123 4567"
                                    className={errors.phone ? "error" : ""}
                                />
                                {errors.phone && <span className="error-message">{errors.phone}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">
                                <span className="label-icon">🏠</span>
                                Dirección
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Ej: Calle 123 #45-67"
                            />
                        </div>
                    </>
                );

            case "administrative":
                return (
                    <>
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
                                placeholder="Ej: Ana López Martínez"
                                className={errors.fullName ? "error" : ""}
                            />
                            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="documentNumber">
                                    <span className="label-icon">🪪</span>
                                    Documento de Identidad *
                                </label>
                                <input
                                    type="text"
                                    id="documentNumber"
                                    name="documentNumber"
                                    value={formData.documentNumber}
                                    onChange={handleInputChange}
                                    placeholder="Ej: 456789123"
                                    className={errors.documentNumber ? "error" : ""}
                                />
                                {errors.documentNumber && <span className="error-message">{errors.documentNumber}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="department">
                                    <span className="label-icon">🏢</span>
                                    Departamento *
                                </label>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Recursos Humanos"
                                    className={errors.department ? "error" : ""}
                                />
                                {errors.department && <span className="error-message">{errors.department}</span>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="position">
                                <span className="label-icon">💼</span>
                                Cargo *
                            </label>
                            <input
                                type="text"
                                id="position"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                placeholder="Ej: Coordinador"
                                className={errors.position ? "error" : ""}
                            />
                            {errors.position && <span className="error-message">{errors.position}</span>}
                        </div>
                    </>
                );

            case "other":
                return (
                    <>
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
                                placeholder="Ingresa tu nombre completo"
                                className={errors.fullName ? "error" : ""}
                            />
                            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">
                                <span className="label-icon">📱</span>
                                Teléfono (Opcional)
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Ej: +57 300 123 4567"
                            />
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

            {/* Main Content */}
            <main className="register-main">
                <div className="register-container">
                    <div className="register-header">
                        <h1>Crear Cuenta</h1>
                        <p>Selecciona tu rol y completa el formulario</p>
                    </div>

                    {/* Role Selection */}
                    <div className="roles-section">
                        <h2 className="section-title">Selecciona tu Rol</h2>
                        <div className="roles-grid">
                            {roles.map(role => (
                                <button
                                    key={role.id}
                                    className={`role-card ${selectedRole === role.id ? "active" : ""}`}
                                    onClick={() => handleRoleSelect(role.id)}
                                    style={{ "--role-color": role.color }}
                                >
                                    <div className="role-icon">{role.icon}</div>
                                    <h3>{role.name}</h3>
                                    <p>{role.description}</p>
                                    {selectedRole === role.id && (
                                        <div className="role-check">✓</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Registration Form */}
                    {selectedRole && (
                        <form className="register-form" onSubmit={handleSubmit}>
                            <h2 className="section-title">Información de Registro</h2>

                            {/* Campos específicos del rol */}
                            {renderRoleSpecificFields()}

                            {/* Campos comunes */}
                            <div className="form-divider">
                                <span>Credenciales de Acceso</span>
                            </div>

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
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
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
                                />
                                {errors.confirmEmail && <span className="error-message">{errors.confirmEmail}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">
                                    <span className="label-icon">🔒</span>
                                    Contraseña *
                                </label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Mínimo 8 caracteres"
                                        className={errors.password ? "error" : ""}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">
                                    <span className="label-icon">🔐</span>
                                    Confirmar Contraseña *
                                </label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirma tu contraseña"
                                        className={errors.confirmPassword ? "error" : ""}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                            </div>

                            <button type="submit" className="submit-btn">
                                <span className="btn-icon">✨</span>
                                Crear Cuenta
                            </button>

                            <p className="form-footer">
                                ¿Ya tienes cuenta?{" "}
                                <a href="/loggin" className="login-link">
                                    Inicia sesión aquí
                                </a>
                            </p>
                        </form>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default RegisterPage;