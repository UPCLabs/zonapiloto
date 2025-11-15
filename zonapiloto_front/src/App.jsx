import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PerfilAcademico from "./pages/Services/Profile.jsx";
import BancoPreguntas from "./pages/Services/BancoPreguntas.jsx";
import Login from "./pages/Login";
import CalendarioAcademico from "./pages/Services/CalendarioAcademico.jsx";
import Restaurant from "./pages/Services/Restaurant.jsx";
import Events from "./pages/Services/InstitucionalEvents.jsx";
import Lybrary from "./pages/Services/Biblioteca.jsx";

import AdminDash from "./pages/Authentication/AdminDashboard.jsx";
import LOggin from "./pages/Authentication/UnifledLogin.jsx";


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
        <Route path="/AdminDash" element={<AdminDash />} />
        <Route path="/Loggin" element={<LOggin />} />
      </Routes>
    </Router>
  );
}

export default App;

