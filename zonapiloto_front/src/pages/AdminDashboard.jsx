import React, { useState, useEffect } from "react";
import "../styles/admindashboard.css";

const AdminDashboard = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("inicio");
    const [username, setUsername] = useState("");
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        //if (!token) {
        //    window.location.href = "/loglock";
        //     return;
        // }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUsername(payload.sub || payload.username || "Admin");
            setUserRole(payload.role || "USER");
        } catch (err) {
            console.error("Error al decodificar token:", err);
            setUsername("Admin");
            setUserRole("SUPERADMIN");
        }

        sessionStorage.removeItem("temp_username");
        sessionStorage.removeItem("temp_password");
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        sessionStorage.clear();
        window.location.href = "/loglock";
    };

    // Servicios principales según la imagen
    const services = [
        {
            id: "perfil-academico",
            icon: "👤",
            label: "Perfil Académico",
            description: "Consulta tu información académica, notas y progreso",
            roles: ["USER", "ADMIN", "SUPERADMIN"]
        },
        {
            id: "calendario-academico",
            icon: "📅",
            label: "Calendario Académico",
            description: "Horarios y fechas importantes",
            roles: ["ADMIN", "SUPERADMIN"]
        },
        {
            id: "banco-preguntas",
            icon: "📝",
            label: "Banco de Preguntas",
            description: "Practica y prepárate para tus evaluaciones",
            roles: ["ADMIN", "SUPERADMIN"]
        },
        {
            id: "eventos-institucionales",
            icon: "🎉",
            label: "Eventos Institucionales",
            description: "Entérate de los próximos eventos",
            roles: ["ADMIN", "SUPERADMIN"]
        },
        {
            id: "cafeteria",
            icon: "🍽️",
            label: "Cafetería",
            description: "Menú del día y servicios alimentarios",
            roles: ["ADMIN", "SUPERADMIN"]
        },
        {
            id: "biblioteca",
            icon: "📚",
            label: "Biblioteca",
            description: "Catálogo y reserva de espacios",
            roles: ["ADMIN", "SUPERADMIN"]
        }
    ];

    const adminMenuItems = [
        { id: "inicio", icon: "🏠", label: "Inicio", roles: ["USER", "ADMIN", "SUPERADMIN"] },
        { id: "usuarios", icon: "👥", label: "Gestión de Usuarios", roles: ["SUPERADMIN"] },
        { id: "configuracion", icon: "⚙️", label: "Configuración", roles: ["ADMIN", "SUPERADMIN"] },
    ];

    const allMenuItems = [
        ...adminMenuItems.slice(0, 1), // Inicio
        ...services,
        ...adminMenuItems.slice(1) // Usuarios y Configuración
    ];

    const filteredMenuItems = allMenuItems.filter(item => item.roles.includes(userRole));

    const renderContent = () => {
        switch (activeSection) {
            case "inicio":
                return (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2 className="section-title">Panel de Control</h2>
                            <p className="section-subtitle">Gestión de servicios académicos</p>
                        </div>

                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon-wrapper">
                                    <div className="stat-icon">📚</div>
                                </div>
                                <div className="stat-content">
                                    <h3>1,234</h3>
                                    <p>Recursos Biblioteca</p>
                                    <span className="stat-trend positive">+12% este mes</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon-wrapper">
                                    <div className="stat-icon">❓</div>
                                </div>
                                <div className="stat-content">
                                    <h3>567</h3>
                                    <p>Preguntas Activas</p>
                                    <span className="stat-trend positive">+8% este mes</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon-wrapper">
                                    <div className="stat-icon">📅</div>
                                </div>
                                <div className="stat-content">
                                    <h3>42</h3>
                                    <p>Eventos Activos</p>
                                    <span className="stat-trend neutral">Sin cambios</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon-wrapper">
                                    <div className="stat-icon">👥</div>
                                </div>
                                <div className="stat-content">
                                    <h3>89</h3>
                                    <p>Usuarios Registrados</p>
                                    <span className="stat-trend positive">+5 nuevos</span>
                                </div>
                            </div>
                        </div>

                        <div className="services-overview">
                            <h3 className="subsection-title">Servicios Disponibles</h3>
                            <div className="services-grid">
                                {services.filter(s => s.roles.includes(userRole)).map(service => (
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

            case "perfil-academico":
                return (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2 className="section-title">
                                <span className="title-icon">👤</span>
                                Perfil Académico
                            </h2>
                            <p className="section-subtitle">Gestión de perfiles de estudiantes</p>
                        </div>

                        <div className="management-container">
                            <div className="action-buttons">
                                <button className="primary-btn">
                                    <span>➕</span>
                                    Nuevo Perfil
                                </button>
                                <button className="secondary-btn">
                                    <span>📤</span>
                                    Exportar Datos
                                </button>
                                <button className="secondary-btn">
                                    <span>🔍</span>
                                    Buscar
                                </button>
                            </div>

                            <div className="data-table">
                                <div className="table-header">
                                    <span>Estudiante</span>
                                    <span>Carrera</span>
                                    <span>Semestre</span>
                                    <span>Promedio</span>
                                    <span>Acciones</span>
                                </div>
                                <div className="table-row">
                                    <span>Juan Pérez</span>
                                    <span>Ingeniería</span>
                                    <span>5to</span>
                                    <span className="highlight-text">4.2</span>
                                    <div className="row-actions">
                                        <button className="icon-btn edit">✏️</button>
                                        <button className="icon-btn view">👁️</button>
                                        <button className="icon-btn delete">🗑️</button>
                                    </div>
                                </div>
                                <div className="table-row">
                                    <span>María González</span>
                                    <span>Medicina</span>
                                    <span>3ro</span>
                                    <span className="highlight-text">4.5</span>
                                    <div className="row-actions">
                                        <button className="icon-btn edit">✏️</button>
                                        <button className="icon-btn view">👁️</button>
                                        <button className="icon-btn delete">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "calendario-academico":
                return (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2 className="section-title">
                                <span className="title-icon">📅</span>
                                Calendario Académico
                            </h2>
                            <p className="section-subtitle">Gestión de fechas y horarios importantes</p>
                        </div>

                        <div className="form-container">
                            <h3 className="form-title">Agregar Fecha Importante</h3>
                            <form className="data-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Nombre del Evento</label>
                                        <input type="text" placeholder="Ej: Examen Final" />
                                    </div>
                                    <div className="form-group">
                                        <label>Fecha</label>
                                        <input type="date" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Tipo</label>
                                        <select>
                                            <option>Seleccionar...</option>
                                            <option>Examen</option>
                                            <option>Entrega de trabajo</option>
                                            <option>Festivo</option>
                                            <option>Periodo académico</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Hora</label>
                                        <input type="time" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Descripción</label>
                                    <textarea rows="3" placeholder="Detalles adicionales..."></textarea>
                                </div>
                                <button type="submit" className="submit-btn">
                                    Agregar al Calendario
                                </button>
                            </form>
                        </div>

                        <div className="list-container">
                            <h3 className="form-title">Próximos Eventos</h3>
                            <div className="event-list">
                                <div className="event-item">
                                    <div className="event-date">
                                        <span className="day">15</span>
                                        <span className="month">DIC</span>
                                    </div>
                                    <div className="event-details">
                                        <h4>Examen Final de Matemáticas</h4>
                                        <p>8:00 AM - Aula 301</p>
                                    </div>
                                    <div className="event-actions">
                                        <button className="icon-btn edit">✏️</button>
                                        <button className="icon-btn delete">🗑️</button>
                                    </div>
                                </div>
                                <div className="event-item">
                                    <div className="event-date">
                                        <span className="day">20</span>
                                        <span className="month">DIC</span>
                                    </div>
                                    <div className="event-details">
                                        <h4>Entrega de Proyecto Final</h4>
                                        <p>11:59 PM - Virtual</p>
                                    </div>
                                    <div className="event-actions">
                                        <button className="icon-btn edit">✏️</button>
                                        <button className="icon-btn delete">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "banco-preguntas":
                return (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2 className="section-title">
                                <span className="title-icon">📝</span>
                                Banco de Preguntas
                            </h2>
                            <p className="section-subtitle">Gestión de preguntas y evaluaciones</p>
                        </div>

                        <div className="form-container">
                            <h3 className="form-title">Nueva Pregunta</h3>
                            <form className="data-form">
                                <div className="form-group">
                                    <label>Enunciado de la Pregunta</label>
                                    <textarea rows="3" placeholder="Escribe la pregunta aquí..."></textarea>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Materia</label>
                                        <select>
                                            <option>Seleccionar...</option>
                                            <option>Matemáticas</option>
                                            <option>Física</option>
                                            <option>Química</option>
                                            <option>Programación</option>
                                            <option>Historia</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Nivel de Dificultad</label>
                                        <select>
                                            <option>Seleccionar...</option>
                                            <option>Básico</option>
                                            <option>Intermedio</option>
                                            <option>Avanzado</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="options-container">
                                    <label>Opciones de Respuesta</label>
                                    <div className="option-input">
                                        <span className="option-label">A</span>
                                        <input type="text" placeholder="Opción A" />
                                    </div>
                                    <div className="option-input">
                                        <span className="option-label">B</span>
                                        <input type="text" placeholder="Opción B" />
                                    </div>
                                    <div className="option-input">
                                        <span className="option-label">C</span>
                                        <input type="text" placeholder="Opción C" />
                                    </div>
                                    <div className="option-input">
                                        <span className="option-label">D</span>
                                        <input type="text" placeholder="Opción D" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Respuesta Correcta</label>
                                    <select>
                                        <option>Seleccionar...</option>
                                        <option>A</option>
                                        <option>B</option>
                                        <option>C</option>
                                        <option>D</option>
                                    </select>
                                </div>
                                <button type="submit" className="submit-btn">
                                    Agregar Pregunta
                                </button>
                            </form>
                        </div>
                    </div>
                );

            case "eventos-institucionales":
                return (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2 className="section-title">
                                <span className="title-icon">🎉</span>
                                Eventos Institucionales
                            </h2>
                            <p className="section-subtitle">Gestión de eventos y actividades</p>
                        </div>

                        <div className="form-container">
                            <h3 className="form-title">Crear Nuevo Evento</h3>
                            <form className="data-form">
                                <div className="form-group">
                                    <label>Nombre del Evento</label>
                                    <input type="text" placeholder="Ej: Feria de Ciencias" />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Fecha de Inicio</label>
                                        <input type="date" />
                                    </div>
                                    <div className="form-group">
                                        <label>Fecha de Fin</label>
                                        <input type="date" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Hora</label>
                                        <input type="time" />
                                    </div>
                                    <div className="form-group">
                                        <label>Ubicación</label>
                                        <input type="text" placeholder="Auditorio Principal" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Descripción</label>
                                    <textarea rows="4" placeholder="Describe el evento..."></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Imagen del Evento (URL)</label>
                                    <input type="text" placeholder="https://..." />
                                </div>
                                <button type="submit" className="submit-btn">
                                    Crear Evento
                                </button>
                            </form>
                        </div>
                    </div>
                );

            case "cafeteria":
                return (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2 className="section-title">
                                <span className="title-icon">🍽️</span>
                                Cafetería
                            </h2>
                            <p className="section-subtitle">Gestión de menú y servicios alimentarios</p>
                        </div>

                        <div className="form-container">
                            <h3 className="form-title">Agregar Plato al Menú</h3>
                            <form className="data-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Nombre del Plato</label>
                                        <input type="text" placeholder="Ej: Arroz con Pollo" />
                                    </div>
                                    <div className="form-group">
                                        <label>Precio</label>
                                        <input type="number" placeholder="0.00" step="0.01" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Categoría</label>
                                        <select>
                                            <option>Seleccionar...</option>
                                            <option>Desayuno</option>
                                            <option>Almuerzo</option>
                                            <option>Cena</option>
                                            <option>Snacks</option>
                                            <option>Bebidas</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Disponibilidad</label>
                                        <select>
                                            <option>Disponible</option>
                                            <option>No Disponible</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Descripción</label>
                                    <textarea rows="3" placeholder="Ingredientes y detalles..."></textarea>
                                </div>
                                <button type="submit" className="submit-btn">
                                    Agregar al Menú
                                </button>
                            </form>
                        </div>

                        <div className="menu-preview">
                            <h3 className="form-title">Menú Actual</h3>
                            <div className="menu-grid">
                                <div className="menu-item">
                                    <div className="menu-item-header">
                                        <h4>Arroz con Pollo</h4>
                                        <span className="price">$5.50</span>
                                    </div>
                                    <p>Almuerzo - Disponible</p>
                                    <div className="menu-item-actions">
                                        <button className="icon-btn edit">✏️</button>
                                        <button className="icon-btn delete">🗑️</button>
                                    </div>
                                </div>
                                <div className="menu-item">
                                    <div className="menu-item-header">
                                        <h4>Jugo Natural</h4>
                                        <span className="price">$2.00</span>
                                    </div>
                                    <p>Bebidas - Disponible</p>
                                    <div className="menu-item-actions">
                                        <button className="icon-btn edit">✏️</button>
                                        <button className="icon-btn delete">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "biblioteca":
                return (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2 className="section-title">
                                <span className="title-icon">📚</span>
                                Biblioteca
                            </h2>
                            <p className="section-subtitle">Gestión de catálogo y recursos</p>
                        </div>

                        <div className="form-container">
                            <h3 className="form-title">Agregar Nuevo Recurso</h3>
                            <form className="data-form">
                                <div className="form-group">
                                    <label>Título</label>
                                    <input type="text" placeholder="Título del libro o recurso" />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Autor</label>
                                        <input type="text" placeholder="Nombre del autor" />
                                    </div>
                                    <div className="form-group">
                                        <label>ISBN/Código</label>
                                        <input type="text" placeholder="ISBN o código único" />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Categoría</label>
                                        <select>
                                            <option>Seleccionar...</option>
                                            <option>Libros</option>
                                            <option>Revistas</option>
                                            <option>Tesis</option>
                                            <option>Documentos</option>
                                            <option>Multimedia</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Disponibilidad</label>
                                        <input type="number" placeholder="Copias disponibles" min="0" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Descripción</label>
                                    <textarea rows="4" placeholder="Sinopsis o descripción del recurso..."></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Ubicación Física</label>
                                    <input type="text" placeholder="Estante, pasillo, sección..." />
                                </div>
                                <button type="submit" className="submit-btn">
                                    Agregar Recurso
                                </button>
                            </form>
                        </div>
                    </div>
                );

            case "usuarios":
                return (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2 className="section-title">
                                <span className="title-icon">👥</span>
                                Gestión de Usuarios
                            </h2>
                            <p className="section-subtitle">Solo para Super Administradores</p>
                        </div>
                        {userRole === "SUPERADMIN" ? (
                            <>
                                <div className="form-container">
                                    <div className="superadmin-badge">
                                        <span>👑</span>
                                        <span>Privilegios de Super Administrador</span>
                                    </div>
                                    <h3 className="form-title">Crear Nuevo Usuario</h3>
                                    <form className="data-form">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Nombre de Usuario</label>
                                                <input type="text" placeholder="username" />
                                            </div>
                                            <div className="form-group">
                                                <label>Correo Electrónico</label>
                                                <input type="email" placeholder="user@example.com" />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Contraseña Temporal</label>
                                                <input type="password" placeholder="••••••••" />
                                            </div>
                                            <div className="form-group">
                                                <label>Rol</label>
                                                <select>
                                                    <option>Seleccionar...</option>
                                                    <option value="USER">Usuario Regular</option>
                                                    <option value="ADMIN">Administrador</option>
                                                    <option value="SUPERADMIN">Super Administrador</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Nombre Completo</label>
                                            <input type="text" placeholder="Nombre y apellidos" />
                                        </div>
                                        <button type="submit" className="submit-btn">
                                            Crear Usuario
                                        </button>
                                    </form>
                                </div>

                                <div className="data-table">
                                    <h3 className="form-title">Usuarios Existentes</h3>
                                    <div className="table-header">
                                        <span>Usuario</span>
                                        <span>Email</span>
                                        <span>Rol</span>
                                        <span>Estado</span>
                                        <span>Acciones</span>
                                    </div>
                                    <div className="table-row">
                                        <span>admin_user</span>
                                        <span>admin@zona.edu</span>
                                        <span className="role-badge admin">ADMIN</span>
                                        <span className="status-badge active">Activo</span>
                                        <div className="row-actions">
                                            <button className="icon-btn edit">✏️</button>
                                            <button className="icon-btn delete">🗑️</button>
                                        </div>
                                    </div>
                                    <div className="table-row">
                                        <span>user_demo</span>
                                        <span>demo@zona.edu</span>
                                        <span className="role-badge user">USER</span>
                                        <span className="status-badge active">Activo</span>
                                        <div className="row-actions">
                                            <button className="icon-btn edit">✏️</button>
                                            <button className="icon-btn delete">🗑️</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="access-denied">
                                <div className="denied-icon">🚫</div>
                                <h3>Acceso Denegado</h3>
                                <p>Solo los Super Administradores pueden acceder a esta sección</p>
                            </div>
                        )}
                    </div>
                );

            case "configuracion":
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

            default:
                return (
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2 className="section-title">Sección en Desarrollo</h2>
                        </div>
                        <div className="coming-soon">
                            <div className="coming-soon-icon">🚧</div>
                            <h3>En Desarrollo</h3>
                            <p>Esta funcionalidad estará disponible próximamente</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="ambient-light left"></div>
            <div className="ambient-light right"></div>

            <div className={`sidebar ${menuOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                    <div className="logo">S.C.D</div>
                    <p className="logo-subtitle">Sistema de Control</p>
                </div>

                <div className="user-info">
                    <div className="user-avatar">
                        <span>👤</span>
                    </div>
                    <div className="user-details">
                        <h4>{username}</h4>
                        <p>{userRole === "SUPERADMIN" ? "Super Admin" : userRole === "ADMIN" ? "Administrador" : "Usuario"}</p>
                    </div>
                    <div className="user-status online"></div>
                </div>

                <nav className="sidebar-menu">
                    {filteredMenuItems.map((item) => (
                        <button
                            key={item.id}
                            className={`menu-item ${activeSection === item.id ? "active" : ""}`}
                            onClick={() => {
                                setActiveSection(item.id);
                                setMenuOpen(false);
                            }}
                        >
                            <span className="menu-icon">{item.icon}</span>
                            <span className="menu-label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <span>🚪</span>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </div>

            <div className="main-content">
                <header className="dashboard-header">
                    <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <h1 className="dashboard-title">Sistema de Control y Datos</h1>

                    <div className="header-actions">
                        <button className="header-btn" title="Buscar">
                            <span>🔍</span>
                        </button>
                        <button className="header-btn" title="Notificaciones">
                            <span>🔔</span>
                            <span className="notification-badge">3</span>
                        </button>
                        <button className="header-btn profile-btn" title="Perfil">
                            <span>👤</span>
                        </button>
                    </div>
                </header>

                <main className="dashboard-content">
                    {renderContent()}
                </main>

                <footer className="dashboard-footer">
                    <p>© 2025 ZonaPiloto - Sistema de Control y Datos</p>
                    <div className="footer-links">
                        <a href="#ayuda">Ayuda</a>
                        <span>•</span>
                        <a href="#privacidad">Privacidad</a>
                        <span>•</span>
                        <a href="#terminos">Términos</a>
                    </div>
                </footer>
            </div>

            {menuOpen && (
                <div className="sidebar-overlay" onClick={() => setMenuOpen(false)}></div>
            )}
        </div>
    );
};

export default AdminDashboard;