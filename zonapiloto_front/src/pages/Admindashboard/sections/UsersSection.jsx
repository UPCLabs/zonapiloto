import React from "react";
import SearchBox from "../shared/SearchBox";
import DataTable from "../shared/DataTable";
import "../../../styles/admin_dashboard/sections/userssection.css";

const UsuariosSection = ({
  users,
  userRole,
  loading,
  searchTerm,
  setSearchTerm,
  passwordConfirm,
  setPasswordConfirm,
  handleCreate,
  openEditModal,
  handleDelete,
  filterItems,
}) => {
  const filteredUsers = filterItems(users, ["username", "role", "email"]);

  return (
    <div className="admin-dashboard-section">
      <div className="admin-section-header">
        <h2 className="admin-section-title">
          <span className="admin-title-icon">👥</span>
          Gestión de Usuarios
        </h2>
        <p className="admin-section-subtitle">
          Solo para Super Administradores
        </p>
      </div>

      {userRole === "SUPERADMIN" ? (
        <>
          {/* ---------- CREAR USUARIO ---------- */}
          <div className="admin-form-container">
            <div className="superadmin-badge">
              <span>👑</span>
              <span>Privilegios de Super Administrador</span>
            </div>

            <h3 className="admin-form-title">Crear Nuevo Usuario</h3>

            <form
              className="admin-data-form"
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
                  email: formData.get("email"),
                  password: password,
                  role: formData.get("role"),
                };

                await handleCreate("/auth/users", data);
                e.target.reset();
                setPasswordConfirm("");
              }}
            >
              <div className="admin-form-group">
                <label>Nombre de Usuario *</label>
                <input
                  type="text"
                  name="username"
                  placeholder="username"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="admin-form-group">
                <label>Correo Electrónico *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Contraseña *</label>
                <input
                  type="text"
                  name="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Confirmar Contraseña *</label>
                <input
                  type="text"
                  name="confirmPassword"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Rol *</label>
                <select name="role" required>
                  <option value="">Seleccionar...</option>
                  <option value="SUPERADMIN">Super Administrador</option>
                  <option value="RESTAURANTADMIN">
                    Administrador De Restaurante
                  </option>
                  <option value="QUESTIONSADMIN">
                    Administrador De Banco De Pregungas
                  </option>
                  <option value="EVENTSADMIN">Administrador De Eventos</option>
                </select>
              </div>

              <button
                type="submit"
                className="admin-submit-btn"
                disabled={loading}
              >
                {loading ? "Creando..." : "Crear Usuario"}
              </button>
            </form>
          </div>

          {/* ---------- LISTA DE USUARIOS ---------- */}
          <div className="admin-list-container">
            <div className="admin-list-header">
              <h3 className="admin-form-title">Usuarios Existentes</h3>
              <SearchBox
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Buscar usuarios..."
              />
            </div>

            {loading ? (
              <div className="admin-loading-state">Cargando usuarios...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="admin-empty-state">
                No hay usuarios registrados
              </div>
            ) : (
              <DataTable
                headers={[
                  "Usuario",
                  "Email",
                  "Rol",
                  "MFA Configurado",
                  "Acciones",
                ]}
                data={filteredUsers}
                renderRow={(user) => (
                  <>
                    <span>{user.username}</span>
                    <span>{user.email}</span> {/* ← AGREGADO */}
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                    <span>
                      {!user.mfaPending ? (
                        <span style={{ color: "#4ade80" }}>✓ Sí</span>
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
                        onClick={() => handleDelete("/auth/users", user.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              />
            )}
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
};

export default UsuariosSection;
