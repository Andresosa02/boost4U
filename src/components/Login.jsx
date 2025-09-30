import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import { X, Crown } from "lucide-react";
import "../styles/login.css";

export const AuthModal = ({ isVisible, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isMouseDownInside, setIsMouseDownInside] = useState(false);
  const currentUrl = window.location.origin + window.location.pathname;
  useEffect(() => {
    if (isVisible) {
      setEmail("");
      setPassword("");
      setUsername("");
      setMessage("");
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const generateDefaultUsername = () => {
    const randomNumber = Math.floor(Math.random() * 9999 + 10);
    return `user${randomNumber}`;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (loading) return <div>...</div>;

    if (!email.trim()) {
      setMessage("Por favor, introduce tu email");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: password || "temp-password", // Añade un campo de contraseña real
        });

        if (error) throw error;
        setMessage("¡Inicio de sesión exitoso!");
        setTimeout(() => onClose(), 1500);
      } else {
        // Generar username por defecto si no se proporciona uno
        const finalUsername = username.trim() || generateDefaultUsername();

        const { error } = await supabase.auth.signUp({
          email,
          password: password || "temp-password", // Añade un campo de contraseña real
          options: {
            data: {
              full_name: finalUsername,
            },
          },
        });

        if (error) throw error;
        setMessage("¡Cuenta creada! Revisa tu email para verificar.");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: currentUrl,
        },
      });

      if (error) throw error;
    } catch (error) {
      setMessage(error.message);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleOverlayClick = (e) => {
    // Solo cerrar si el clic fue directamente en el overlay y no se arrastró desde dentro
    if (e.target === e.currentTarget && !isMouseDownInside) {
      onClose();
    }
  };

  const handleMouseDown = () => {
    // Marcar que el mouse se presionó dentro del contenedor
    setIsMouseDownInside(true);
  };

  const handleMouseUp = () => {
    // Resetear el estado después de un breve delay
    setTimeout(() => {
      setIsMouseDownInside(false);
    }, 100);
  };

  const handleContainerClick = (e) => {
    // Prevenir que el clic se propague al overlay
    e.stopPropagation();
  };

  return (
    <div className="auth-overlay" onClick={handleOverlayClick}>
      <div
        className="auth-container"
        onClick={handleContainerClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <button className="auth-close" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Lado izquierdo - Formulario */}
        <div className="auth-left">
          <div className="auth-form-container">
            <h2 className="auth-title">
              {isLogin ? "Iniciar sesión" : "Crear cuenta"}
            </h2>

            <p className="auth-subtitle">
              {isLogin ? (
                <>
                  ¿No tienes una cuenta?{" "}
                  <button className="auth-link" onClick={toggleMode}>
                    Crea una aquí
                  </button>
                </>
              ) : (
                <>
                  ¿Ya eres miembro?{" "}
                  <button className="auth-link" onClick={toggleMode}>
                    Inicia sesión aquí
                  </button>
                </>
              )}
            </p>

            {/* Botones de redes sociales */}
            <div className="auth-social-buttons">
              <button
                className="auth-social-btn"
                onClick={() => handleSocialAuth("discord")}
                title="Discord"
              >
                <div className="social-icon discord-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
              </button>

              <button
                className="auth-social-btn"
                onClick={() => handleSocialAuth("google")}
                title="Google"
              >
                <div className="social-icon google-icon">G</div>
              </button>

              <button
                className="auth-social-btn"
                onClick={() => handleSocialAuth("github")}
                title="GitHub"
              >
                <div className="social-icon github-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
              </button>

              <button
                className="auth-social-btn"
                onClick={() => handleSocialAuth("facebook")}
                title="Facebook"
              >
                <div className="social-icon facebook-icon">f</div>
              </button>

              <button className="auth-social-btn" title="Battle.net">
                <div className="social-icon battlenet-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
              </button>
            </div>

            <div className="auth-divider">
              <span>
                O {isLogin ? "Inicia Sesión" : "Regístrate"} Con Email
              </span>
            </div>

            <form onSubmit={handleAuth} className="auth-form">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Username - Opcional"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="auth-input"
                />
              )}

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
              />

              {!isLogin && (
                <p className="auth-terms">
                  Al crear una cuenta, aceptas nuestros{" "}
                  <a href="#" className="auth-link">
                    Términos de Servicio
                  </a>{" "}
                  y{" "}
                  <a href="#" className="auth-link">
                    Política de privacidad
                  </a>
                </p>
              )}

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? "Cargando..." : "Continuar →"}
              </button>
            </form>

            {message && (
              <div
                className={`auth-message ${
                  message.includes("exitoso") || message.includes("creada")
                    ? "success"
                    : "error"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Lado derecho - Logo animado */}
        <div className="auth-right">
          <div className="auth-logo-container">
            <div className="auth-logo-bg"></div>
            <div className="auth-logo">
              <Crown size={48} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
