import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/components/privacy.css";

const Privacidad = () => {
  return (
    <>
      <Header />
      <div className="privacidad-container">
        <div className="privacidad-header">
          <h1>Política de Privacidad</h1>
          <p className="fecha-actualizacion">
            Última actualización: 20 de noviembre de 2025
          </p>
        </div>

        <div className="privacidad-content">
          <section className="privacy-section">
            <h2>1. Información que Recopilamos</h2>
            <p>
              Recopilamos información que usted nos proporciona directamente
              cuando utiliza nuestros servicios. Esto incluye información de
              registro como nombre, dirección de correo electrónico y cualquier
              otra información que decida compartir con nosotros.
            </p>
            <div className="info-box">
              <h4>Tipos de información recopilada:</h4>
              <ul>
                <li>
                  Información de identificación personal (nombre, email,
                  teléfono)
                </li>
                <li>Información de uso de la plataforma</li>
                <li>Datos de navegación y cookies</li>
                <li>Información de pago (procesada de forma segura)</li>
              </ul>
            </div>
          </section>

          <section className="privacy-section">
            <h2>2. Cómo Utilizamos Su Información</h2>
            <p>
              Utilizamos la información recopilada para proporcionar, mantener y
              mejorar nuestros servicios, procesar transacciones, enviar
              comunicaciones importantes y personalizar su experiencia en
              nuestra plataforma.
            </p>
            <div className="info-box">
              <h4>Usos principales:</h4>
              <ul>
                <li>Proporcionar y mejorar nuestros servicios</li>
                <li>Procesar sus solicitudes y transacciones</li>
                <li>Enviar notificaciones importantes sobre su cuenta</li>
                <li>Analizar el uso de la plataforma para mejoras</li>
                <li>Prevenir fraudes y garantizar la seguridad</li>
              </ul>
            </div>
          </section>

          <section className="privacy-section">
            <h2>3. Compartir Información</h2>
            <p>
              No vendemos, alquilamos ni compartimos su información personal con
              terceros para sus propósitos de marketing sin su consentimiento
              explícito. Podemos compartir información en las siguientes
              circunstancias:
            </p>
            <ul className="simple-list">
              <li>
                Con proveedores de servicios que nos ayudan a operar nuestra
                plataforma
              </li>
              <li>
                Cuando sea requerido por ley o para proteger nuestros derechos
              </li>
              <li>En caso de fusión, adquisición o venta de activos</li>
              <li>Con su consentimiento explícito</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. Seguridad de Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas
              apropiadas para proteger su información personal contra acceso no
              autorizado, alteración, divulgación o destrucción. Utilizamos
              encriptación SSL/TLS para todas las transmisiones de datos
              sensibles.
            </p>
          </section>

          <section className="privacy-section">
            <h2>5. Sus Derechos</h2>
            <p>
              Usted tiene derecho a acceder, corregir, actualizar o solicitar la
              eliminación de su información personal. También puede oponerse al
              procesamiento de su información personal u optar por no recibir
              comunicaciones de marketing.
            </p>
            <div className="highlight-box">
              <h4>Derechos del usuario:</h4>
              <ul>
                <li>
                  <strong>Acceso:</strong> Solicitar una copia de sus datos
                  personales
                </li>
                <li>
                  <strong>Rectificación:</strong> Corregir información inexacta
                  o incompleta
                </li>
                <li>
                  <strong>Eliminación:</strong> Solicitar la eliminación de sus
                  datos
                </li>
                <li>
                  <strong>Portabilidad:</strong> Recibir sus datos en formato
                  estructurado
                </li>
                <li>
                  <strong>Oposición:</strong> Objetar ciertos procesamientos de
                  datos
                </li>
              </ul>
            </div>
          </section>

          <section className="privacy-section">
            <h2>6. Cookies y Tecnologías Similares</h2>
            <p>
              Utilizamos cookies y tecnologías similares para mejorar su
              experiencia, analizar el uso de nuestro sitio web y personalizar
              contenido. Puede gestionar sus preferencias de cookies a través de
              la configuración de su navegador.
            </p>
          </section>

          <section className="privacy-section">
            <h2>7. Cambios a Esta Política</h2>
            <p>
              Podemos actualizar esta política de privacidad ocasionalmente. Le
              notificaremos sobre cambios significativos publicando la nueva
              política en esta página y actualizando la fecha de "última
              actualización".
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Privacidad;
