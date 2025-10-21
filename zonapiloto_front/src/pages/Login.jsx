import BackgroundCarousel from "../components/BackgroundCarousel";
import "../styles/login.css";

function Login() {
    return (
        <div className="login-container">
            <div className="login-left">
                <BackgroundCarousel />
                <div className="overlay"></div>
                <h1 className="login-title">ZonaPiloto</h1>
                <p className="login-slogan">Tu conexión con la vida universitaria</p>
            </div>

            <div className="login-right">
                <form className="login-form">
                    <h2>Iniciar Sesión</h2>
                    <p className="form-subtitle">Bienvenido de nuevo 👋</p>

                    <div className="form-group">
                        <label>Correo institucional</label>
                        <input type="email" placeholder="usuario@unipiloto.edu.co" required />
                    </div>

                    <div className="form-group">
                        <label>Contraseña</label>
                        <input type="password" placeholder="••••••••" required />
                    </div>

                    <button type="submit" className="login-button">
                        Entrar
                    </button>

                    <p className="form-footer">
                        ¿No tienes cuenta? <a href="#">Regístrate aquí</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
