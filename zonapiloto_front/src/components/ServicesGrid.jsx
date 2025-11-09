import { useNavigate } from "react-router-dom";
import "../styles/services.css";

const services = [
    {
        title: "Perfil Académico",
        desc: "Consulta tu información académica, notas y progreso",
        icon: "👤"
    },
    {
        title: "Calendario Académico",
        desc: "Horarios y fechas importantes",
        icon: "📅"
    },
    {
        title: "Banco de Preguntas",
        desc: "Practica y prepárate para tus evaluaciones",
        icon: "📝"
    },
    {
        title: "Eventos Institucionales",
        desc: "Entérate de los próximos eventos",
        icon: "🎉"
    },
    {
        title: "Cafetería",
        desc: "Menú del día y servicios alimentarios",
        icon: "🍽️"
    },
    {
        title: "Biblioteca",
        desc: "Catálogo y reserva de espacios",
        icon: "📚"
    },
    {
        title: "Emergencias",
        desc: "Contactos y recursos de emergencia",
        icon: "🚨"
    },
    {
        title: "Comunidad UniPiloto",
        desc: "Conéctate con otros estudiantes",
        icon: "👥"
    },
];

function ServicesGrid() {
    const navigate = useNavigate();

    const handleClick = (title) => {
        switch (title) {
            case "Banco de Preguntas":
                navigate("/banco-preguntas");
                break;
            case "Calendario Académico":
                navigate("/calendario");
                break;
            case "Cafetería":
                navigate("/cafeteria");
                break;
            case "Eventos Institucionales":
                navigate("/eventos");
                break;
            case "Biblioteca":
                navigate("/biblioteca");
                break;
            default:
                alert(`Haz clic en: ${title}`);
        }
    };

    return (
        <section className="services">
            <h2>Servicios Disponibles</h2>
            <p className="services-subtitle">
                Explora todas las herramientas y recursos que tenemos para ti
            </p>
            <div className="grid">
                {services.map((s, i) => (
                    <div
                        className="card"
                        key={i}
                        onClick={() => handleClick(s.title)}
                    >
                        <div className="card-icon">{s.icon}</div>
                        <h3>{s.title}</h3>
                        <p>{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ServicesGrid;