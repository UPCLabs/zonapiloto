import { useNavigate } from "react-router-dom";
import "../styles/components/services.css";

const services = [
  {
    title: "Perfil Académico",
    desc: "Consulta tu información académica, notas y progreso",
    icon: <i class="fi fi-sr-user"></i>,
  },
  {
    title: "Calendario Académico",
    desc: "Horarios y fechas importantes",
    icon: <i class="fi fi-sr-calendar"></i>,
  },
  {
    title: "Banco de Preguntas",
    desc: "Preguntas generales de la instituciones",
    icon: <i class="fi fi-sr-comment-alt"></i>,
  },
  {
    title: "Eventos Institucionales",
    desc: "Entérate de los próximos eventos",
    icon: <i class="fi fi-sr-party-horn"></i>,
  },
  {
    title: "Cafetería",
    desc: "Menú del día y servicios alimentarios",
    icon: <i class="fi fi-sr-plate-utensils"></i>,
  },
  {
    title: "Biblioteca",
    desc: "Catálogo y reserva de espacios",
    icon: <i class="fi fi-sr-diary-bookmark-down"></i>,
  },
  {
    title: "Laboratorio",
    desc: "Sistema de reservas para el laboratio",
    icon: <i class="fi fi-sr-display-code"></i>,
  },
  {
    title: "Contacto",
    desc: "Conéctate con nosotros",
    icon: <i class="fi fi-sr-users-alt"></i>,
  },
];

function ServicesGrid() {
  const navigate = useNavigate();

  const handleClick = (title) => {
    switch (title) {
      case "Perfil Académico":
        navigate("/login");
        break;
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
      case "Laboratorio":
        window.location.href = "https://labpiloto.com/";
        break;
      case "Contacto":
        navigate("/contacto");
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
          <div className="card" key={i} onClick={() => handleClick(s.title)}>
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
