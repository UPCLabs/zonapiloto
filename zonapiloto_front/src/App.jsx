import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PerfilAcademico from "./pages/Profile.jsx";
import BancoPreguntas from "./pages/BancoPreguntas.jsx";
import Login from "./pages/Login";
import CalendarioAcademico from "./pages/CalendarioAcademico.jsx";
import Restaurant from "./pages/Restaurant.jsx";
import Events from "./pages/InstitucionalEvents.jsx";
import Lybrary from "./pages/Biblioteca.jsx";
import LogLock from "./pages/LogLock.jsx";
import MFA from "./pages/MFAverify.jsx";
import AdminDash from "./pages/AdminDashboard.jsx";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/perfil-academico" element={<PerfilAcademico />} />
        <Route path="/banco-preguntas" element={<BancoPreguntas />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calendario" element={<CalendarioAcademico />} />
        <Route path="/cafeteria" element={<Restaurant />} />
        <Route path="/eventos" element={<Events />} />
        <Route path="/biblioteca" element={<Lybrary />} />
        <Route path="/loglock" element={<LogLock />} />
        <Route path="/MFAVerify" element={<MFA />} />
        <Route path="/AdminDash" element={<AdminDash />} />
      </Routes>
    </Router>
  );
}

export default App;

