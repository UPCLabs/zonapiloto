import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PerfilAcademico from "./pages/services/Profile.jsx";
import BancoPreguntas from "./pages/services/BancoPreguntas.jsx";
import Login from "./pages/Login";
import CalendarioAcademico from "./pages/services/CalendarioAcademico.jsx";
import Restaurant from "./pages/services/Restaurant.jsx";
import Events from "./pages/services/InstitucionalEvents.jsx";
import Lybrary from "./pages/services/Biblioteca.jsx";
// import LogLock from "./pages/Authentication/LogLock.jsx";
// import MFA from "./pages/Authentication/MFAverify.jsx";
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
        {/* <Route path="/loglock" element={<LogLock />} />
        <Route path="/MFAVerify" element={<MFA />} /> */}
        <Route path="/AdminDash" element={<AdminDash />} />
        <Route path="/Loggin" element={<LOggin />} />
      </Routes>
    </Router>
  );
}

export default App;

