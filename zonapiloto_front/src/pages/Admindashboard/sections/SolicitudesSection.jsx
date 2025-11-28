import React, { useState, useEffect } from "react";
import SearchBox from "../shared/SearchBox";
import "../../../styles/admin_dashboard/sections/solicitudessection.css";

const SolicitudesSection = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    const API_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/pending-users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setPendingUsers(data);
            } else {
                console.error('Error al cargar solicitudes');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmUser = async (userId, confirm) => {
        try {
            const body = {
                user_id: userId.toString(),
                confirm: confirm.toString()
            };

            if (!confirm && rejectReason) {
                body.reject_reason = rejectReason;
            }

            const response = await fetch(`${API_URL}/auth/registration/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(body)
            });

            if (response.ok) {
                alert(confirm ? 'Usuario aprobado exitosamente' : 'Usuario rechazado');
                setShowConfirmModal(false);
                setSelectedUser(null);
                setRejectReason("");
                fetchPendingUsers();
            } else {
                const data = await response.json();
                alert(data.error || 'Error al procesar la solicitud');
            }
        } catch (error) {
            alert('Error al procesar la solicitud');
            console.error('Error:', error);
        }
    };

    const openConfirmModal = (user, action) => {
        setSelectedUser({ ...user, action });
        setShowConfirmModal(true);
    };

    const openDocumentsModal = (user) => {
        setSelectedUser(user);
        setShowDocumentsModal(true);
    };

    const openDocument = (documentUri) => {
        const fullUrl = `${API_URL}${documentUri}`;
        window.open(fullUrl, '_blank');
    };

    const filterItems = (items, fields) => {
        if (!searchTerm) return items;
        return items.filter(item =>
            fields.some(field =>
                item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    };

    const filteredUsers = filterItems(pendingUsers, ["username", "email", "roleRequested"]);

    const getRoleName = (role) => {
        const roleNames = {
            RESTAURANT_ADMIN: "Administrador de Restaurante",
            EVENT_ADMIN: "Administrador de Eventos",
            QUESTIONS_ADMIN: "Administrador de Preguntas",
            EVENTSADMIN: "Administrador de Eventos"
        };
        return roleNames[role] || role;
    };

    const getRoleIcon = (role) => {
        const roleIcons = {
            RESTAURANT_ADMIN: "🍽️",
            EVENT_ADMIN: "📅",
            QUESTIONS_ADMIN: "❓",
            EVENTSADMIN: "📅"
        };
        return roleIcons[role] || "👤";
    };

    const getRoleColor = (role) => {
        const roleColors = {
            RESTAURANT_ADMIN: "#93c563",
            EVENT_ADMIN: "#b4360f",
            QUESTIONS_ADMIN: "#FF9800",
            EVENTSADMIN: "#b4360f"
        };
        return roleColors[role] || "#666";
    };

    const getDocumentDisplayName = (docName) => {
        const names = {
            "identityDocument": "Documento de Identidad",
            "documento": "Documento de Identidad",
            "chamberOfCommerce": "Certificado de Cámara de Comercio",
            "rut": "RUT",
            "requestLetter": "Carta de Solicitud",
            "carta_de_solicitud": "Carta de Solicitud",
            "departmentLetter": "Carta de Dependencia",
            "carta_administrativa": "Carta Administrativa/Dependencia",
            "laborCertificate": "Certificado Laboral",
            "certificado_laboral": "Certificado Laboral"
        };
        return names[docName] || docName;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="dashboard-section">
            <div className="section-header">
                <h2 className="section-title">
                    <span className="title-icon">📋</span>
                    Solicitudes de Registro
                </h2>
                <p className="section-subtitle">
                    Gestión de solicitudes pendientes de aprobación
                </p>
            </div>

            <div className="list-container">
                <div className="list-header">
                    <h3 className="form-title">Solicitudes Pendientes</h3>
                    <SearchBox
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        placeholder="Buscar por nombre, email o rol..."
                    />
                </div>

                {loading ? (
                    <div className="loading-state">Cargando solicitudes...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="empty-state">
                        {searchTerm ? "No se encontraron solicitudes" : "No hay solicitudes pendientes"}
                    </div>
                ) : (
                    <div className="solicitudes-grid">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="solicitud-card"
                                style={{ "--role-color": getRoleColor(user.roleRequested) }}
                            >
                                <div className="solicitud-header">
                                    <div className="user-info">
                                        <span className="role-icon">{getRoleIcon(user.roleRequested)}</span>
                                        <div className="user-details">
                                            <h4 className="user-name">{user.username}</h4>
                                            <p className="user-email">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className="role-badge" style={{ backgroundColor: getRoleColor(user.roleRequested) }}>
                                        {getRoleName(user.roleRequested)}
                                    </span>
                                </div>

                                <div className="solicitud-info">
                                    <div className="info-item">
                                        <span className="info-label">📅 Fecha de solicitud:</span>
                                        <span className="info-value">{formatDate(user.createdAt)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">📄 Documentos:</span>
                                        <span className="info-value">{user.documents?.length || 0} archivos</span>
                                    </div>
                                </div>

                                <div className="solicitud-actions">
                                    <button
                                        className="action-btn view-docs-btn"
                                        onClick={() => openDocumentsModal(user)}
                                    >
                                        <span>📎</span> Ver Documentos
                                    </button>
                                    <button
                                        className="action-btn approve-btn"
                                        onClick={() => openConfirmModal(user, 'approve')}
                                    >
                                        <span>✓</span> Aprobar
                                    </button>
                                    <button
                                        className="action-btn reject-btn"
                                        onClick={() => openConfirmModal(user, 'reject')}
                                    >
                                        <span>✗</span> Rechazar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de Confirmación */}
            {showConfirmModal && selectedUser && (
                <div className="modal-overlay" onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedUser(null);
                    setRejectReason("");
                }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">
                            {selectedUser.action === 'approve'
                                ? '¿Aprobar solicitud?'
                                : '¿Rechazar solicitud?'}
                        </h3>

                        <div className="modal-user-info">
                            <p><strong>Usuario:</strong> {selectedUser.username}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Rol:</strong> {getRoleName(selectedUser.roleRequested)}</p>
                        </div>

                        {selectedUser.action === 'reject' && (
                            <div className="form-group">
                                <label htmlFor="rejectReason">Motivo del rechazo *</label>
                                <textarea
                                    id="rejectReason"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Explica la razón del rechazo..."
                                    rows="4"
                                    required
                                />
                            </div>
                        )}

                        <div className="modal-buttons">
                            <button
                                onClick={() => {
                                    setShowConfirmModal(false);
                                    setSelectedUser(null);
                                    setRejectReason("");
                                }}
                                className="modal-btn cancel-btn"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    if (selectedUser.action === 'reject' && !rejectReason.trim()) {
                                        alert('Por favor ingresa el motivo del rechazo');
                                        return;
                                    }
                                    handleConfirmUser(
                                        selectedUser.id,
                                        selectedUser.action === 'approve'
                                    );
                                }}
                                className={`modal-btn ${selectedUser.action === 'approve' ? 'confirm-approve-btn' : 'confirm-reject-btn'}`}
                            >
                                {selectedUser.action === 'approve' ? 'Aprobar' : 'Rechazar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Documentos */}
            {showDocumentsModal && selectedUser && (
                <div className="modal-overlay" onClick={() => {
                    setShowDocumentsModal(false);
                    setSelectedUser(null);
                }}>
                    <div className="modal-content documents-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">
                            📎 Documentos de {selectedUser.username}
                        </h3>

                        <div className="modal-user-info">
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Rol:</strong> {getRoleName(selectedUser.roleRequested)}</p>
                        </div>

                        <div className="documents-list">
                            {selectedUser.documents && selectedUser.documents.length > 0 ? (
                                selectedUser.documents.map((doc) => (
                                    <div key={doc.id} className="document-item">
                                        <div className="document-info">
                                            <span className="document-icon">📄</span>
                                            <div className="document-details">
                                                <p className="document-name">
                                                    {getDocumentDisplayName(doc.documentName)}
                                                </p>
                                                <p className="document-path">
                                                    {doc.documentUri.split('/').pop()}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            className="document-btn"
                                            onClick={() => openDocument(doc.documentUri)}
                                        >
                                            <span>👁️</span> Ver
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state">
                                    No hay documentos disponibles
                                </div>
                            )}
                        </div>

                        <div className="modal-buttons">
                            <button
                                onClick={() => {
                                    setShowDocumentsModal(false);
                                    setSelectedUser(null);
                                }}
                                className="modal-btn cancel-btn"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SolicitudesSection;