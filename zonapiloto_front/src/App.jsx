import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import BancoPreguntas from "./pages/BancoPreguntas.jsx";
import Login from "./pages/Login";
import CalendarioAcademico from "./pages/CalendarioAcademico";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/banco-preguntas" element={<BancoPreguntas />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calendario" element={<CalendarioAcademico />} />
      </Routes>
    </Router>
  );
}

export default App;

