import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/services/profile.css";

const PerfilAcademico = () => {
    const [activeTab, setActiveTab] = useState("materias");
    const [selectedSemestre, setSelectedSemestre] = useState(6);

    const [perfil] = useState({
        id_perfil: 1,
        id_usuario: 123456,
        programa: "Ingeniería de Sistemas",
        semestre_actual: 6,
        promedio_general: 4.2,
        estado: "Activo"
    });

    const [todasLasMaterias] = useState({
        1: [
            { id_materia: 1, nombre_materia: "Cálculo I", codigo_materia: "MAT101", creditos: 4, horas_cursadas: 64, semestre_cursado: 1, nota: 3.8 },
            { id_materia: 2, nombre_materia: "Física I", codigo_materia: "FIS101", creditos: 3, horas_cursadas: 48, semestre_cursado: 1, nota: 3.9 },
            { id_materia: 3, nombre_materia: "Introducción a la Programación", codigo_materia: "IS101", creditos: 3, horas_cursadas: 48, semestre_cursado: 1, nota: 4.1 },
            { id_materia: 4, nombre_materia: "Química General", codigo_materia: "QUI101", creditos: 3, horas_cursadas: 48, semestre_cursado: 1, nota: 3.7 }
        ],
        2: [
            { id_materia: 5, nombre_materia: "Cálculo II", codigo_materia: "MAT102", creditos: 4, horas_cursadas: 64, semestre_cursado: 2, nota: 4.0 },
            { id_materia: 6, nombre_materia: "Física II", codigo_materia: "FIS102", creditos: 3, horas_cursadas: 48, semestre_cursado: 2, nota: 4.1 },
            { id_materia: 7, nombre_materia: "Estructuras de Datos", codigo_materia: "IS102", creditos: 4, horas_cursadas: 64, semestre_cursado: 2, nota: 4.2 },
            { id_materia: 8, nombre_materia: "Matemáticas Discretas", codigo_materia: "MAT103", creditos: 3, horas_cursadas: 48, semestre_cursado: 2, nota: 3.8 }
        ],
        3: [
            { id_materia: 9, nombre_materia: "Programación Orientada a Objetos", codigo_materia: "IS201", creditos: 4, horas_cursadas: 64, semestre_cursado: 3, nota: 4.2 },
            { id_materia: 10, nombre_materia: "Base de Datos I", codigo_materia: "IS202", creditos: 4, horas_cursadas: 64, semestre_cursado: 3, nota: 4.3 },
            { id_materia: 11, nombre_materia: "Algoritmos", codigo_materia: "IS203", creditos: 3, horas_cursadas: 48, semestre_cursado: 3, nota: 4.0 },
            { id_materia: 12, nombre_materia: "Probabilidad y Estadística", codigo_materia: "MAT201", creditos: 3, horas_cursadas: 48, semestre_cursado: 3, nota: 4.1 }
        ],
        4: [
            { id_materia: 13, nombre_materia: "Arquitectura de Computadores", codigo_materia: "IS301", creditos: 3, horas_cursadas: 48, semestre_cursado: 4, nota: 4.4 },
            { id_materia: 14, nombre_materia: "Sistemas Operativos", codigo_materia: "IS302", creditos: 4, horas_cursadas: 64, semestre_cursado: 4, nota: 4.2 },
            { id_materia: 15, nombre_materia: "Análisis y Diseño de Sistemas", codigo_materia: "IS303", creditos: 3, horas_cursadas: 48, semestre_cursado: 4, nota: 4.5 },
            { id_materia: 16, nombre_materia: "Compiladores", codigo_materia: "IS304", creditos: 3, horas_cursadas: 48, semestre_cursado: 4, nota: 4.1 }
        ],
        5: [
            { id_materia: 17, nombre_materia: "Inteligencia Artificial", codigo_materia: "IS401", creditos: 4, horas_cursadas: 64, semestre_cursado: 5, nota: 4.3 },
            { id_materia: 18, nombre_materia: "Seguridad Informática", codigo_materia: "IS402", creditos: 3, horas_cursadas: 48, semestre_cursado: 5, nota: 4.2 },
            { id_materia: 19, nombre_materia: "Gestión de Proyectos", codigo_materia: "IS403", creditos: 3, horas_cursadas: 48, semestre_cursado: 5, nota: 4.1 },
            { id_materia: 20, nombre_materia: "Cloud Computing", codigo_materia: "IS404", creditos: 3, horas_cursadas: 48, semestre_cursado: 5, nota: 4.3 }
        ],
        6: [
            { id_materia: 21, nombre_materia: "Desarrollo Web", codigo_materia: "IS501", creditos: 3, horas_cursadas: 48, semestre_cursado: 6, nota: 4.5 },
            { id_materia: 22, nombre_materia: "Base de Datos II", codigo_materia: "IS502", creditos: 4, horas_cursadas: 64, semestre_cursado: 6, nota: 4.3 },
            { id_materia: 23, nombre_materia: "Ingeniería de Software", codigo_materia: "IS503", creditos: 3, horas_cursadas: 48, semestre_cursado: 6, nota: 4.0 },
            { id_materia: 24, nombre_materia: "Redes de Computadores", codigo_materia: "IS504", creditos: 3, horas_cursadas: 48, semestre_cursado: 6, nota: 3.8 }
        ]
    });

    const [historicoAcademico] = useState([
        { id_historial: 1, semestre: 1, promedio_semestre: 3.9, fecha_actualizacion: "2022-12-15" },
        { id_historial: 2, semestre: 2, promedio_semestre: 4.0, fecha_actualizacion: "2023-05-20" },
        { id_historial: 3, semestre: 3, promedio_semestre: 4.1, fecha_actualizacion: "2023-12-10" },
        { id_historial: 4, semestre: 4, promedio_semestre: 4.3, fecha_actualizacion: "2024-05-15" },
        { id_historial: 5, semestre: 5, promedio_semestre: 4.2, fecha_actualizacion: "2024-12-01" },
        { id_historial: 6, semestre: 6, promedio_semestre: 4.15, fecha_actualizacion: "2025-05-10" }
    ]);

    const [permisos] = useState([
        { id_permiso: 1, entidad: "Biblioteca", accion: "Préstamo de libros", concedido: true },
        { id_permiso: 2, entidad: "Laboratorio", accion: "Acceso 24/7", concedido: false },
    ]);


    const materiasActuales = todasLasMaterias[selectedSemestre] || [];


    const promedioSemestreActual = materiasActuales.length > 0
        ? (materiasActuales.reduce((sum, mat) => sum + mat.nota, 0) / materiasActuales.length).toFixed(2)
        : 0;

    const getNotaColor = (nota) => {
        if (nota >= 4.0) return "nota-excelente";
        if (nota >= 3.5) return "nota-buena";
        if (nota >= 3.0) return "nota-aceptable";
        return "nota-baja";
    };

    const calcularCreditos = () => {
        return materiasActuales.reduce((sum, mat) => sum + mat.creditos, 0);
    };


    const calcularPromedioAcumulado = () => {
        const histHastaSeleccionado = historicoAcademico.filter(h => h.semestre <= selectedSemestre);
        if (histHastaSeleccionado.length === 0) return 0;
        const suma = histHastaSeleccionado.reduce((sum, h) => sum + h.promedio_semestre, 0);
        return (suma / histHastaSeleccionado.length).toFixed(2);
    };

    return (
        <div className="perfil-page">
            <Header />

            <main className="perfil-content">
                <section className="perfil-header fade-in-up">
                    <div className="container">
                        <div className="perfil-info-header">
                            <div className="avatar-section">
                                <div className="avatar avatar-animate">👤</div>
                            </div>
                            <div className="info-principal slide-in-left">
                                <h1>Perfil Académico</h1>
                                <p className="programa">{perfil.programa}</p>
                                <div className="badges">
                                    <span className="badge badge-semestre badge-animate">Semestre {perfil.semestre_actual}</span>
                                    <span className={`badge badge-estado ${perfil.estado.toLowerCase()} badge-animate`}>
                                        {perfil.estado}
                                    </span>
                                </div>
                            </div>
                            <div className="promedio-general">
                                <div className="promedio-circle scale-in hover-scale">
                                    <span className="promedio-valor">{perfil.promedio_general}</span>
                                    <span className="promedio-label">Promedio General</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="resumen-section">
                    <div className="container">
                        <div className="resumen-grid">
                            <div className="resumen-card fade-in-up hover-lift card-stagger">
                                <div className="resumen-icon hover-bounce"><i class="fi fi-rr-book-bookmark"></i></div>
                                <div className="resumen-info">
                                    <h3>{materiasActuales.length}</h3>
                                    <p>Materias Semestre {selectedSemestre}</p>
                                </div>
                            </div>
                            <div className="resumen-card fade-in-up hover-lift card-stagger">
                                <div className="resumen-icon hover-bounce"><i class="fi fi-rr-credit-card-check"></i></div>
                                <div className="resumen-info">
                                    <h3>{calcularCreditos()}</h3>
                                    <p>Créditos Cursando</p>
                                </div>
                            </div>
                            <div className="resumen-card fade-in-up hover-lift card-stagger">
                                <div className="resumen-icon hover-bounce"><i class="fi fi-br-chart-histogram"></i></div>
                                <div className="resumen-info">
                                    <h3>{promedioSemestreActual}</h3>
                                    <p>Promedio Semestre</p>
                                </div>
                            </div>
                            <div className="resumen-card fade-in-up hover-lift card-stagger">
                                <div className="resumen-icon hover-bounce">✓</div>
                                <div className="resumen-info">
                                    <h3>{permisos.filter(p => p.concedido).length}</h3>
                                    <p>Permisos Activos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="tabs-section">
                    <div className="container">
                        <div className="tabs-nav slide-in-right">
                            <button
                                className={`tab-btn ${activeTab === 'materias' ? 'active' : ''}`}
                                onClick={() => setActiveTab('materias')}
                            >
                                <i class="fi fi-ts-book-open-cover"></i> Materias por Semestre
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'historico' ? 'active' : ''}`}
                                onClick={() => setActiveTab('historico')}
                            >
                                <i class="fi fi-br-chart-histogram"></i> Progreso de Carrera
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'permisos' ? 'active' : ''}`}
                                onClick={() => setActiveTab('permisos')}
                            >
                                <i class="fi fi-sr-lock"></i> Permisos
                            </button>
                        </div>

                        {activeTab === 'materias' && (
                            <div className="tab-content fade-in">
                                <div className="selector-header">
                                    <h2 className="tab-title slide-in-left">Materias del Semestre</h2>
                                    <div className="semestre-selector scale-in">
                                        <label>Semestre:</label>
                                        <select
                                            value={selectedSemestre}
                                            onChange={(e) => setSelectedSemestre(Number(e.target.value))}
                                            className="hover-glow"
                                        >
                                            {[1, 2, 3, 4, 5, 6].map(sem => (
                                                <option key={sem} value={sem}>
                                                    Semestre {sem} {sem === perfil.semestre_actual ? '(Actual)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="info-semestre-banner fade-in-up">
                                    <div className="info-item hover-scale">
                                        <strong>Promedio del semestre:</strong> {promedioSemestreActual}
                                    </div>
                                    <div className="info-item hover-scale">
                                        <strong>Promedio acumulado:</strong> {calcularPromedioAcumulado()}
                                    </div>
                                    <div className="info-item hover-scale">
                                        <strong>Total de créditos:</strong> {calcularCreditos()}
                                    </div>
                                </div>

                                <div className="materias-grid">
                                    {materiasActuales.map((materia, idx) => (
                                        <div key={materia.id_materia} className="materia-card fade-in-up hover-lift card-stagger">
                                            <div className="materia-header">
                                                <h3>{materia.nombre_materia}</h3>
                                                <span className="materia-codigo hover-scale">{materia.codigo_materia}</span>
                                            </div>
                                            <div className="materia-body">
                                                <div className="materia-info-row">
                                                    <span className="info-label">Créditos:</span>
                                                    <span className="info-value">{materia.creditos}</span>
                                                </div>
                                                <div className="materia-info-row">
                                                    <span className="info-label">Horas:</span>
                                                    <span className="info-value">{materia.horas_cursadas}h</span>
                                                </div>
                                                <div className="materia-nota">
                                                    <span className="info-label">Nota Final:</span>
                                                    <span className={`nota-badge ${getNotaColor(materia.nota)} hover-scale`}>
                                                        {materia.nota.toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="materia-progress">
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill progress-fill-animate"
                                                        style={{ width: `${(materia.nota / 5) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'historico' && (
                            <div className="tab-content fade-in">
                                <h2 className="tab-title slide-in-left">Progreso Académico de la Carrera</h2>
                                <div className="historico-container">
                                    <div className="grafico-promedios scale-in hover-lift">
                                        <div className="chart-header">
                                            <h3><i class="fi fi-br-chart-simple-horizontal"></i> Evolución de Promedios</h3>
                                        </div>
                                        <div className="chart-bars">
                                            {historicoAcademico.map((hist, idx) => (
                                                <div key={hist.id_historial} className="bar-container">
                                                    <div
                                                        className="bar bar-grow hover-scale"
                                                        style={{ height: `${(hist.promedio_semestre / 5) * 100}%`, animationDelay: `${idx * 0.1}s` }}
                                                    >
                                                        <span className="bar-value">{hist.promedio_semestre}</span>
                                                    </div>
                                                    <span className="bar-label">{hist.semestre}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="historico-tabla scale-in hover-lift">
                                        <h3><i class="fi fi-rr-scroll"></i> Detalle por Semestre</h3>
                                        <div className="tabla-wrapper">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Semestre</th>
                                                        <th>Promedio</th>
                                                        <th>Fecha Actualización</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {historicoAcademico.map((hist, idx) => (
                                                        <tr key={hist.id_historial} className="fade-in-up table-row-hover" style={{ animationDelay: `${idx * 0.1}s` }}>
                                                            <td>
                                                                <span className="semestre-badge hover-scale">Semestre {hist.semestre}</span>
                                                            </td>
                                                            <td>
                                                                <span className={`nota-badge ${getNotaColor(hist.promedio_semestre)} hover-scale`}>
                                                                    {hist.promedio_semestre.toFixed(1)}
                                                                </span>
                                                            </td>
                                                            <td>{new Date(hist.fecha_actualizacion).toLocaleDateString('es-CO')}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'permisos' && (
                            <div className="tab-content fade-in">
                                <h2 className="tab-title slide-in-left">Permisos y Accesos</h2>
                                <div className="permisos-grid">
                                    {permisos.map((permiso, idx) => (
                                        <div key={permiso.id_permiso} className="permiso-card fade-in-up hover-lift card-stagger" style={{ animationDelay: `${idx * 0.2}s` }}>
                                            <div className="permiso-icon hover-bounce">
                                                {permiso.concedido ? <i class="fi fi-ss-check-circle"></i> : <i class="fi fi-rr-duration-alt"></i>}
                                            </div>
                                            <div className="permiso-content">
                                                <h3>{permiso.entidad}</h3>
                                                <p>{permiso.accion}</p>
                                                <span className={`permiso-status ${permiso.concedido ? 'concedido' : 'pendiente'} hover-scale`}>
                                                    {permiso.concedido ? 'Activo' : 'Pendiente'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default PerfilAcademico;