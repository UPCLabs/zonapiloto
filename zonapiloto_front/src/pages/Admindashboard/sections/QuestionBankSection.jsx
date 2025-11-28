import React from "react";
import SearchBox from "../shared/SearchBox";
import DataTable from "../shared/DataTable";
import "../../../styles/admin_dashboard/sections/bancopreguntassection.css";

const BancoPreguntasSection = ({
    questions,
    categories,
    loading,
    searchTerm,
    setSearchTerm,
    handleCreate,
    openEditModal,
    handleDelete,
    filterItems,
}) => {
    const filteredQuestions = filterItems(questions, [
        "question",
        "answer",
        "categoryName",
    ]);
    const filteredCategories = filterItems(categories, ["name", "description"]);

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
                    <SearchBox
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        placeholder="Buscar categorías..."
                    />
                </div>
                {loading ? (
                    <div className="loading-state">Cargando categorías...</div>
                ) : filteredCategories.length === 0 ? (
                    <div className="empty-state">No hay categorías registradas</div>
                ) : (
                    <DataTable
                        headers={["Nombre", "Descripción", "Acciones"]}
                        data={filteredCategories}
                        renderRow={(cat) => (
                            <>
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
                                                cat.categoryId
                                            )
                                        }
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </>
                        )}
                    />
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
                    <DataTable
                        headers={["Pregunta", "Categoría", "Respuesta", "Acciones"]}
                        data={filteredQuestions}
                        renderRow={(q) => (
                            <>
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
                                                `Pregunta: ${q.question}\n\nCategoría: ${q.categoryName}\n\nRespuesta: ${q.answer}`
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
                                                q.questionId
                                            )
                                        }
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </>
                        )}
                    />
                )}
            </div>
        </div>
    );
};

export default BancoPreguntasSection;