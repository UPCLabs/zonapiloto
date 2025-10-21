import { useNavigate } from "react-router-dom";
import "../styles/services.css";

const services = [
    { title: "Perfil Académico", desc: "Consulta tu información académica, notas y progreso" },
    { title: "Calendario Académico", desc: "Horarios y fechas importantes" },
    { title: "Banco de Preguntas", desc: "Practica y prepárate para tus evaluaciones" },
    { title: "Eventos Institucionales", desc: "Entérate de los próximos eventos" },
    { title: "Cafetería", desc: "Menú del día y servicios alimentarios" },
    { title: "Biblioteca", desc: "Catálogo y reserva de espacios" },
    { title: "Emergencias", desc: "Contactos y recursos de emergencia" },
    { title: "Comunidad UniPiloto", desc: "Conéctate con otros estudiantes" },
];

function ServicesGrid() {
    const navigate = useNavigate();

    const handleClick = (title) => {
        if (title === "Banco de Preguntas") {
            navigate("/banco-preguntas");
        } else {
            alert(`Haz clic en: ${title}`);
        }
    };

    return (
        <section className="services">
            <h2>Servicios Disponibles</h2>
            <div className="grid">
                {services.map((s, i) => (
                    <div
                        className="card"
                        key={i}
                        onClick={() => handleClick(s.title)}
                    >
                        <h3>{s.title}</h3>
                        <p>{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ServicesGrid;
