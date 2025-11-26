import { useState, useEffect } from "react";

const useAdminData = () => {
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
                // const resp = await fetch(`${API_URL}/auth/users/me`, {
                //     method: "GET",
                //     credentials: "include",
                // });

                // if (!resp.ok) {
                //     sessionStorage.clear();
                //     window.location.href = "/loggin";
                //     return;
                // }
                const data = { user: "admin", role: "SUPERADMIN" };
                // const data = await resp.json();
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
    }, [API_URL]);

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
            let response;
            if (endpoint == "/information/announcements-photos") {
                response = await fetch(`${API_URL}${endpoint}/${id}`, {
                    method: "PUT",
                    credentials: "include",
                    body: data,
                });
            } else {
                response = await fetch(`${API_URL}${endpoint}/${id}`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
            }

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
                } else if (endpoint.includes("advertisements")) {
                    await fetchAnnouncements();
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

    return {
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
        selectedFile,
        setSelectedFile,
        imagePreview,
        setImagePreview,
        searchTerm,
        setSearchTerm,
        editModal,
        setEditModal,
        passwordConfirm,
        setPasswordConfirm,
        passwordError,
        setPasswordError,
        handleLogout,
        fetchCalendarEvents,
        fetchQuestions,
        fetchCategories,
        fetchInstitutionalEvents,
        fetchAnnouncements,
        fetchCarouselImages,
        fetchUsers,
        handleFileChange,
        handleCreatePhotoAnnouncement,
        handleCreate,
        handleUpdate,
        handleDelete,
        openEditModal,
        filterItems,
    };
};

export default useAdminData;