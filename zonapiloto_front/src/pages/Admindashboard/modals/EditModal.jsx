import React from "react";
import "../../../styles/admin_dashboard/modals/editmodal.css";

const EditModal = ({
  editModal,
  setEditModal,
  categories,
  API_URL,
  handleUpdate,
  loading,
  passwordError,
  setPasswordError,
  passwordConfirm,
  setPasswordConfirm,
}) => {
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
        state: formData.get("state") === "on",
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
        state: formData.get("state") === "on",
      };
      handleUpdate(
        "/information/institutional-events",
        editModal.data.id,
        data,
      );
    } else if (editModal.type === "carousel") {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.get("title"));
      formDataToSend.append("state", formData.get("state") === "on");
      const file = formData.get("file");
      if (file && file.size > 0) {
        formDataToSend.append("file", file);
      }
      handleUpdate(
        "/information/announcements-photos",
        editModal.data.id,
        formDataToSend,
      );
    } else if (editModal.type === "announcement") {
      data = {
        title: formData.get("title"),
        description: formData.get("description"),
        date: formData.get("date"),
        type: formData.get("type"),
        state: formData.get("state") === "on",
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
                <label>Descripción *</label>
                <textarea
                  name="description"
                  rows="3"
                  defaultValue={editModal.data?.description}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    name="state"
                    defaultChecked={editModal.data?.state}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span>Mostrar en la página principal</span>
                </label>
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
              <div className="form-group">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    name="state"
                    defaultChecked={editModal.data?.state}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span>Mostrar en la página principal</span>
                </label>
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
                    src={`${API_URL}${editModal.data?.url}`}
                    alt={editModal.data?.title}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Nueva Imagen (opcional):</label>
                <input type="file" name="file" accept="image/*" />
              </div>
              <div className="form-group">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    name="state"
                    defaultChecked={editModal.data?.state}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span>Mostrar en la página principal</span>
                </label>
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
                    <option value="IMPORTANT">Importante</option>
                    <option value="ALERT">Alerta</option>
                    <option value="NEWS">Novedad</option>
                    <option value="GENERAL">General</option>
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
              <div className="form-group">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    name="state"
                    defaultChecked={editModal.data?.state}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span>Mostrar en la página principal</span>
                </label>
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
                    if (passwordConfirm && e.target.value !== passwordConfirm) {
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
                  <option value="SUPERADMIN">Super Administrador</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="RESTAURANTADMIN">
                    Administrador De Restaurante
                  </option>
                  <option value="QUESTIONSADMIN">
                    Administrador De Banco De Pregungas
                  </option>
                  <option value="EVENTSADMIN">Administrador De Eventos</option>
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

export default EditModal;
