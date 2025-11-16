import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/services/banco.css";

function BancoPreguntas() {
  const [preguntas, setPreguntas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    fetch(`${API_URL}/information/question-bank/questions`)
      .then((res) => res.json())
      .then((data) => setPreguntas(data))
      .catch((err) => console.error("Error al cargar preguntas:", err));
  }, []);

  const preguntasFiltradas = preguntas.filter(
    (p) =>
      p.question.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(busqueda.toLowerCase()),
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
              <h3>{p.question}</h3>
              <p className="categoria">{p.categoryName}</p>
              {preguntaAbierta === index && (
                <div className="respuesta">
                  <p>{p.answer}</p>
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
