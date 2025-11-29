import React, { useState } from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/components/support.css";

const Soporte = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
    });

    const [activeQuestion, setActiveQuestion] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulario enviado:', formData);
        // Aquí puedes agregar la lógica para enviar el formulario
        alert('Mensaje enviado correctamente. Te contactaremos pronto.');
        setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
    };

    const faqs = [
        {
            id: 1,
            pregunta: '¿Cómo puedo restablecer mi contraseña?',
            respuesta: 'Para restablecer tu contraseña, haz clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión. Recibirás un correo electrónico con instrucciones para crear una nueva contraseña.'
        },
        {
            id: 2,
            pregunta: '¿Cuánto tiempo tarda en procesarse mi solicitud?',
            respuesta: 'Las solicitudes generalmente se procesan en un plazo de 24-48 horas hábiles. Te notificaremos por correo electrónico una vez que tu solicitud haya sido revisada.'
        },
        {
            id: 3,
            pregunta: '¿Cómo puedo actualizar mi información de perfil?',
            respuesta: 'Inicia sesión en tu cuenta, ve a "Mi Perfil" y haz clic en el botón "Editar". Podrás actualizar tu información personal y guardar los cambios.'
        },
        {
            id: 4,
            pregunta: '¿El servicio está disponible 24/7?',
            respuesta: 'Sí, nuestro sistema está disponible las 24 horas del día, los 7 días de la semana. El equipo de soporte técnico responde de lunes a viernes de 8:00 AM a 6:00 PM.'
        },
        {
            id: 5,
            pregunta: '¿Cómo puedo reportar un problema técnico?',
            respuesta: 'Puedes reportar problemas técnicos a través del formulario de contacto en esta página o enviando un correo a soporte@ejemplo.com con una descripción detallada del problema.'
        }
    ];

    return (
        <>
            <Header />
            <div className="soporte-container">
                <div className="soporte-header">
                    <h1>Centro de Soporte</h1>
                    <p>Estamos aquí para ayudarte. Encuentra respuestas o contáctanos directamente.</p>
                </div>

                <div className="soporte-content">
                    {/* FAQ Section */}
                    <section className="faq-section">
                        <h2>Preguntas Frecuentes</h2>
                        <div className="faq-list">
                            {faqs.map((faq) => (
                                <div
                                    key={faq.id}
                                    className={`faq-item ${activeQuestion === faq.id ? 'active' : ''}`}
                                    onClick={() => setActiveQuestion(activeQuestion === faq.id ? null : faq.id)}
                                >
                                    <div className="faq-question">
                                        <h3>{faq.pregunta}</h3>
                                        <span className="faq-icon">{activeQuestion === faq.id ? '−' : '+'}</span>
                                    </div>
                                    {activeQuestion === faq.id && (
                                        <div className="faq-answer">
                                            <p>{faq.respuesta}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Contact Form Section */}
                    <section className="contact-form-section">
                        <h2>¿No encontraste lo que buscabas?</h2>
                        <p className="form-subtitle">Envíanos un mensaje y te responderemos lo antes posible</p>

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre completo</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    placeholder="Tu nombre"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Correo electrónico</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="asunto">Asunto</label>
                                <input
                                    type="text"
                                    id="asunto"
                                    name="asunto"
                                    value={formData.asunto}
                                    onChange={handleChange}
                                    required
                                    placeholder="¿En qué podemos ayudarte?"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="mensaje">Mensaje</label>
                                <textarea
                                    id="mensaje"
                                    name="mensaje"
                                    value={formData.mensaje}
                                    onChange={handleChange}
                                    required
                                    placeholder="Describe tu consulta o problema..."
                                    rows="6"
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-btn">
                                Enviar mensaje
                            </button>
                        </form>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Soporte;