import React from "react";
import SearchBox from "../shared/SearchBox";
import DataTable from "../shared/DataTable";
import "../../../styles/admin_dashboard/sections/usuariossection.css";

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
    const filteredUsers = filterItems(users, ["username", "role"]);

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
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? "Creando..." : "Crear Usuario"}
                            </button>
                        </form>
                    </div>
                    <div className="list-container">
                        <div className="list-header">
                            <h3 className="form-title">Usuarios Existentes</h3>
                            <SearchBox
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                placeholder="Buscar usuarios..."
                            />
                        </div>
                        {loading ? (
                            <div className="loading-state">Cargando usuarios...</div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="empty-state">No hay usuarios registrados</div>
                        ) : (
                            <DataTable
                                headers={["Usuario", "Rol", "MFA Configurado", "Acciones"]}
                                data={filteredUsers}
                                renderRow={(user) => (
                                    <>
                                        <span>{user.username}</span>
                                        <span className={`role-badge ${user.role.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                        <span>
                                            {!user.mfaPending ? (
                                                <span style={{ color: "#4ade80" }}>✓ Sí</span>
                                            ) : !user.mfaPending ? (
                                                <span style={{ color: "#fbbf24" }}>⏳ Pendiente</span>
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