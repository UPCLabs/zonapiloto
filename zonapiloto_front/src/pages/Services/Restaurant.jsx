import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/services/restaurant.css";

const Restaurant = () => {
  return (
    <>
      <Header />
      <main className="restaurant-container">
        <h1 className="restaurant-title">Menú de la Cafetería</h1>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: 0,
            paddingTop: "100%",
            marginTop: "1.6em",
            marginBottom: "0.9em",
            overflow: "hidden",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(63,69,81,0.16)",
            willChange: "transform",
          }}
        >
          <iframe
            loading="lazy"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              left: 0,
              border: "none",
              padding: 0,
              margin: 0,
            }}
            src="https://www.canva.com/design/DAG5NrWWGa4/6AOGyaC0bU1ps1Wyv_eO4w/view?embed"
            allow="fullscreen"
            allowFullScreen
            title="Menú de la Cafetería"
          ></iframe>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Restaurant;
