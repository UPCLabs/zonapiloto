import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackgroundCarousel from "../../components/BackgroundCarousel";
import "../../styles/services/login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate("/perfil-academico");
        }, 1500);
    };

    const goToHome = () => {
        navigate("/");
    };

    return (
        <div className="loggin-container">
            <div className="loggin-left">
                <BackgroundCarousel />
                <div className="overlay"></div>

                <div className="loggin-content">
                    <div className="brand-badge">
                        <div className="badge-icon"><i className="fi fi-rr-membership"></i></div>
                    </div>
                    <h1 className="loggin-title">ZonaPiloto</h1>
                    <p className="loggin-slogan">Tu conexión con la vida universitaria</p>

                    <div className="features">
                        <div className="feature-item">
                            <span className="feature-icon"><i className="fi fi-sr-books"></i></span>
                            <span className="feature-text">Banco de Preguntas</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon"><i className="fi fi-sr-handshake"></i></span>
                            <span className="feature-text">Comunidad Activa</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon"><i className="fi fi-ss-resources"></i></span>
                            <span className="feature-text">Recursos Académicos</span>
                        </div>
                    </div>
                </div>

                <div className="decorative-elements">
                    <div className="circle circle-1"></div>
                    <div className="circle circle-2"></div>
                    <div className="circle circle-3"></div>
                </div>
            </div>

            <div className="loggin-right">
                <button onClick={goToHome} className="home-button" aria-label="Volver al inicio">
                    <i className="fi fi-rr-home"></i>
                </button>

                <form className="loggin-form" onSubmit={handleSubmit}>
                    <div className="form-header">
                        <h2>Iniciar Sesión</h2>
                        <p className="form-subtitle">Bienvenido de nuevo </p>
                    </div>

                    <div className="form-content">
                        <div className="form-group">
                            <label htmlFor="email">
                                <span className="label-icon"><i className="fi fi-sc-envelope"></i></span>
                                Correo institucional
                            </label>
                            <div className="input-wrapper">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="usuario@unipiloto.edu.co"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <span className="label-icon"><i className="fi fi-sr-lock"></i></span>
                                Contraseña
                            </label>
                            <div className="input-wrapper password-wrapper">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Mostrar contraseña"
                                >
                                    {showPassword ? <i className="fi fi-rs-crossed-eye"></i> : <i className="fi fi-rr-eye"></i>}
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Recordarme</span>
                            </label>
                            <a
                                href="https://cronos.unipiloto.edu.co/authorization.do"
                                className="forgot-password">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className={`loggin-button ${isLoading ? "loading" : ""}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    <span>Iniciando...</span>
                                </>
                            ) : (
                                <>
                                    <span>Entrar</span>
                                    <span className="button-arrow">→</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="decorative-shape"></div>
            </div>
        </div>
    );
}

export default Login;
