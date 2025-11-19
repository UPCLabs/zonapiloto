import React, { useState, useEffect } from "react";
import "../../styles/admin_dashboard/admindashboard.css";

const AdminDashboard = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [institutionalEvents, setInstitutionalEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fullLoading, setFullLoading] = useState(true);
  const [editModal, setEditModal] = useState({
    isOpen: false,
    type: "",
    data: null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resp = await fetch(`${API_URL}/auth/users/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!resp.ok) {
          sessionStorage.clear();
          window.location.href = "/loggin";
          return;
        }

        const data = await resp.json();

        sessionStorage.setItem("user", data.user);
        sessionStorage.setItem("role", data.role);

        setUsername(data.user);
        setUserRole(data.role);
      } catch (error) {
        console.error("ERROR en auth/me:", error);
        sessionStorage.clear();
        window.location.href = "/loggin";
      } finally {
        setFullLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (activeSection === "calendario-academico") {
      fetchCalendarEvents();
    } else if (activeSection === "banco-preguntas") {
      fetchQuestions();
    } else if (activeSection === "eventos-institucionales") {
      fetchInstitutionalEvents();
    }
  }, [activeSection]);

  const handleLogout = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL;

      const res = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        console.error("Error al cerrar sesión");
        return;
      }
      sessionStorage.clear();
      window.location.href = "/loggin";
    } catch (err) {
      console.error("Error en logout:", err);
    }
  };

  // ============================================
  // FUNCIONES DE CARGA DE DATOS
  // ============================================
  const fetchCalendarEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/information/calendar-events/events`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setCalendarEvents(data);
      }
    } catch (error) {
      console.error("Error al cargar eventos del calendario:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/information/question-bank/questions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      }
    } catch (error) {
      console.error("Error al cargar preguntas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstitutionalEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/information/institutional-events/events`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setInstitutionalEvents(data);
      }
    } catch (error) {
      console.error("Error al cargar eventos institucionales:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FUNCIONES CRUD PARA BACKEND
  // ============================================
  const handleCreate = async (endpoint, data) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Elemento creado exitosamente");
        // Recargar datos según el endpoint
        if (endpoint.includes("calendar-events")) {
          fetchCalendarEvents();
        } else if (endpoint.includes("question-bank")) {
          fetchQuestions();
        } else if (endpoint.includes("institutional-events")) {
          fetchInstitutionalEvents();
        }
        return result;
      } else {
        const error = await response.json();
        alert("Error: " + (error.message || "No se pudo crear el elemento"));
      }
    } catch (error) {
      console.error("Error al crear:", error);
      alert("Error al crear el elemento");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (endpoint, id, data) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}${endpoint}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Elemento actualizado exitosamente");
        // Recargar datos según el endpoint
        if (endpoint.includes("calendar-events")) {
          fetchCalendarEvents();
        } else if (endpoint.includes("question-bank")) {
          fetchQuestions();
        } else if (endpoint.includes("institutional-events")) {
          fetchInstitutionalEvents();
        }
        setEditModal({ isOpen: false, type: "", data: null });
      } else {
        const error = await response.json();
        alert("Error: " + (error.message || "No se pudo actualizar"));
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar el elemento");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (endpoint, id) => {
    if (!window.confirm("¿Estás seguro de eliminar este elemento?")) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}${endpoint}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Elemento eliminado exitosamente");
        // Recargar datos según el endpoint
        if (endpoint.includes("calendar-events")) {
          fetchCalendarEvents();
        } else if (endpoint.includes("question-bank")) {
          fetchQuestions();
        } else if (endpoint.includes("institutional-events")) {
          fetchInstitutionalEvents();
        }
      } else {
        const error = await response.json();
        alert("Error: " + (error.message || "No se pudo eliminar"));
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el elemento");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (type, data) => {
    setEditModal({ isOpen: true, type, data });
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
  };

  const renderEditModal = () => {
    if (!editModal.isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      let data = {};
      if (editModal.type === "calendar") {
        data = {
          title: formData.get("title"),
          description: formData.get("description"),
          type: formData.get("type"),
          start_date: formData.get("start_date"),
          end_date: formData.get("end_date"),
        };
        handleUpdate(
          "/information/calendar-events/events",
          editModal.data.id,
          data,
        );
      } else if (editModal.type === "question") {
        data = {
          question: formData.get("question"),
          categoryName: formData.get("categoryName"),
          answer: formData.get("answer"),
        };
        handleUpdate(
          "/information/question-bank/questions",
          editModal.data.questionId,
          data,
        );
      } else if (editModal.type === "institutional") {
        data = {
          title: formData.get("title"),
          description: formData.get("description"),
          start_date: formData.get("start_date"),
          end_date: formData.get("end_date"),
          type: formData.get("type"),
          location: formData.get("location"),
        };
        handleUpdate(
          "/information/institutional-events/events",
          editModal.data.id,
          data,
        );
      }
    };

    if (fullLoading) {
      console.log("Esperando");
      return <div className="loader">Cargando...</div>;
    }

    return (
      <div
        className="modal-overlay"
        onClick={() => setEditModal({ isOpen: false, type: "", data: null })}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>
              Editar{" "}
              {editModal.type === "calendar"
                ? "Evento del Calendario"
                : editModal.type === "question"
                  ? "Pregunta"
                  : "Evento Institucional"}
            </h3>
            <button
              className="modal-close"
              onClick={() =>
                setEditModal({ isOpen: false, type: "", data: null })
              }
            >
              ✕
            </button>
          </div>

          <form className="modal-form" onSubmit={handleSubmit}>
            {editModal.type === "calendar" && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Título del Evento *</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editModal.data?.title}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipo *</label>
                    <input
                      type="text"
                      name="type"
                      defaultValue={editModal.data?.type}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de Inicio *</label>
                    <input
                      type="date"
                      name="start_date"
                      defaultValue={editModal.data?.start_date}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Fecha Final *</label>
                    <input
                      type="date"
                      name="end_date"
                      defaultValue={editModal.data?.end_date}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Descripción *</label>
                  <textarea
                    name="description"
                    rows="3"
                    defaultValue={editModal.data?.description}
                    required
                  ></textarea>
                </div>
              </>
            )}

            {editModal.type === "question" && (
              <>
                <div className="form-group">
                  <label>Pregunta *</label>
                  <textarea
                    name="question"
                    rows="3"
                    defaultValue={editModal.data?.question}
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label>Categoría *</label>
                  <input
                    type="text"
                    name="categoryName"
                    defaultValue={editModal.data?.categoryName}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Respuesta *</label>
                  <textarea
                    name="answer"
                    rows="4"
                    defaultValue={editModal.data?.answer}
                    required
                  ></textarea>
                </div>
              </>
            )}

            {editModal.type === "institutional" && (
              <>
                <div className="form-group">
                  <label>Título del Evento *</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editModal.data?.title}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de Inicio *</label>
                    <input
                      type="date"
                      name="start_date"
                      defaultValue={editModal.data?.start_date}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Fecha de Fin *</label>
                    <input
                      type="date"
                      name="end_date"
                      defaultValue={editModal.data?.end_date}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo de Evento *</label>
                    <input
                      type="text"
                      name="type"
                      defaultValue={editModal.data?.type}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Ubicación *</label>
                    <input
                      type="text"
                      name="location"
                      defaultValue={editModal.data?.location}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Descripción *</label>
                  <textarea
                    name="description"
                    rows="4"
                    defaultValue={editModal.data?.description}
                    required
                  ></textarea>
                </div>
              </>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  setEditModal({ isOpen: false, type: "", data: null })
                }
              >
                Cancelar
              </button>
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "inicio":
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Panel de Control</h2>
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
              <form
                className="data-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = {
                    title: formData.get("title"),
                    description: formData.get("description"),
                    type: formData.get("type"),
                    start_date: formData.get("start_date"),
                    end_date: formData.get("end_date"),
                  };
                  handleCreate("/information/calendar-events/events", data);
                  e.target.reset();
                }}
              >
                <div className="form-row">
                  <div className="form-group">
                    <label>Título del Evento *</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Ej: Inicio de clases"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipo *</label>
                    <input
                      type="text"
                      name="type"
                      placeholder="Ej: Fechas, eventos, examenes"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de Inicio *</label>
                    <input type="date" name="start_date" required />
                  </div>
                  <div className="form-group">
                    <label>Fecha Final *</label>
                    <input type="date" name="end_date" required />
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
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Guardando..." : "Agregar al Calendario"}
                </button>
              </form>
            </div>

            <div className="list-container">
              <h3 className="form-title">Eventos Registrados</h3>
              {loading ? (
                <div className="loading-state">Cargando eventos...</div>
              ) : calendarEvents.length === 0 ? (
                <div className="empty-state">No hay eventos registrados</div>
              ) : (
                <div className="event-list">
                  {calendarEvents.map((event) => (
                    <div key={event.id} className="event-item">
                      <div className="event-date">
                        <span className="day">
                          {formatDate(event.start_date).split(" ")[0]}
                        </span>
                        <span className="month">
                          {formatDate(event.start_date).split(" ")[1]}
                        </span>
                      </div>
                      <div className="event-details">
                        <h4>{event.title}</h4>
                        <p>
                          {event.type} - Del{" "}
                          {new Date(event.start_date).toLocaleDateString(
                            "es-ES",
                          )}{" "}
                          al{" "}
                          {new Date(event.end_date).toLocaleDateString("es-ES")}
                        </p>
                        <p style={{ fontSize: "0.85rem", color: "#999" }}>
                          {event.description}
                        </p>
                      </div>
                      <div className="event-actions">
                        <button
                          className="icon-btn edit"
                          onClick={() => openEditModal("calendar", event)}
                        >
                          ✏️
                        </button>
                        <button
                          className="icon-btn delete"
                          onClick={() =>
                            handleDelete(
                              "/information/calendar-events/events",
                              event.id,
                            )
                          }
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              <p className="section-subtitle">
                Gestión de preguntas y respuestas
              </p>
            </div>

            <div className="form-container">
              <h3 className="form-title">Nueva Pregunta</h3>
              <form
                className="data-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = {
                    question: formData.get("question"),
                    categoryName: formData.get("categoryName"),
                    answer: formData.get("answer"),
                  };
                  handleCreate("/information/question-bank/questions", data);
                  e.target.reset();
                }}
              >
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
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Guardando..." : "Agregar Pregunta"}
                </button>
              </form>
            </div>

            <div className="list-container">
              <h3 className="form-title">Preguntas Registradas</h3>
              {loading ? (
                <div className="loading-state">Cargando preguntas...</div>
              ) : questions.length === 0 ? (
                <div className="empty-state">No hay preguntas registradas</div>
              ) : (
                <div className="data-table">
                  <div className="table-header">
                    <span>Pregunta</span>
                    <span>Categoría</span>
                    <span>Respuesta</span>
                    <span>Acciones</span>
                  </div>
                  {questions.map((q) => (
                    <div key={q.questionId} className="table-row">
                      <span
                        style={{
                          maxWidth: "300px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {q.question}
                      </span>
                      <span className="highlight-text">{q.categoryName}</span>
                      <span
                        style={{
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {q.answer}
                      </span>
                      <div className="row-actions">
                        <button
                          className="icon-btn edit"
                          onClick={() => openEditModal("question", q)}
                        >
                          ✏️
                        </button>
                        <button
                          className="icon-btn view"
                          onClick={() =>
                            alert(
                              `Pregunta: ${q.question}\n\nCategoría: ${q.categoryName}\n\nRespuesta: ${q.answer}`,
                            )
                          }
                        >
                          👁️
                        </button>
                        <button
                          className="icon-btn delete"
                          onClick={() =>
                            handleDelete(
                              "/information/question-bank/questions",
                              q.questionId,
                            )
                          }
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              <p className="section-subtitle">
                Gestión de eventos y actividades institucionales
              </p>
            </div>

            <div className="form-container">
              <h3 className="form-title">Crear Nuevo Evento</h3>
              <form
                className="data-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = {
                    title: formData.get("title"),
                    description: formData.get("description"),
                    start_date: formData.get("start_date"),
                    end_date: formData.get("end_date"),
                    type: formData.get("type"),
                    location: formData.get("location"),
                  };
                  handleCreate(
                    "/information/institutional-events/events",
                    data,
                  );
                  e.target.reset();
                }}
              >
                <div className="form-group">
                  <label>Título del Evento *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Ej: Feria de Ciencia y Tecnología 2025"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha de Inicio *</label>
                    <input type="date" name="start_date" required />
                  </div>
                  <div className="form-group">
                    <label>Fecha de Fin *</label>
                    <input type="date" name="end_date" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo de Evento *</label>
                    <input
                      type="text"
                      name="type"
                      placeholder="Ej: Academico, cultural, deportivo"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Ubicación *</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Campus Principal - Auditorio Central"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Descripción *</label>
                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Describe el evento en detalle..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Guardando..." : "Crear Evento"}
                </button>
              </form>
            </div>

            <div className="list-container">
              <h3 className="form-title">Eventos Programados</h3>
              {loading ? (
                <div className="loading-state">Cargando eventos...</div>
              ) : institutionalEvents.length === 0 ? (
                <div className="empty-state">No hay eventos programados</div>
              ) : (
                <div className="event-list">
                  {institutionalEvents.map((event) => (
                    <div key={event.id} className="event-item">
                      <div className="event-date">
                        <span className="day">
                          {formatDate(event.start_date).split(" ")[0]}
                        </span>
                        <span className="month">
                          {formatDate(event.start_date).split(" ")[1]}
                        </span>
                      </div>
                      <div className="event-details">
                        <h4>{event.title}</h4>
                        <p>
                          <strong>Tipo:</strong> {event.type} |{" "}
                          <strong>Ubicación:</strong> {event.location}
                        </p>
                        <p
                          style={{
                            fontSize: "0.85rem",
                            color: "#999",
                            marginTop: "8px",
                          }}
                        >
                          Del{" "}
                          {new Date(event.start_date).toLocaleDateString(
                            "es-ES",
                          )}{" "}
                          al{" "}
                          {new Date(event.end_date).toLocaleDateString("es-ES")}
                        </p>
                        <p
                          style={{
                            fontSize: "0.85rem",
                            color: "#999",
                            marginTop: "4px",
                          }}
                        >
                          {event.description}
                        </p>
                      </div>
                      <div className="event-actions">
                        <button
                          className="icon-btn edit"
                          onClick={() => openEditModal("institutional", event)}
                        >
                          ✏️
                        </button>
                        <button
                          className="icon-btn delete"
                          onClick={() =>
                            handleDelete(
                              "/information/institutional-events/events",
                              event.id,
                            )
                          }
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

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
              <form
                className="data-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = {
                    title: formData.get("title"),
                    description: formData.get("description"),
                    date: formData.get("date"),
                    type: formData.get("type"),
                  };
                  handleCreate("/api/anuncios", data);
                  e.target.reset();
                }}
              >
                <div className="form-group">
                  <label>Título del Anuncio *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Ej: Inscripciones abiertas para el próximo semestre"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha *</label>
                    <input type="date" name="date" required />
                  </div>
                  <div className="form-group">
                    <label>Tipo *</label>
                    <input
                      type="text"
                      name="type"
                      placeholder="Ej: Importante, informativo, urgente"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Descripción *</label>
                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Describe el anuncio en detalle..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Guardando..." : "Publicar Anuncio"}
                </button>
              </form>
            </div>

            <div className="list-container">
              <h3 className="form-title">Anuncios Publicados</h3>
              <div className="data-table">
                <div className="table-header">
                  <span>Título</span>
                  <span>Tipo</span>
                  <span>Fecha</span>
                  <span>Acciones</span>
                </div>
                <div className="table-row">
                  <span style={{ fontSize: "1.5rem" }}>📚</span>
                  <span
                    style={{
                      maxWidth: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Inscripciones abiertas para el próximo semestre
                  </span>
                  <span
                    className="role-badge"
                    style={{
                      background: "rgba(255, 136, 0, 0.2)",
                      color: "#ffa500",
                    }}
                  >
                    Importante
                  </span>
                  <span>08/11/2025</span>
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
                          <option value="SUPERADMIN">
                            Super Administrador
                          </option>
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
                    <span className="role-badge admin">ADMIN</span>
                    <span className="status-badge active">Activo</span>
                    <div className="row-actions">
                      <button className="icon-btn edit">✏️</button>
                      <button className="icon-btn delete">🗑️</button>
                    </div>
                  </div>
                  <div className="table-row">
                    <span>user_demo</span>
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

      {renderEditModal()}
    </div>
  );
};

export default AdminDashboard;
