import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/banco.css";

function BancoPreguntas() {
    const [preguntas, setPreguntas] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [preguntaAbierta, setPreguntaAbierta] = useState(null);

    useEffect(() => {
        //  aqui conecto con el back (habalr con el ing del back Mendiz) 
        // fetch("http://localhost:8080/api/preguntas")
        //   .then(res => res.json())
        //   .then(data => setPreguntas(data))
        //   .catch(err => console.error("Error al cargar preguntas:", err));

        //  Mock temporal preguntas pruebas
        const mock = [
            {
                id: 1,
                categoria: "Matemáticas",
                pregunta: "¿Qué es una derivada?",
                respuesta:
                    "SOY"
            },
            {
                id: 2,
                categoria: "Programación",
                pregunta: "¿Qué es una API?",
                respuesta:
                    "LA"
            },
            {
                id: 3,
                categoria: "Física",
                pregunta: "¿Qué es la velocidad?",
                respuesta:
                    "Monda"
            }
        ];

        setPreguntas(mock);
    }, []);


    const preguntasFiltradas = preguntas.filter(
        (p) =>
            p.pregunta.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.categoria.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <>
            <Header />
            <main className="banco-container">
                <h1>Banco de Preguntas</h1>

                <input
                    type="text"
                    placeholder="Buscar por palabra clave o categoría..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="search-input"
                />

                <div className="preguntas-grid">
                    {preguntasFiltradas.map((p, index) => (
                        <div
                            key={index}
                            className={`pregunta-card ${preguntaAbierta === index ? "abierta" : ""}`}
                            onClick={() =>
                                setPreguntaAbierta(preguntaAbierta === index ? null : index)
                            }
                        >
                            <h3>{p.pregunta}</h3>
                            <p className="categoria">{p.categoria}</p>
                            {preguntaAbierta === index && (
                                <div className="respuesta">
                                    <p>{p.respuesta}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}

export default BancoPreguntas;
