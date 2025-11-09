import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import menu1 from "../assets/images/menu1.jpg";
import "../styles/restaurant.css";

const Cafeteria = () => {
    const [menuImg, setMenuImg] = useState(null);

    useEffect(() => {
        // arregla esa vaina (Mendizzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz)
        /*
        const API_URL = import.meta.env.VITE_API_BASE_URL;
        fetch(`${API_URL}/cafeteria/menu`)
          .then(res => res.json())
          .then(data => setMenuImg(data.image_url))
          .catch(err => console.error("Error al cargar el menú:", err));
        */

        setMenuImg(menu1);
    }, []);

    return (
        <>
            <Header />
            <div className="cafeteria-container">
                <div className="cafeteria-card">
                    <h2> Menú del Día - Cafetería UniPiloto</h2>
                    <div className="menu-image">
                        {menuImg ? (
                            <img src={menuImg} alt="Menú del día" className="menu-img" />
                        ) : (
                            <p>Cargando menú...</p>
                        )}
                    </div>
                    <p className="nota">
                        *El menú se actualiza diariamente según disponibilidad y planificación del servicio alimentario.
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Cafeteria;
