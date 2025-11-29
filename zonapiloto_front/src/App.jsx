import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import PerfilAcademico from "./pages/Services/Profile.jsx";
import BancoPreguntas from "./pages/Services/QuestionBank.jsx";
import Soporte from "./pages/Services/Support.jsx";
import Terminos from "./pages/Services/Terms.jsx";
import Privacidad from "./pages/Services/Privacy.jsx";
import Login from "./pages/Services/Login.jsx";
import CalendarioAcademico from "./pages/Services/AcademicCalendar.jsx";
import Restaurant from "./pages/Services/Restaurant.jsx";
import Events from "./pages/Services/InstitucionalEvents.jsx";
import Lybrary from "./pages/Services/Library.jsx";
import AdminDash from "./pages/Admindashboard/componen/AdminDashBoard.jsx";
import Loggin from "./pages/Admindashboard/UnifledLogin.jsx";
import Contact from "./pages/Services/Contact.jsx";
import Register from "./pages/Services/RegisterPage.jsx";
import SecretLoginTrigger from "./components/SecretLoginTrigger";
import NotFound404 from "./pages/NotFound404.jsx";

function ConditionalSecretTrigger() {
  const location = useLocation();
  const hiddenRoutes = ["/login", "/loggin", "/admindash"];

  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  return <SecretLoginTrigger />;
}

function App() {
  return (
    <>
      <Router>
        <SecretLoginTrigger />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/perfil-academico" element={<PerfilAcademico />} />
          <Route path="/banco-preguntas" element={<BancoPreguntas />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/soporte" element={<Soporte />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/login" element={<Login />} />
          <Route path="/calendario" element={<CalendarioAcademico />} />
          <Route path="/cafeteria" element={<Restaurant />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/biblioteca" element={<Lybrary />} />
          <Route path="/admindash" element={<AdminDash />} />
          <Route path="/loggin" element={<Loggin />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
