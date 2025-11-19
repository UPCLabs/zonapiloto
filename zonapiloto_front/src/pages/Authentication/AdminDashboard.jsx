import React, { useState, useEffect } from "react";
import "../../styles/admin_dashboard/admindashboard.css";

const AdminDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (!user || !role) {
      window.location.href = "/loggin";
      return;
    }

    setUsername(user);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    sessionStorage.clear();
    window.location.href = "/loggin";
  };

  // ============================================
  // FUNCIONES CRUD PARA BACKEND
  // ============================================
  const handleCreate = async (endpoint, data) => {
    try {
      // TODO: Implementar llamada al backend
      // const response = await fetch(endpoint, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   credentials: 'include', 
      //   body: JSON.stringify(data)
      // });
      // const result = await response.json();
      // if (response.ok) {
      //   alert('Elemento creado exitosamente');
      //   // Recargar datos
      // } else {
      //   alert('Error: ' + result.message);
      // }
      console.log('Crear:', endpoint, data);
      alert('Elemento creado exitosamente');
    } catch (error) {
      console.error('Error al crear:', error);
      alert('Error al crear el elemento');
    }
  };

  const handleUpdate = async (endpoint, id, data) => {
    try {
      // TODO: Implementar llamada al backend
      // const response = await fetch(`${endpoint}/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   credentials: 'include',
      //   body: JSON.stringify(data)
      // });
      // const result = await response.json();
      // if (response.ok) {
      //   alert('Elemento actualizado exitosamente');
      //   // Recargar datos
      // } else {
      //   alert('Error: ' + result.message);
      // }
      console.log('Actualizar:', endpoint, id, data);
      alert('Elemento actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar el elemento');
    }
  };

  const handleDelete = async (endpoint, id) => {
    if (!window.confirm('¿Estás seguro de eliminar este elemento?')) return;

    try {
      // TODO: Implementar llamada al backend
      // const response = await fetch(`${endpoint}/${id}`, {
      //   method: 'DELETE',
      //   credentials: 'include'
      // });
      // if (response.ok) {
      //   alert('Elemento eliminado exitosamente');
      //   // Recargar datos
      // } else {
      //   const result = await response.json();
      //   alert('Error: ' + result.message);
      // }
      console.log('Eliminar:', endpoint, id);
      alert('Elemento eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar el elemento');
    }
  };

  // Servicios principales
  const services = [
    {
      id: "perfil-academico",
      icon: "👤",
      label: "Perfil Académico",
      description: "Consulta tu información académica, notas y progreso",
      roles: ["USER", "ADMIN", "SUPERADMIN"],
    },
    {
      id: "calendario-academico",
      icon: "📅",
      label: "Calendario Académico",
      description: "Horarios y fechas importantes",
      roles: ["ADMIN", "SUPERADMIN"],
    },
    {
      id: "banco-preguntas",
      icon: "📝",
      label: "Banco de Preguntas",
      description: "Practica y prepárate para tus evaluaciones",
      roles: ["ADMIN", "SUPERADMIN"],
    },
    {
      id: "eventos-institucionales",
      icon: "🎉",
      label: "Eventos Institucionales",
      description: "Entérate de los próximos eventos",
      roles: ["ADMIN", "SUPERADMIN"],
    },
    {
      id: "anuncios",
      icon: "📢",
      label: "Anuncios",
      description: "Gestión de anuncios en la página principal",
      roles: ["ADMIN", "SUPERADMIN"],
    },
  ];

  const adminMenuItems = [
    {
      id: "inicio",
      icon: "🏠",
      label: "Inicio",
      roles: ["USER", "ADMIN", "SUPERADMIN"],
    },
    {
      id: "usuarios",
      icon: "👥",
      label: "Gestión de Usuarios",
      roles: ["SUPERADMIN"],
    },
    {
      id: "configuracion",
      icon: "⚙️",
      label: "Configuración",
      roles: ["SUPERADMIN"],
    },
  ];

  const allMenuItems = [
    ...adminMenuItems.slice(0, 1),
    ...services,
    ...adminMenuItems.slice(1),
  ];

  const filteredMenuItems = allMenuItems.filter((item) =>
    item.roles.includes(userRole),
  );

  const renderContent = () => {
    switch (activeSection) {
      case "inicio":
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Panel de Control</h2>
              <p className="section-subtitle">
                Gestión de servicios académicos
              </p>
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
                {services
                  .filter((s) => s.roles.includes(userRole))
                  .map((service) => (
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
              <p className="section-subtitle">
                Gestión de perfiles de estudiantes
              </p>
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

      // ============================================
      // CALENDARIO ACADÉMICO
      // Endpoint: /api/calendario-academico
      // Campos: title, description, type, start_date, final_date
      // ============================================
      case "calendario-academico":
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-icon">📅</span>
                Calendario Académico
              </h2>
              <p className="section-subtitle">
                Gestión de fechas y horarios importantes
              </p>
            </div>

            <div className="form-container">
              <h3 className="form-title">Agregar Fecha Importante</h3>
              <form className="data-form" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = {
                  title: formData.get('title'),
                  description: formData.get('description'),
                  type: formData.get('type'),
                  start_date: formData.get('start_date'),
                  final_date: formData.get('final_date')
                };
                handleCreate('/api/calendario-academico', data);
                e.target.reset();
              }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Título del Evento *</label>
                    <input type="text" name="title" placeholder="Ej: Inicio de clases" required />
                  </div>
                  <div className="form-group">
                    <label>Tipo *</label>
                    <input type="text" name="tipo" placeholder="Ej: Fechas,eventos,examenes" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de Inicio *</label>
                    <input type="date" name="start_date" required />
                  </div>
                  <div className="form-group">
                    <label>Fecha Final *</label>
                    <input type="date" name="final_date" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Descripción *</label>
                  <textarea
                    name="description"
                    rows="3"
                    placeholder="Ej: Primer día del semestre"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  Agregar al Calendario
                </button>
              </form>
            </div>

            <div className="list-container">
              <h3 className="form-title">Eventos Registrados</h3>
              <div className="event-list">
                {/* Ejemplo de evento - TODO: Reemplazar con datos del backend */}
                <div className="event-item">
                  <div className="event-date">
                    <span className="day">10</span>
                    <span className="month">FEB</span>
                  </div>
                  <div className="event-details">
                    <h4>Inicio de clases</h4>
                    <p>Académico - Del 10/02/2025 al 18/02/2025</p>
                    <p style={{ fontSize: '0.85rem', color: '#999' }}>Primer día del semestre</p>
                  </div>
                  <div className="event-actions">
                    <button
                      className="icon-btn edit"
                      onClick={() => {
                        const newData = {
                          title: prompt('Nuevo título:', 'Inicio de clases'),
                          description: prompt('Nueva descripción:', 'Primer día del semestre'),
                          type: 'Académico',
                          start_date: '2025-02-10',
                          final_date: '2025-02-18'
                        };
                        if (newData.title) handleUpdate('/api/calendario-academico', 1, newData);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete('/api/calendario-academico', 1)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // ============================================
      // BANCO DE PREGUNTAS
      // ============================================
      case "banco-preguntas":
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-icon">📝</span>
                Banco de Preguntas
              </h2>
              <p className="section-subtitle">
                Gestión de preguntas y respuestas
              </p>
            </div>

            <div className="form-container">
              <h3 className="form-title">Nueva Pregunta</h3>
              <form className="data-form" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = {
                  question: formData.get('question'),
                  categoryName: formData.get('categoryName'),
                  answer: formData.get('answer')
                };
                handleCreate('/api/banco-preguntas', data);
                e.target.reset();
              }}>
                <div className="form-group">
                  <label>Pregunta *</label>
                  <textarea
                    name="question"
                    rows="3"
                    placeholder="Escribe la pregunta aquí..."
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Categoría *</label>
                  <input
                    type="text"
                    name="categoryName"
                    placeholder="Ej: Matemáticas, Física, Historia..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Respuesta *</label>
                  <textarea
                    name="answer"
                    rows="4"
                    placeholder="Escribe la respuesta correcta aquí..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  Agregar Pregunta
                </button>
              </form>
            </div>

            <div className="list-container">
              <h3 className="form-title">Preguntas Registradas</h3>
              <div className="data-table">
                <div className="table-header">
                  <span>Pregunta</span>
                  <span>Categoría</span>
                  <span>Respuesta</span>
                  <span>Acciones</span>
                </div>
                {/* Ejemplo - TODO: Reemplazar con datos del backend */}
                <div className="table-row">
                  <span style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    ¿Cuál es la fórmula del teorema de Pitágoras?
                  </span>
                  <span className="highlight-text">Matemáticas</span>
                  <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    a² + b² = c²
                  </span>
                  <div className="row-actions">
                    <button
                      className="icon-btn edit"
                      onClick={() => {
                        const newData = {
                          question: prompt('Nueva pregunta:', '¿Cuál es la fórmula del teorema de Pitágoras?'),
                          categoryName: prompt('Nueva categoría:', 'Matemáticas'),
                          answer: prompt('Nueva respuesta:', 'a² + b² = c²')
                        };
                        if (newData.question) handleUpdate('/api/banco-preguntas', 1, newData);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-btn view"
                      onClick={() => alert('Pregunta: ¿Cuál es la fórmula del teorema de Pitágoras?\n\nCategoría: Matemáticas\n\nRespuesta: a² + b² = c²')}
                    >
                      👁️
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete('/api/banco-preguntas', 1)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // ============================================
      // EVENTOS INSTITUCIONALES
      // ============================================
      case "eventos-institucionales":
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-icon">🎉</span>
                Eventos Institucionales
              </h2>
              <p className="section-subtitle">
                Gestión de eventos y actividades institucionales
              </p>
            </div>

            <div className="form-container">
              <h3 className="form-title">Crear Nuevo Evento</h3>
              <form className="data-form" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = {
                  titulo_evento: formData.get('titulo_evento'),
                  descripcion: formData.get('descripcion'),
                  fecha_inicio: formData.get('fecha_inicio'),
                  fecha_fin: formData.get('fecha_fin'),
                  tipo_evento: formData.get('tipo_evento'),
                  ubicacion: formData.get('ubicacion')
                };
                handleCreate('/api/eventos-institucionales', data);
                e.target.reset();
              }}>
                <div className="form-group">
                  <label>Título del Evento *</label>
                  <input
                    type="text"
                    name="titulo_evento"
                    placeholder="Ej: Feria de Ciencia y Tecnología 2025"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de Inicio *</label>
                    <input type="date" name="fecha_inicio" required />
                  </div>
                  <div className="form-group">
                    <label>Fecha de Fin *</label>
                    <input type="date" name="fecha_fin" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo de Evento *</label>
                    <input type="text" name="tipo" placeholder="Ej: Academico, cultural, deportivo" required />
                  </div>
                  <div className="form-group">
                    <label>Ubicación *</label>
                    <input
                      type="text"
                      name="ubicacion"
                      placeholder="Campus Principal - Auditorio Central"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Descripción *</label>
                  <textarea
                    name="descripcion"
                    rows="4"
                    placeholder="Describe el evento en detalle..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  Crear Evento
                </button>
              </form>
            </div>

            <div className="list-container">
              <h3 className="form-title">Eventos Programados</h3>
              <div className="event-list">
                {/* Ejemplo - TODO: Reemplazar con datos del backend */}
                <div className="event-item">
                  <div className="event-date">
                    <span className="day">20</span>
                    <span className="month">NOV</span>
                  </div>
                  <div className="event-details">
                    <h4>Feria de Ciencia y Tecnología 2025</h4>
                    <p><strong>Tipo:</strong> Académico | <strong>Ubicación:</strong> Campus Principal - Auditorio Central</p>
                    <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '8px' }}>
                      Del 20/11/2025 al 22/11/2025
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '4px' }}>
                      Muestra anual de proyectos de investigación estudiantil...
                    </p>
                  </div>
                  <div className="event-actions">
                    <button
                      className="icon-btn edit"
                      onClick={() => {
                        const newData = {
                          titulo_evento: prompt('Nuevo título:', 'Feria de Ciencia y Tecnología 2025'),
                          descripcion: prompt('Nueva descripción:', 'Muestra anual de proyectos...'),
                          fecha_inicio: '2025-11-20',
                          fecha_fin: '2025-11-22',
                          tipo_evento: 'Académico',
                          ubicacion: 'Campus Principal - Auditorio Central'
                        };
                        if (newData.titulo_evento) handleUpdate('/api/eventos-institucionales', 1, newData);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete('/api/eventos-institucionales', 1)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      // ============================================
      // ANUNCIOS (Eventos Página Principal)
      // ============================================
      case "anuncios":
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-icon">📢</span>
                Anuncios - Página Principal
              </h2>
              <p className="section-subtitle">
                Gestión de anuncios visibles en la página principal
              </p>
            </div>

            <div className="form-container">
              <h3 className="form-title">Crear Nuevo Anuncio</h3>
              <form className="data-form" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = {
                  titulo: formData.get('titulo'),
                  descripcion: formData.get('descripcion'),
                  fecha: formData.get('fecha'),
                  tipo: formData.get('tipo'),
                  icono: formData.get('icono')
                };
                handleCreate('/api/anuncios', data);
                e.target.reset();
              }}>
                <div className="form-group">
                  <label>Título del Anuncio *</label>
                  <input
                    type="text"
                    name="titulo"
                    placeholder="Ej: Inscripciones abiertas para el próximo semestre"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha *</label>
                    <input type="date" name="fecha" required />
                  </div>
                  <div className="form-group">
                    <label>Tipo *</label>
                    <input type="text" name="tipo" placeholder="Ej: Importante, informativo, urgente" required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Icono (Emoji) *</label>
                  <input
                    type="text"
                    name="icono"
                    placeholder="Ej: 📚, 🎓, 📢, 🎉"
                    maxLength="2"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Descripción *</label>
                  <textarea
                    name="descripcion"
                    rows="4"
                    placeholder="Describe el anuncio en detalle..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">
                  Publicar Anuncio
                </button>
              </form>
            </div>

            <div className="list-container">
              <h3 className="form-title">Anuncios Publicados</h3>
              <div className="data-table">
                <div className="table-header">
                  <span>Icono</span>
                  <span>Título</span>
                  <span>Tipo</span>
                  <span>Fecha</span>
                  <span>Acciones</span>
                </div>
                {/* Ejemplo - TODO: Reemplazar con datos del backend */}
                <div className="table-row">
                  <span style={{ fontSize: '1.5rem' }}>📚</span>
                  <span style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Inscripciones abiertas para el próximo semestre
                  </span>
                  <span className="role-badge" style={{ background: 'rgba(255, 136, 0, 0.2)', color: '#ffa500' }}>
                    Importante
                  </span>
                  <span>08/11/2025</span>
                  <div className="row-actions">
                    <button
                      className="icon-btn edit"
                      onClick={() => {
                        const newData = {
                          titulo: prompt('Nuevo título:', 'Inscripciones abiertas...'),
                          descripcion: prompt('Nueva descripción:', 'Las inscripciones...'),
                          fecha: '2025-11-08',
                          tipo: 'importante',
                          icono: '📚'
                        };
                        if (newData.titulo) handleUpdate('/api/anuncios', 1, newData);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="icon-btn view"
                      onClick={() => alert('Título: Inscripciones abiertas para el próximo semestre\n\nTipo: importante\n\nFecha: 08/11/2025\n\nDescripción: Las inscripciones para el semestre 2025-2 estarán disponibles del 15 al 30 de noviembre.')}
                    >
                      👁️
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete('/api/anuncios', 1)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
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
              <p className="section-subtitle">
                Solo para Super Administradores
              </p>
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
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Contraseña</label>
                        <input type="password" placeholder="••••••••" />
                      </div>
                      <div className="form-group">
                        <label>Rol</label>
                        <select>
                          <option>Seleccionar...</option>
                          <option value="ADMIN">Administrador</option>
                          <option value="SUPERADMIN">Super Administrador</option>
                        </select>
                      </div>
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
                <p>
                  Solo los Super Administradores pueden acceder a esta sección
                </p>
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
            <p>
              {userRole === "SUPERADMIN"
                ? "Super Admin"
                : userRole === "ADMIN"
                  ? "Administrador"
                  : "Usuario"}
            </p>
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
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
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

        <main className="dashboard-content">{renderContent()}</main>

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
        <div
          className="sidebar-overlay"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminDashboard;