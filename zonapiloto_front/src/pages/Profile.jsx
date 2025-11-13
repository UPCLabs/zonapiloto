import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/profile.css";

const PerfilAcademico = () => {
    const [activeTab, setActiveTab] = useState("materias");
    const [selectedSemestre, setSelectedSemestre] = useState("actual");


    const [perfil, setPerfil] = useState({
        id_perfil: 1,
        id_usuario: 123456,
        programa: "Ingeniería de Sistemas",
        semestre_actual: 6,
        promedio_general: 4.2,
        estado: "Activo"
    });

    const [materias, setMaterias] = useState([
        {
            id_materia: 1,
            nombre_materia: "Desarrollo Web",
            codigo_materia: "IS301",
            creditos: 3,
            horas_cursadas: 48,
            semestre_cursado: 6,
            nota: 4.5
        },
        {
            id_materia: 2,
            nombre_materia: "Base de Datos II",
            codigo_materia: "IS302",
            creditos: 4,
            horas_cursadas: 64,
            semestre_cursado: 6,
            nota: 4.3
        },
        {
            id_materia: 3,
            nombre_materia: "Ingeniería de Software",
            codigo_materia: "IS303",
            creditos: 3,
            horas_cursadas: 48,
            semestre_cursado: 6,
            nota: 4.0
        },
        {
            id_materia: 4,
            nombre_materia: "Redes de Computadores",
            codigo_materia: "IS304",
            creditos: 3,
            horas_cursadas: 48,
            semestre_cursado: 6,
            nota: 3.8
        }
    ]);

    const [historicoAcademico, setHistoricoAcademico] = useState([
        { id_historial: 1, semestre: 1, promedio_semestre: 3.9, fecha_actualizacion: "2022-12-15" },
        { id_historial: 2, semestre: 2, promedio_semestre: 4.0, fecha_actualizacion: "2023-05-20" },
        { id_historial: 3, semestre: 3, promedio_semestre: 4.1, fecha_actualizacion: "2023-12-10" },
        { id_historial: 4, semestre: 4, promedio_semestre: 4.3, fecha_actualizacion: "2024-05-15" },
        { id_historial: 5, semestre: 5, promedio_semestre: 4.2, fecha_actualizacion: "2024-12-01" }
    ]);

    const [permisos, setPermisos] = useState([
        { id_permiso: 1, entidad: "Biblioteca", accion: "Préstamo de libros", concedido: true },
        { id_permiso: 2, entidad: "Laboratorio", accion: "Acceso 24/7", concedido: false },
    ]);

    /* 
      Conexión con back
      useEffect(() => {
          const API_URL = import.meta.env.VITE_API_BASE_URL;
          fetch(`${API_URL}/perfil-academico/${id_usuario}`)
              .then(res => res.json())
              .then(data => {
                  setPerfil(data.perfil);
                  setMaterias(data.materias);
                  setHistoricoAcademico(data.historico);
                  setPermisos(data.permisos);
              })
              .catch(err => console.error("Error al cargar perfil:", err));
      }, []);
      */

    const getNotaColor = (nota) => {
        if (nota >= 4.0) return "nota-excelente";
        if (nota >= 3.5) return "nota-buena";
        if (nota >= 3.0) return "nota-aceptable";
        return "nota-baja";
    };

    const calcularCreditos = () => {
        return materias.reduce((sum, mat) => sum + mat.creditos, 0);
    };

    return (
        <div className="perfil-page">
            <Header />

            <main className="perfil-content">

                <section className="perfil-header">
                    <div className="container">
                        <div className="perfil-info-header">
                            <div className="avatar-section">
                                <div className="avatar">👤</div>
                            </div>
                            <div className="info-principal">
                                <h1>Perfil Académico</h1>
                                <p className="programa">{perfil.programa}</p>
                                <div className="badges">
                                    <span className="badge badge-semestre">Semestre {perfil.semestre_actual}</span>
                                    <span className={`badge badge-estado ${perfil.estado.toLowerCase()}`}>
                                        {perfil.estado}
                                    </span>
                                </div>
                            </div>
                            <div className="promedio-general">
                                <div className="promedio-circle">
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
                            <div className="resumen-card">
                                <div className="resumen-icon">📚</div>
                                <div className="resumen-info">
                                    <h3>{materias.length}</h3>
                                    <p>Materias Actuales</p>
                                </div>
                            </div>
                            <div className="resumen-card">
                                <div className="resumen-icon">🎯</div>
                                <div className="resumen-info">
                                    <h3>{calcularCreditos()}</h3>
                                    <p>Créditos Cursando</p>
                                </div>
                            </div>
                            <div className="resumen-card">
                                <div className="resumen-icon">📈</div>
                                <div className="resumen-info">
                                    <h3>{historicoAcademico.length}</h3>
                                    <p>Semestres Completados</p>
                                </div>
                            </div>
                            <div className="resumen-card">
                                <div className="resumen-icon">✓</div>
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
                        <div className="tabs-nav">
                            <button
                                className={`tab-btn ${activeTab === 'materias' ? 'active' : ''}`}
                                onClick={() => setActiveTab('materias')}
                            >
                                📖 Materias Actuales
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'historico' ? 'active' : ''}`}
                                onClick={() => setActiveTab('historico')}
                            >
                                📊 Historial Académico
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'permisos' ? 'active' : ''}`}
                                onClick={() => setActiveTab('permisos')}
                            >
                                🔐 Permisos
                            </button>
                        </div>


                        {activeTab === 'materias' && (
                            <div className="tab-content fade-in">
                                <h2 className="tab-title">Semestre {perfil.semestre_actual}</h2>
                                <div className="materias-grid">
                                    {materias.map((materia) => (
                                        <div key={materia.id_materia} className="materia-card">
                                            <div className="materia-header">
                                                <h3>{materia.nombre_materia}</h3>
                                                <span className="materia-codigo">{materia.codigo_materia}</span>
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
                                                    <span className="info-label">Nota Actual:</span>
                                                    <span className={`nota-badge ${getNotaColor(materia.nota)}`}>
                                                        {materia.nota.toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="materia-progress">
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
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
                                <h2 className="tab-title">Progreso Académico</h2>
                                <div className="historico-container">
                                    <div className="grafico-promedios">
                                        <div className="chart-header">
                                            <h3>Evolución de Promedios</h3>
                                        </div>
                                        <div className="chart-bars">
                                            {historicoAcademico.map((hist) => (
                                                <div key={hist.id_historial} className="bar-container">
                                                    <div
                                                        className="bar"
                                                        style={{ height: `${(hist.promedio_semestre / 5) * 100}%` }}
                                                    >
                                                        <span className="bar-value">{hist.promedio_semestre}</span>
                                                    </div>
                                                    <span className="bar-label">Sem {hist.semestre}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="historico-tabla">
                                        <h3>Detalle por Semestre</h3>
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
                                                    {historicoAcademico.map((hist) => (
                                                        <tr key={hist.id_historial}>
                                                            <td>
                                                                <span className="semestre-badge">Semestre {hist.semestre}</span>
                                                            </td>
                                                            <td>
                                                                <span className={`nota-badge ${getNotaColor(hist.promedio_semestre)}`}>
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
                                <h2 className="tab-title">Permisos y Accesos</h2>
                                <div className="permisos-grid">
                                    {permisos.map((permiso) => (
                                        <div key={permiso.id_permiso} className="permiso-card">
                                            <div className="permiso-icon">
                                                {permiso.concedido ? '✅' : '⏳'}
                                            </div>
                                            <div className="permiso-content">
                                                <h3>{permiso.entidad}</h3>
                                                <p>{permiso.accion}</p>
                                                <span className={`permiso-status ${permiso.concedido ? 'concedido' : 'pendiente'}`}>
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