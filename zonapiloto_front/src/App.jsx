import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import BancoPreguntas from "./pages/BancoPreguntas.jsx";
import Login from "./pages/Login";
import CalendarioAcademico from "./pages/CalendarioAcademico.jsx";
import Restaurant from "./pages/Restaurant.jsx";
import Events from "./pages/InstitucionalEvents.jsx";
import Lybrary from "./pages/Biblioteca.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/banco-preguntas" element={<BancoPreguntas />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calendario" element={<CalendarioAcademico />} />
        <Route path="/cafeteria" element={<Restaurant />} />
        <Route path="/eventos" element={<Events />} />
        <Route path="/biblioteca" element={<Lybrary />} />
      </Routes>
    </Router>
  );
}

export default App;

