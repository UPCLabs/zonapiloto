import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/services/restaurant.css";

const Restaurant = () => {
    const pdfUrl = "https://drive.google.com/file/d/1_Bo1v7YijmewCZaa2om8CnV7iDXSVeQg/preview";

    return (
        <>
            <Header />
            <main className="restaurant-container">
                <h1 className="restaurant-title">Menú de la Cafetería</h1>
                <div className="pdf-viewer">
                    <iframe
                        src={pdfUrl}
                        title="Menú de la Cafetería"
                        width="100%"
                        height="100%"
                        allow="autoplay"
                    ></iframe>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Restaurant;
