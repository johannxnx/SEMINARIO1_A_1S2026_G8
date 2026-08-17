import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(email, password);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      navigate("/gallery");
    } catch (err) {
      setError(err.message || "No se pudo conectar con el servidor. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      <style>{globalStyles}</style>

      {/* Ambient background */}
      <div style={styles.ambientBg} />
      <div style={styles.grain} />

      {/* Back button */}
      <Link to="/" style={styles.backBtn} className="back-btn">
        <span style={styles.backArrow}>←</span>
        Volver al inicio
      </Link>

      {/* Main card */}
      <div style={styles.card} className="login-card">

        {/* Logo */}
        <div style={styles.logoWrap}>
          <span style={styles.logoIcon}>◈</span>
          <span style={styles.logoText}>CLOUD<em>CINEMA</em></span>
        </div>

        <h1 style={styles.title}>Bienvenido de vuelta</h1>
        <p style={styles.subtitle}>Inicia sesión para continuar disfrutando</p>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <span>⚠ {error}</span>
          </div>
        )}

        {/* Form */}
        <div style={styles.form}>
          {/* Email */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Correo electrónico</label>
            <div style={styles.inputWrap} className="input-wrap">
              <span style={styles.inputIcon}></span>
              <input
                type="email"
                placeholder="ejemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                className="field-input"
                onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>Contraseña</label>
            </div>
            <div style={styles.inputWrap} className="input-wrap">
              <span style={styles.inputIcon}></span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                className="field-input"
                onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? "" : "👁"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ ...styles.submitBtn, opacity: loading ? 0.8 : 1 }}
            className="submit-btn"
          >
            {loading ? (
              <span style={styles.loadingRow}>
                <span className="spinner" style={styles.spinner} />
                Iniciando sesión...
              </span>
            ) : (
              "Iniciar Sesión →"
            )}
          </button>

          {/* Divider */}
          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>¿No tienes cuenta?</span>
            <span style={styles.dividerLine} />
          </div>

          {/* Register redirect */}
          <Link to="/register" style={styles.registerBtn} className="register-btn">
            Crear cuenta gratis
          </Link>
        </div>

      </div>

      {/* Footer note */}
      <p style={styles.footerNote}>
        © 2026 CloudCinema · <a href="#" style={styles.footerLink}>Privacidad</a> · <a href="#" style={styles.footerLink}>Términos</a>
      </p>
    </div>
  );
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .back-btn:hover {
    background: rgba(200,169,110,0.1) !important;
    border-color: rgba(200,169,110,0.3) !important;
    color: #c8a96e !important;
    transform: translateX(-3px);
  }
  .back-btn { transition: all 0.2s ease !important; }

  .login-card {
    animation: fadeUp 0.5s ease forwards;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .input-wrap:focus-within {
    border-color: rgba(200,169,110,0.6) !important;
    box-shadow: 0 0 0 3px rgba(200,169,110,0.08) !important;
  }
  .field-input:focus { outline: none; }
  .field-input::placeholder { color: #3a3630; }

  .submit-btn:hover:not(:disabled) {
    background: #d4b87a !important;
    transform: translateY(-1px);
    box-shadow: 0 8px 30px rgba(200,169,110,0.3) !important;
  }
  .submit-btn:active:not(:disabled) { transform: translateY(0) !important; }
  .submit-btn { transition: all 0.2s ease !important; }

  .register-btn:hover {
    background: rgba(200,169,110,0.08) !important;
    border-color: rgba(200,169,110,0.4) !important;
    color: #c8a96e !important;
  }
  .register-btn { transition: all 0.2s ease !important; }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .spinner { animation: spin 0.8s linear infinite; }

  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
`;

const styles = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#080810",
    color: "#e8e4dc",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    padding: "2rem",
  },
  ambientBg: {
    position: "fixed",
    inset: 0,
    background: "radial-gradient(ellipse 50% 60% at 50% 40%, #c8a96e10 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 20% 80%, #7b4b9e14 0%, transparent 50%)",
    pointerEvents: "none",
    animation: "pulse 8s ease infinite",
    zIndex: 0,
  },
  grain: {
    position: "fixed",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
    opacity: 0.4,
    pointerEvents: "none",
    zIndex: 1,
  },

  backBtn: {
    position: "fixed",
    top: "1.5rem",
    left: "1.5rem",
    zIndex: 10,
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    color: "#9e9a93",
    textDecoration: "none",
    fontSize: "0.85rem",
    padding: "0.5rem 1rem",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "50px",
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(10px)",
  },
  backArrow: { fontSize: "1rem" },

  card: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "440px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "2.5rem",
    backdropFilter: "blur(20px)",
  },

  logoWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    marginBottom: "2rem",
  },
  logoIcon: { color: "#c8a96e", fontSize: "1.2rem" },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.1rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#e8e4dc",
  },

  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.8rem",
    textAlign: "center",
    marginBottom: "0.5rem",
    fontWeight: 700,
  },
  subtitle: {
    textAlign: "center",
    color: "#5a5650",
    fontSize: "0.875rem",
    marginBottom: "2rem",
  },

  errorBox: {
    background: "rgba(220,80,80,0.1)",
    border: "1px solid rgba(220,80,80,0.25)",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    fontSize: "0.85rem",
    color: "#e07070",
    marginBottom: "1.5rem",
    textAlign: "center",
  },

  form: { display: "flex", flexDirection: "column", gap: "1.2rem" },

  fieldGroup: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  labelRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: "0.8rem", color: "#9e9a93", letterSpacing: "0.06em", textTransform: "uppercase" },

  inputWrap: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "0 1rem",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputIcon: { fontSize: "0.9rem", marginRight: "0.6rem", opacity: 0.5 },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "#e8e4dc",
    fontSize: "0.95rem",
    padding: "0.85rem 0",
    fontFamily: "'DM Sans', sans-serif",
  },
  eyeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    padding: "0.4rem",
    opacity: 0.6,
    transition: "opacity 0.2s",
  },

  submitBtn: {
    background: "#c8a96e",
    color: "#080810",
    border: "none",
    borderRadius: "10px",
    padding: "0.9rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    letterSpacing: "0.03em",
    marginTop: "0.4rem",
  },
  loadingRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" },
  spinner: {
    display: "inline-block",
    width: "14px",
    height: "14px",
    border: "2px solid rgba(8,8,16,0.3)",
    borderTopColor: "#080810",
    borderRadius: "50%",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    margin: "0.2rem 0",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "rgba(255,255,255,0.07)",
  },
  dividerText: { fontSize: "0.78rem", color: "#3a3630", whiteSpace: "nowrap" },

  registerBtn: {
    display: "block",
    textAlign: "center",
    padding: "0.85rem",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#9e9a93",
    textDecoration: "none",
    fontSize: "0.9rem",
    background: "transparent",
  },

  footerNote: {
    position: "relative",
    zIndex: 2,
    marginTop: "2rem",
    fontSize: "0.75rem",
    color: "#2e2b28",
    textAlign: "center",
  },
  footerLink: { color: "#3a3630", textDecoration: "none" },
};