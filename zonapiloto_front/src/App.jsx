import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import BancoPreguntas from "./pages/BancoPreguntas.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/banco-preguntas" element={<BancoPreguntas />} />
      </Routes>
    </Router>
  );
}

export default App;

