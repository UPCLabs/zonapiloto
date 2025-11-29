import React, { useState } from "react";
import "../../styles/services/contact.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import img1 from "../../assets/images/Equipo_Trabajo/Santiago_Mendoza.jpeg";
import img2 from "../../assets/images/Equipo_Trabajo/Duvan_Monroy.jpeg";
import img3 from "../../assets/images/Equipo_Trabajo/Sebastian_Camilo.jpeg";

const Contact = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  const teamMembers = [
    {
      id: 1,
      name: "Santiago Mendoza",
      role: "Ingeniero de Back & Líder de Proyecto",
      photo: img1,
      phone: "+57 3133799636",
      instagram: "@santiago_mendoza",
      github: "github.com/santiagomendoza",
    },
    {
      id: 2,
      name: "Duvan Monroy",
      role: "Ingeniero de Front",
      photo: img2,
      phone: "+57 3229041898",
      instagram: "@duvan_monroy",
      github: "github.com/duvanmonroy",
    },
    {
      id: 3,
      name: "Camilo Sandoval",
      role: "Ingeniero de Bases de Datos",
      photo: img3,
      phone: "+57 3212971629",
      instagram: "@camilo_sandoval",
      github: "github.com/camilosandoval",
    },
  ];

  return (
    <>
      <Header />
      <div className="contact-container">
        <h1>Nuestro Equipo</h1>
        <p className="subtitle">
          Conoce a los profesionales detrás del proyecto
        </p>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className={`member-card ${selectedMember === member.id ? "active" : ""}`}
              onClick={() =>
                setSelectedMember(
                  selectedMember === member.id ? null : member.id,
                )
              }
            >
              <div className="photo-container">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="member-photo"
                />
                <div className="photo-overlay"></div>
              </div>

              <div className="member-info">
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>

                <div
                  className={`contact-details ${selectedMember === member.id ? "show" : ""}`}
                >
                  <div className="contact-item">
                    <svg
                      className="icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>{member.phone}</span>
                  </div>

                  <div className="contact-item">
                    <svg
                      className="icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="20"
                        height="20"
                        rx="5"
                        ry="5"
                      ></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                    <span>{member.instagram}</span>
                  </div>

                  <div className="contact-item">
                    <svg
                      className="icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    <span>{member.github}</span>
                  </div>
                </div>

                <button className="toggle-btn">
                  {selectedMember === member.id
                    ? "Ocultar contacto"
                    : "Ver contacto"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="extra-thanks">
          <h2>Agradecimientos adicionales</h2>
          <p>
            Queremos extender un agradecimiento especial a las personas que
            apoyaron este proyecto con ideas, orientación y motivación
            constante:
          </p>

          <ul className="thanks-list">
            <li>• Alexa Valentina Bohorquez</li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
