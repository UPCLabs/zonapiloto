import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ServicesGrid from "../components/ServicesGrid";

const NotFound404 = () => {
  return (
    <>
      <Header />
      <div style={styles.container}>
        <div style={styles.errorSection}>
          <div style={styles.errorCode}>404</div>
          <h2 style={styles.errorTitle}>Página No Encontrada</h2>
          <div style={styles.errorDivider}></div>
          <p style={styles.errorDescription}>
            Lo sentimos, la página que estás buscando no existe o ha sido
            movida. Te invitamos a explorar nuestros servicios disponibles.
          </p>
          <a href="/" style={styles.btnHome}>
            Volver al Inicio
          </a>
        </div>
      </div>
      <ServicesGrid />
      <Footer />
    </>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "60px auto",
    padding: "0 40px",
  },
  errorSection: {
    textAlign: "center",
    padding: "60px 20px",
  },
  errorCode: {
    fontSize: "150px",
    fontWeight: "bold",
    color: "#8B0000",
    lineHeight: "1",
    marginBottom: "20px",
  },
  errorTitle: {
    fontSize: "32px",
    color: "#333",
    marginBottom: "20px",
    fontWeight: "600",
  },
  errorDivider: {
    width: "60px",
    height: "4px",
    background: "#8B0000",
    margin: "20px auto",
  },
  errorDescription: {
    fontSize: "18px",
    color: "#666",
    marginBottom: "50px",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
    lineHeight: "1.6",
  },
  btnHome: {
    display: "inline-block",
    background: "#8B0000",
    color: "white",
    padding: "15px 40px",
    borderRadius: "5px",
    textDecoration: "none",
    fontWeight: "600",
    marginTop: "30px",
    transition: "background 0.3s",
    cursor: "pointer",
  },
};

export default NotFound404;
