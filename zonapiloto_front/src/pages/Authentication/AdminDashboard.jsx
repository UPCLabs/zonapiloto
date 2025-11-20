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
  const [categories, setCategories] = useState([]);
  const [institutionalEvents, setInstitutionalEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [carouselImages, setCarouselImages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fullLoading, setFullLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModal, setEditModal] = useState({
    isOpen: false,
    type: "",
    data: null,
  });
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
      fetchCategories();
    } else if (activeSection === "eventos-institucionales") {
      fetchInstitutionalEvents();
    } else if (activeSection === "anuncios") {
      fetchAnnouncements();
      fetchCarouselImages();
    } else if (activeSection === "usuarios") {
      fetchUsers();
    }
  }, [activeSection]);

  const handleLogout = async () => {
    try {
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
        `${API_URL}/information/calendar-events/admin`,
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

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${API_URL}/information/question-bank/categories`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    }
  };

  const fetchInstitutionalEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/information/institutional-events/admin`,
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

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/information/advertisements/admin`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error("Error al cargar anuncios:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCarouselImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/information/announcements-photos/admin`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setCarouselImages(data);
      }
    } catch (error) {
      console.error("Error al cargar imágenes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/users`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FUNCIONES CRUD PARA BACKEND
  // ============================================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePhotoAnnouncement = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Por favor selecciona una imagen");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", e.target.title.value);
      formData.append("file", selectedFile);

      const response = await fetch(
        `${API_URL}/information/announcements-photos`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      if (response.ok) {
        alert("Imagen subida exitosamente");
        e.target.reset();
        setSelectedFile(null);
        setImagePreview(null);
        await fetchCarouselImages();
      } else {
        const error = await response.json();
        alert("Error: " + (error.message || "No se pudo subir la imagen"));
      }
    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert("Error al subir la imagen");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (endpoint, data) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Elemento creado exitosamente");
        if (endpoint.includes("calendar-events")) {
          await fetchCalendarEvents();
        } else if (endpoint.includes("question-bank/questions")) {
          await fetchQuestions();
        } else if (endpoint.includes("question-bank/categories")) {
          await fetchCategories();
        } else if (endpoint.includes("institutional-events")) {
          await fetchInstitutionalEvents();
        } else if (endpoint.includes("advertisements")) {
          await fetchAnnouncements();
        }
      } else {
        const error = await response.json();
        alert(
          "Error: " +
            (error.message || error.error || "No se pudo crear el elemento"),
        );
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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Elemento actualizado exitosamente");
        if (endpoint.includes("calendar-events")) {
          await fetchCalendarEvents();
        } else if (endpoint.includes("question-bank/questions")) {
          await fetchQuestions();
        } else if (endpoint.includes("question-bank/categories")) {
          await fetchCategories();
        } else if (endpoint.includes("institutional-events")) {
          await fetchInstitutionalEvents();
        } else if (endpoint.includes("announcements-photos")) {
          await fetchCarouselImages();
        } else if (endpoint.includes("auth/users")) {
          await fetchUsers();
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

  const handleToggleState = async (endpoint, id, currentState) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}${endpoint}/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: !currentState }),
      });

      if (response.ok) {
        alert("Estado actualizado exitosamente");
        if (endpoint.includes("calendar-events")) {
          await fetchCalendarEvents();
        } else if (endpoint.includes("institutional-events")) {
          await fetchInstitutionalEvents();
        } else if (endpoint.includes("announcements-photos")) {
          await fetchCarouselImages();
        } else if (endpoint.includes("advertisements")) {
          await fetchAnnouncements();
        }
      } else {
        const error = await response.json();
        alert("Error: " + (error.message || "No se pudo actualizar el estado"));
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      alert("Error al cambiar el estado");
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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Elemento eliminado exitosamente");
        if (endpoint.includes("calendar-events")) {
          await fetchCalendarEvents();
        } else if (endpoint.includes("question-bank/questions")) {
          await fetchQuestions();
        } else if (endpoint.includes("question-bank/categories")) {
          await fetchCategories();
        } else if (endpoint.includes("institutional-events")) {
          await fetchInstitutionalEvents();
        } else if (endpoint.includes("announcements-photos")) {
          await fetchCarouselImages();
        } else if (endpoint.includes("advertisements")) {
          await fetchAnnouncements();
        } else if (endpoint.includes("auth/users")) {
          await fetchUsers();
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
    setPasswordConfirm("");
    setPasswordError("");
  };

  // Filtrado de búsqueda
  const filterItems = (items, searchFields) => {
    if (!searchTerm) return items;

    return items.filter((item) => {
      return searchFields.some((field) => {
        const value = field.split(".").reduce((obj, key) => obj?.[key], item);
        return value
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    });
  };

  // Servicios principales
  const services = [
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
        const title = formData.get("title");
        data = {
          title: title.toUpperCase(),
          description: formData.get("description"),
          type: formData.get("type"),
          start_date: formData.get("start_date"),
          end_date: formData.get("end_date"),
          url: formData.get("url") || undefined,
          state: editModal.data.state,
        };
        handleUpdate("/information/calendar-events", editModal.data.id, data);
      } else if (editModal.type === "institutional") {
        data = {
          title: formData.get("title"),
          description: formData.get("description"),
          start_date: formData.get("start_date"),
          end_date: formData.get("end_date"),
          type: formData.get("type"),
          location: formData.get("location"),
          url: formData.get("url") || undefined,
          state: editModal.data.state,
        };
        handleUpdate(
          "/information/institutional-events",
          editModal.data.id,
          data,
        );
      } else if (editModal.type === "carousel") {
        data = {
          title: formData.get("title"),
          state: editModal.data.state,
        };
        handleUpdate(
          "/information/announcements-photos",
          editModal.data.id,
          data,
        );
      } else if (editModal.type === "announcement") {
        data = {
          title: formData.get("title"),
          description: formData.get("description"),
          date: formData.get("date"),
          type: formData.get("type"),
          state: editModal.data.state,
        };
        handleUpdate("/information/advertisements", editModal.data.id, data);
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
      } else if (editModal.type === "category") {
        data = {
          name: formData.get("name"),
          description: formData.get("description"),
        };
        handleUpdate(
          "/information/question-bank/categories",
          editModal.data.categoryId,
          data,
        );
      } else if (editModal.type === "user") {
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");

        if (password && password !== confirmPassword) {
          setPasswordError("Las contraseñas no coinciden");
          return;
        }

        data = {
          username: formData.get("username"),
          password: password || undefined,
          role: formData.get("role"),
        };
        handleUpdate("/auth/users", editModal.data.id, data);
      }
    };

    return (
      <div
        className="modal-overlay"
        onClick={() => {
          setEditModal({ isOpen: false, type: "", data: null });
          setPasswordError("");
        }}
      >
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>
              Editar{" "}
              {editModal.type === "calendar"
                ? "Evento del Calendario"
                : editModal.type === "institutional"
                  ? "Evento Institucional"
                  : editModal.type === "carousel"
                    ? "Imagen del Carrusel"
                    : editModal.type === "announcement"
                      ? "Anuncio"
                      : editModal.type === "question"
                        ? "Pregunta"
                        : editModal.type === "category"
                          ? "Categoría"
                          : "Usuario"}
            </h3>
            <button
              className="modal-close"
              onClick={() => {
                setEditModal({ isOpen: false, type: "", data: null });
                setPasswordError("");
              }}
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
                    <select
                      name="type"
                      defaultValue={editModal.data?.type}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="ACADEMIC">Académico</option>
                      <option value="EVALUATION">Evaluación</option>
                      <option value="HOLIDAY">Festivo</option>
                      <option value="MEETING">Reunión</option>
                    </select>
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
                    <label>Fecha de Fin *</label>
                    <input
                      type="date"
                      name="end_date"
                      defaultValue={editModal.data?.end_date}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>URL (Opcional)</label>
                  <input
                    type="url"
                    name="url"
                    defaultValue={editModal.data?.url}
                    placeholder="https://ejemplo.com"
                  />
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
                    <label>Tipo *</label>
                    <select
                      name="type"
                      defaultValue={editModal.data?.type}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="ACADEMIC">Académico</option>
                      <option value="SPORT">Deportivo</option>
                      <option value="CULTURAL">Cultural</option>
                      <option value="MEETING">Reunión</option>
                    </select>
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
                  <label>URL (Opcional)</label>
                  <input
                    type="url"
                    name="url"
                    defaultValue={editModal.data?.url}
                    placeholder="https://ejemplo.com"
                  />
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

            {editModal.type === "carousel" && (
              <>
                <div className="form-group">
                  <label>Título de la Imagen *</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editModal.data?.title}
                    required
                  />
                </div>
                <div className="image-preview-container">
                  <label>Imagen Actual:</label>
                  <div className="image-preview">
                    <img
                      src={editModal.data?.imageUrl}
                      alt={editModal.data?.title}
                    />
                  </div>
                </div>
              </>
            )}

            {editModal.type === "announcement" && (
              <>
                <div className="form-group">
                  <label>Título del Anuncio *</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editModal.data?.title}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha *</label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={editModal.data?.date}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipo *</label>
                    <select
                      name="type"
                      defaultValue={editModal.data?.type}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="important">Importante</option>
                      <option value="alert">Alerta</option>
                      <option value="news">Novedad</option>
                      <option value="general">General</option>
                    </select>
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
                  <select
                    name="categoryName"
                    defaultValue={editModal.data?.categoryName}
                    required
                  >
                    <option value="">Seleccionar categoría...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
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

            {editModal.type === "category" && (
              <>
                <div className="form-group">
                  <label>Nombre de la Categoría *</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editModal.data?.name}
                    required
                  />
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

            {editModal.type === "user" && (
              <>
                <div className="form-group">
                  <label>Nombre de Usuario *</label>
                  <input
                    type="text"
                    name="username"
                    defaultValue={editModal.data?.username}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nueva Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Dejar en blanco para mantener la actual"
                    onChange={(e) => {
                      if (
                        passwordConfirm &&
                        e.target.value !== passwordConfirm
                      ) {
                        setPasswordError("Las contraseñas no coinciden");
                      } else {
                        setPasswordError("");
                      }
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar contraseña"
                    value={passwordConfirm}
                    onChange={(e) => {
                      setPasswordConfirm(e.target.value);
                      const password = document.querySelector(
                        'input[name="password"]',
                      ).value;
                      if (password && e.target.value !== password) {
                        setPasswordError("Las contraseñas no coinciden");
                      } else {
                        setPasswordError("");
                      }
                    }}
                  />
                  {passwordError && (
                    <p
                      style={{
                        color: "#ff4444",
                        fontSize: "0.85rem",
                        marginTop: "8px",
                      }}
                    >
                      {passwordError}
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <label>Rol *</label>
                  <select
                    name="role"
                    defaultValue={editModal.data?.role}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="USER">Usuario</option>
                    <option value="ADMIN">Administrador</option>
                    <option value="SUPERADMIN">Super Administrador</option>
                  </select>
                </div>
              </>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setEditModal({ isOpen: false, type: "", data: null });
                  setPasswordError("");
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="primary-btn"
                disabled={loading || passwordError}
              >
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

      case "calendario-academico":
        const filteredCalendarEvents = filterItems(calendarEvents, [
          "title",
          "description",
          "type",
        ]);

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
                  const title = formData.get("title");
                  const data = {
                    title: title.toUpperCase(),
                    description: formData.get("description"),
                    type: formData.get("type"),
                    start_date: formData.get("start_date"),
                    end_date: formData.get("end_date"),
                    url: formData.get("url") || undefined,
                  };
                  handleCreate("/information/calendar-events", data);
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
                    <select name="type" required>
                      <option value="">Seleccionar...</option>
                      <option value="ACADEMIC">Académico</option>
                      <option value="EVALUATION">Evaluación</option>
                      <option value="HOLIDAY">Festivo</option>
                      <option value="MEETING">Reunión</option>
                    </select>
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
                  <label>URL (Opcional)</label>
                  <input
                    type="url"
                    name="url"
                    placeholder="https://ejemplo.com"
                  />
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
              <div className="list-header">
                <h3 className="form-title">Eventos Registrados</h3>
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar eventos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              {loading ? (
                <div className="loading-state">Cargando eventos...</div>
              ) : filteredCalendarEvents.length === 0 ? (
                <div className="empty-state">No hay eventos registrados</div>
              ) : (
                <div className="event-list">
                  {filteredCalendarEvents.map((event) => (
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
                          className={`icon-btn state ${event.state ? "active" : "inactive"}`}
                          onClick={() =>
                            handleToggleState(
                              "/information/calendar-events",
                              event.id,
                              event.state,
                            )
                          }
                          title={
                            event.state
                              ? "Ocultar en página"
                              : "Mostrar en página"
                          }
                        >
                          {event.state ? "👁️" : "👁️‍🗨️"}
                        </button>
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
                              "/information/calendar-events",
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
        const filteredQuestions = filterItems(questions, [
          "question",
          "answer",
          "categoryName",
        ]);
        const filteredCategories = filterItems(categories, [
          "name",
          "description",
        ]);

        return (
          <div className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-icon">📝</span>
                Banco de Preguntas
              </h2>
              <p className="section-subtitle">
                Gestión de preguntas, respuestas y categorías
              </p>
            </div>

            {/* GESTIÓN DE CATEGORÍAS */}
            <div className="form-container">
              <h3 className="form-title">📁 Gestión de Categorías</h3>
              <form
                className="data-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = {
                    name: formData.get("name"),
                    description: formData.get("description"),
                  };
                  handleCreate("/information/question-bank/categories", data);
                  e.target.reset();
                }}
              >
                <div className="form-group">
                  <label>Nombre de la Categoría *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ej: Matemáticas, Física, Historia..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Descripción *</label>
                  <textarea
                    name="description"
                    rows="3"
                    placeholder="Describe la categoría y su propósito..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Guardando..." : "Crear Categoría"}
                </button>
              </form>
            </div>

            <div className="list-container">
              <div className="list-header">
                <h3 className="form-title">Categorías Registradas</h3>
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar categorías..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              {loading ? (
                <div className="loading-state">Cargando categorías...</div>
              ) : filteredCategories.length === 0 ? (
                <div className="empty-state">No hay categorías registradas</div>
              ) : (
                <div className="data-table">
                  <div className="table-header">
                    <span>Nombre</span>
                    <span>Descripción</span>
                    <span>Acciones</span>
                  </div>
                  {filteredCategories.map((cat) => (
                    <div key={cat.id} className="table-row">
                      <span className="highlight-text">{cat.name}</span>
                      <span
                        style={{
                          maxWidth: "400px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {cat.description}
                      </span>
                      <div className="row-actions">
                        <button
                          className="icon-btn edit"
                          onClick={() => openEditModal("category", cat)}
                        >
                          ✏️
                        </button>
                        <button
                          className="icon-btn delete"
                          onClick={() =>
                            handleDelete(
                              "/information/question-bank/categories",
                              cat.categoryId,
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

            {/* GESTIÓN DE PREGUNTAS */}
            <div className="form-container" style={{ marginTop: "40px" }}>
              <h3 className="form-title">❓ Nueva Pregunta</h3>
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
                  <select name="categoryName" required>
                    <option value="">Seleccionar categoría...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
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
              ) : filteredQuestions.length === 0 ? (
                <div className="empty-state">No hay preguntas registradas</div>
              ) : (
                <div className="data-table">
                  <div className="table-header">
                    <span>Pregunta</span>
                    <span>Categoría</span>
                    <span>Respuesta</span>
                    <span>Acciones</span>
                  </div>
                  {filteredQuestions.map((q) => (
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
        const filteredInstitutionalEvents = filterItems(institutionalEvents, [
          "title",
          "description",
          "location",
          "type",
        ]);

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
                    url: formData.get("url") || undefined,
                  };
                  handleCreate("/information/institutional-events", data);
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
                    <label>Tipo de evento *</label>
                    <select name="type" required>
                      <option value="">Seleccionar...</option>
                      <option value="ACADEMIC">Académico</option>
                      <option value="SPORT">Deportivo</option>
                      <option value="CULTURAL">Cultural</option>
                      <option value="MEETING">Reunión</option>
                    </select>
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
                  <label>URL (Opcional)</label>
                  <input
                    type="url"
                    name="url"
                    placeholder="https://ejemplo.com"
                  />
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
              <div className="list-header">
                <h3 className="form-title">Eventos Programados</h3>
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar eventos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              {loading ? (
                <div className="loading-state">Cargando eventos...</div>
              ) : filteredInstitutionalEvents.length === 0 ? (
                <div className="empty-state">No hay eventos programados</div>
              ) : (
                <div className="event-list">
                  {filteredInstitutionalEvents.map((event) => (
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
                          className={`icon-btn state ${event.state ? "active" : "inactive"}`}
                          onClick={() =>
                            handleToggleState(
                              "/information/institutional-events",
                              event.id,
                              event.state,
                            )
                          }
                          title={
                            event.state
                              ? "Ocultar en página"
                              : "Mostrar en página"
                          }
                        >
                          {event.state ? "👁️" : "👁️‍🗨️"}
                        </button>
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
                              "/information/institutional-events",
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
        const filteredAnnouncements = filterItems(announcements, [
          "title",
          "description",
          "type",
        ]);
        const filteredCarouselImages = filterItems(carouselImages, ["title"]);

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

            {/* ANUNCIOS DE TEXTO */}
            <div className="form-container">
              <h3 className="form-title">📝 Anuncios de Texto</h3>
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
                  handleCreate("/information/advertisements", data);
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
                    <select name="type" required>
                      <option value="">Seleccionar...</option>
                      <option value="important">Importante</option>
                      <option value="alert">Alerta</option>
                      <option value="news">Novedad</option>
                      <option value="general">General</option>
                    </select>
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
              <div className="list-header">
                <h3 className="form-title">Anuncios de Texto Publicados</h3>
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar anuncios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              {loading ? (
                <div className="loading-state">Cargando anuncios...</div>
              ) : filteredAnnouncements.length === 0 ? (
                <div className="empty-state">No hay anuncios publicados</div>
              ) : (
                <div className="data-table">
                  <div className="table-header">
                    <span>Título</span>
                    <span>Tipo</span>
                    <span>Fecha</span>
                    <span>Acciones</span>
                  </div>
                  {filteredAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="table-row">
                      <span
                        style={{
                          maxWidth: "300px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {announcement.title}
                      </span>
                      <span
                        className="role-badge"
                        style={{
                          background:
                            announcement.type === "important"
                              ? "rgba(255, 136, 0, 0.2)"
                              : announcement.type === "alert"
                                ? "rgba(255, 0, 0, 0.2)"
                                : "rgba(0, 136, 255, 0.2)",
                          color:
                            announcement.type === "important"
                              ? "#ffa500"
                              : announcement.type === "alert"
                                ? "#ff0000"
                                : "#0088ff",
                        }}
                      >
                        {announcement.type}
                      </span>
                      <span>
                        {new Date(announcement.date).toLocaleDateString(
                          "es-ES",
                        )}
                      </span>
                      <div className="row-actions">
                        <button
                          className={`icon-btn state ${announcement.state ? "active" : "inactive"}`}
                          onClick={() =>
                            handleToggleState(
                              "/information/advertisements",
                              announcement.id,
                              announcement.state,
                            )
                          }
                          title={
                            announcement.state
                              ? "Ocultar en página"
                              : "Mostrar en página"
                          }
                        >
                          {announcement.state ? "👁️" : "👁️‍🗨️"}
                        </button>
                        <button
                          className="icon-btn edit"
                          onClick={() =>
                            openEditModal("announcement", announcement)
                          }
                        >
                          ✏️
                        </button>
                        <button
                          className="icon-btn view"
                          onClick={() =>
                            alert(
                              `${announcement.title}\n\n${announcement.description}`,
                            )
                          }
                        >
                          👁️
                        </button>
                        <button
                          className="icon-btn delete"
                          onClick={() =>
                            handleDelete(
                              "/information/advertisements",
                              announcement.id,
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

            {/* CARRUSEL DE IMÁGENES */}
            <div className="form-container" style={{ marginTop: "40px" }}>
              <h3 className="form-title">🖼️ Carrusel de Imágenes</h3>
              <form
                className="data-form"
                onSubmit={handleCreatePhotoAnnouncement}
              >
                <div className="form-group">
                  <label>Título de la Imagen *</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Ej: Evento de Graduación 2025"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Seleccionar Imagen *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="file-input"
                  />
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#999",
                      marginTop: "8px",
                    }}
                  >
                    Formatos: JPG, PNG (Máx. 20MB)
                  </p>
                </div>
                {imagePreview && (
                  <div className="image-preview-container">
                    <label>Vista Previa:</label>
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  </div>
                )}
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Subiendo..." : "Subir Imagen al Carrusel"}
                </button>
              </form>
            </div>

            <div className="list-container">
              <div className="list-header">
                <h3 className="form-title">Imágenes del Carrusel</h3>
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar imágenes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              {loading ? (
                <div className="loading-state">Cargando imágenes...</div>
              ) : filteredCarouselImages.length === 0 ? (
                <div className="empty-state">
                  No hay imágenes en el carrusel
                </div>
              ) : (
                <div className="carousel-grid">
                  {filteredCarouselImages.map((image) => (
                    <div key={image.id} className="carousel-card">
                      <div className="carousel-image">
                        <img src={image.imageUrl} alt={image.title} />
                      </div>
                      <div className="carousel-info">
                        <h4>{image.title}</h4>
                        <p style={{ fontSize: "0.85rem", color: "#999" }}>
                          Subida:{" "}
                          {new Date(image.uploadDate).toLocaleDateString(
                            "es-ES",
                          )}
                        </p>
                      </div>
                      <div className="carousel-actions">
                        <button
                          className={`icon-btn state ${image.state ? "active" : "inactive"}`}
                          onClick={() =>
                            handleToggleState(
                              "/information/announcements-photos",
                              image.id,
                              image.state,
                            )
                          }
                          title={
                            image.state
                              ? "Ocultar en página"
                              : "Mostrar en página"
                          }
                        >
                          {image.state ? "👁️" : "👁️‍🗨️"}
                        </button>
                        <button
                          className="icon-btn edit"
                          onClick={() => openEditModal("carousel", image)}
                        >
                          ✏️
                        </button>
                        <button
                          className="icon-btn delete"
                          onClick={() =>
                            handleDelete(
                              "/information/announcements-photos",
                              image.id,
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

      case "usuarios":
        const filteredUsers = filterItems(users, ["username", "role"]);

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
                  <form
                    className="data-form"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target);
                      const password = formData.get("password");
                      const confirmPassword = formData.get("confirmPassword");

                      if (password !== confirmPassword) {
                        alert("Las contraseñas no coinciden");
                        return;
                      }

                      const data = {
                        username: formData.get("username"),
                        password: password,
                        role: formData.get("role"),
                      };

                      await handleCreate("/auth/users", data);
                      e.target.reset();
                      setPasswordConfirm("");
                    }}
                  >
                    <div className="form-group">
                      <label>Nombre de Usuario *</label>
                      <input
                        type="text"
                        name="username"
                        placeholder="username"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Contraseña *</label>
                      <input
                        type="text"
                        name="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirmar Contraseña *</label>
                      <input
                        type="text"
                        name="confirmPassword"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Rol *</label>
                      <select name="role" required>
                        <option value="">Seleccionar...</option>
                        <option value="ADMIN">Administrador</option>
                        <option value="SUPERADMIN">Super Administrador</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={loading}
                    >
                      {loading ? "Creando..." : "Crear Usuario"}
                    </button>
                  </form>
                </div>
                <div className="list-container">
                  <div className="list-header">
                    <h3 className="form-title">Usuarios Existentes</h3>
                    <div className="search-box">
                      <span className="search-icon">🔍</span>
                      <input
                        type="text"
                        placeholder="Buscar usuarios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  {loading ? (
                    <div className="loading-state">Cargando usuarios...</div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="empty-state">
                      No hay usuarios registrados
                    </div>
                  ) : (
                    <div className="data-table">
                      <div className="table-header">
                        <span>Usuario</span>
                        <span>Rol</span>
                        <span>MFA Configurado</span>
                        <span>Acciones</span>
                      </div>
                      {filteredUsers.map((user) => (
                        <div key={user.id} className="table-row">
                          <span>{user.username}</span>
                          <span
                            className={`role-badge ${user.role.toLowerCase()}`}
                          >
                            {user.role}
                          </span>
                          <span>
                            {!user.mfaPending ? (
                              <span style={{ color: "#4ade80" }}>✓ Sí</span>
                            ) : !user.mfaPending ? (
                              <span style={{ color: "#fbbf24" }}>
                                ⏳ Pendiente
                              </span>
                            ) : (
                              <span style={{ color: "#f87171" }}>✗ No</span>
                            )}
                          </span>
                          <div className="row-actions">
                            <button
                              className="icon-btn edit"
                              onClick={() => openEditModal("user", user)}
                            >
                              ✏️
                            </button>
                            <button
                              className="icon-btn delete"
                              onClick={() =>
                                handleDelete("/auth/users", user.id)
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

  if (fullLoading) {
    return <div className="loader">Cargando...</div>;
  }

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
                setSearchTerm("");
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
