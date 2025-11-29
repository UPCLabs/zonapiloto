import React from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/components/terms.css";

const Terminos = () => {
    return (
        <>
            <Header />
            <div className="terminos-container">
                <div className="terminos-header">
                    <h1>Términos y Condiciones</h1>
                    <p className="fecha-actualizacion">Última actualización: 20 de noviembre de 2025</p>
                </div>

                <div className="terminos-content">
                    <section className="terms-section">
                        <h2>1. Aceptación de los Términos</h2>
                        <p>
                            Al acceder y utilizar este sitio web y sus servicios, usted acepta estar sujeto a estos términos
                            y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar
                            nuestros servicios.
                        </p>
                        <div className="warning-box">
                            <p>
                                <strong>Importante:</strong> El uso continuo de nuestros servicios constituye su aceptación
                                de estos términos y cualquier modificación futura.
                            </p>
                        </div>
                    </section>

                    <section className="terms-section">
                        <h2>2. Uso del Servicio</h2>
                        <p>
                            Usted se compromete a utilizar nuestros servicios solo para fines legales y de acuerdo con estos
                            términos. Está prohibido utilizar el servicio de cualquier manera que pueda dañar, deshabilitar,
                            sobrecargar o deteriorar el servicio.
                        </p>
                        <div className="rules-box">
                            <h4>Está prohibido:</h4>
                            <ul>
                                <li>Usar el servicio para actividades ilegales o fraudulentas</li>
                                <li>Intentar acceder a áreas no autorizadas del sistema</li>
                                <li>Transmitir virus, malware o código malicioso</li>
                                <li>Interferir con la seguridad o funcionamiento del servicio</li>
                                <li>Realizar ingeniería inversa o descompilar el software</li>
                                <li>Usar el servicio para spam o distribución masiva no autorizada</li>
                            </ul>
                        </div>
                    </section>

                    <section className="terms-section">
                        <h2>3. Cuentas de Usuario</h2>
                        <p>
                            Para acceder a ciertas funciones del servicio, debe crear una cuenta. Usted es responsable de
                            mantener la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta.
                        </p>
                        <div className="info-box">
                            <h4>Responsabilidades del usuario:</h4>
                            <ul>
                                <li>Proporcionar información precisa y actualizada durante el registro</li>
                                <li>Mantener la seguridad de su contraseña</li>
                                <li>Notificarnos inmediatamente sobre cualquier uso no autorizado</li>
                                <li>No compartir su cuenta con terceros</li>
                                <li>Actualizar su información cuando sea necesario</li>
                            </ul>
                        </div>
                    </section>

                    <section className="terms-section">
                        <h2>4. Propiedad Intelectual</h2>
                        <p>
                            Todo el contenido disponible en este sitio web, incluyendo textos, gráficos, logotipos, iconos,
                            imágenes, clips de audio, descargas digitales y software, es propiedad de nuestra empresa o de
                            nuestros proveedores de contenido y está protegido por las leyes de derechos de autor.
                        </p>
                        <p>
                            Se le concede una licencia limitada para acceder y hacer uso personal del contenido, pero no para
                            descargarlo (excepto el almacenamiento en caché de páginas) o modificarlo sin nuestro consentimiento
                            expreso por escrito.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>5. Contenido del Usuario</h2>
                        <p>
                            Al publicar, cargar o enviar contenido a nuestro servicio, usted nos otorga una licencia mundial,
                            no exclusiva, libre de regalías para usar, reproducir, modificar, adaptar y publicar dicho contenido
                            en relación con la prestación de nuestros servicios.
                        </p>
                        <div className="warning-box">
                            <p>
                                <strong>Nota:</strong> Usted declara y garantiza que posee todos los derechos necesarios sobre
                                el contenido que carga y que dicho contenido no infringe los derechos de terceros.
                            </p>
                        </div>
                    </section>

                    <section className="terms-section">
                        <h2>6. Limitación de Responsabilidad</h2>
                        <p>
                            Nuestros servicios se proporcionan "tal cual" y "según disponibilidad". No garantizamos que el servicio
                            será ininterrumpido, seguro o libre de errores. En ningún caso seremos responsables por daños indirectos,
                            incidentales, especiales o consecuentes.
                        </p>
                        <div className="disclaimer-box">
                            <h4>Exención de garantías:</h4>
                            <ul>
                                <li>No garantizamos resultados específicos del uso del servicio</li>
                                <li>No somos responsables de pérdidas de datos o información</li>
                                <li>No garantizamos la disponibilidad continua del servicio</li>
                                <li>No somos responsables por el contenido de terceros enlazado</li>
                            </ul>
                        </div>
                    </section>

                    <section className="terms-section">
                        <h2>7. Modificaciones del Servicio</h2>
                        <p>
                            Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio en
                            cualquier momento, con o sin previo aviso. No seremos responsables ante usted ni ante terceros por
                            cualquier modificación, suspensión o interrupción del servicio.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>8. Terminación</h2>
                        <p>
                            Podemos suspender o terminar su acceso al servicio inmediatamente, sin previo aviso, por cualquier
                            motivo, incluyendo pero no limitado a una violación de estos términos. Todas las disposiciones de
                            estos términos que por su naturaleza deban sobrevivir a la terminación, sobrevivirán.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>9. Ley Aplicable</h2>
                        <p>
                            Estos términos se rigen por las leyes de Colombia. Cualquier disputa relacionada con estos términos
                            estará sujeta a la jurisdicción exclusiva de los tribunales de Cundinamarca, Colombia.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2>10. Cambios a los Términos</h2>
                        <p>
                            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en
                            vigor inmediatamente después de su publicación en el sitio web. Su uso continuado del servicio después
                            de la publicación de cambios constituye su aceptación de dichos cambios.
                        </p>
                    </section>

                    <section className="terms-section contact-section">
                        <h2>11. Contacto</h2>
                        <p>
                            Si tiene preguntas sobre estos términos y condiciones, puede contactarnos a través de:
                        </p>
                        <div className="contact-info">
                            <p><strong>Email:</strong> legal@ejemplo.com</p>
                            <p><strong>Dirección:</strong> Calle Principal 123, Soacha, Cundinamarca</p>
                            <p><strong>Teléfono:</strong> +57 123 456 7890</p>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Terminos;