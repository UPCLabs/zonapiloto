import React from "react";
import useAdminData from "../hooks/useAdminData.js";
import Sidebar from "../layout/Sidebar.jsx";
import Header from "../layout/HeaderAdminDash.jsx";
import Footer from "../layout/FooterAdmin.jsx";
import InicioSection from "../sections/InicioSection.jsx";
import CalendarioSection from "../sections/CalendarioSection.jsx";
import BancoPreguntasSection from "../sections/BancoPreguntasSection.jsx";
import EventosInstitucionalesSection from "../sections/EventosInstitucionalesSection.jsx";
import AnunciosSection from "../sections/AnunciosSection.jsx";
import UsuariosSection from "../sections/UsuariosSection.jsx";
import AddSection from "../sections/AddSection.jsx";
import EditModal from "../modals/EditModal.jsx";
import "../../../styles/admin_dashboard/componen/admindashboard.css";

const AdminDashboard = () => {
    const {
        API_URL,
        menuOpen,
        setMenuOpen,
        activeSection,
        setActiveSection,
        username,
        userRole,
        calendarEvents,
        questions,
        categories,
        institutionalEvents,
        announcements,
        carouselImages,
        users,
        loading,
        fullLoading,
        imagePreview,
        searchTerm,
        setSearchTerm,
        editModal,
        setEditModal,
        passwordConfirm,
        setPasswordConfirm,
        passwordError,
        setPasswordError,
        handleLogout,
        handleFileChange,
        handleCreatePhotoAnnouncement,
        handleCreate,
        handleUpdate,
        handleDelete,
        openEditModal,
        filterItems,
    } = useAdminData();

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
        item.roles.includes(userRole)
    );

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
    };

    const renderContent = () => {
        switch (activeSection) {
            case "inicio":
                return (
                    <InicioSection
                        services={services.filter((s) => s.roles.includes(userRole))}
                        setActiveSection={setActiveSection}
                    />
                );

            case "calendario-academico":
                return (
                    <CalendarioSection
                        calendarEvents={calendarEvents}
                        loading={loading}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleCreate={handleCreate}
                        openEditModal={openEditModal}
                        handleDelete={handleDelete}
                        filterItems={filterItems}
                        formatDate={formatDate}
                    />
                );

            case "banco-preguntas":
                return (
                    <BancoPreguntasSection
                        questions={questions}
                        categories={categories}
                        loading={loading}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleCreate={handleCreate}
                        openEditModal={openEditModal}
                        handleDelete={handleDelete}
                        filterItems={filterItems}
                    />
                );

            case "eventos-institucionales":
                return (
                    <EventosInstitucionalesSection
                        institutionalEvents={institutionalEvents}
                        loading={loading}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleCreate={handleCreate}
                        openEditModal={openEditModal}
                        handleDelete={handleDelete}
                        filterItems={filterItems}
                        formatDate={formatDate}
                    />
                );

            case "anuncios":
                return (
                    <AnunciosSection
                        announcements={announcements}
                        carouselImages={carouselImages}
                        loading={loading}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        handleCreate={handleCreate}
                        handleCreatePhotoAnnouncement={handleCreatePhotoAnnouncement}
                        openEditModal={openEditModal}
                        handleDelete={handleDelete}
                        filterItems={filterItems}
                        handleFileChange={handleFileChange}
                        imagePreview={imagePreview}
                        API_URL={API_URL}
                    />
                );

            case "usuarios":
                return (
                    <UsuariosSection
                        users={users}
                        userRole={userRole}
                        loading={loading}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        passwordConfirm={passwordConfirm}
                        setPasswordConfirm={setPasswordConfirm}
                        handleCreate={handleCreate}
                        openEditModal={openEditModal}
                        handleDelete={handleDelete}
                        filterItems={filterItems}
                    />
                );

            case "configuracion":
                return <AddSection />;

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

            <Sidebar
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                username={username}
                userRole={userRole}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                setSearchTerm={setSearchTerm}
                handleLogout={handleLogout}
                filteredMenuItems={filteredMenuItems}
            />

            <div className="main-content">
                <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

                <main className="dashboard-content">{renderContent()}</main>

                <Footer />
            </div>

            <EditModal
                editModal={editModal}
                setEditModal={setEditModal}
                categories={categories}
                API_URL={API_URL}
                handleUpdate={handleUpdate}
                loading={loading}
                passwordError={passwordError}
                setPasswordError={setPasswordError}
                passwordConfirm={passwordConfirm}
                setPasswordConfirm={setPasswordConfirm}
            />
        </div>
    );
};

export default AdminDashboard;