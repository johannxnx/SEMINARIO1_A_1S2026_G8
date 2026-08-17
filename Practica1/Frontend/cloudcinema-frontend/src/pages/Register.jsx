import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    photo: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // ── Foto desde archivo ──────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, photo: file });
    setPhotoPreview(URL.createObjectURL(file));
    setShowPhotoMenu(false);
  };

  // ── Abrir cámara ────────────────────────────────────────────
  const openCamera = async () => {
    setShowPhotoMenu(false);
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      // Esperar a que el video esté montado
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch {
      setError("No se pudo acceder a la cámara. Verifica los permisos.");
      setShowCamera(false);
    }
  };

  // ── Capturar foto desde cámara ──────────────────────────────
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], "foto_camara.jpg", { type: "image/jpeg" });
      setForm((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(blob));
    }, "image/jpeg");
    closeCamera();
  };

  // ── Cerrar cámara ───────────────────────────────────────────
  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  // ── Submit ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("correo", form.email);
      formData.append("nombre_completo", form.name);
      formData.append("password", form.password);
      formData.append("confirm_password", form.confirmPassword);
      if (form.photo) formData.append("foto", form.photo);

      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.message || "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Débil", color: "#e07070", width: "30%" };
    if (p.length < 10) return { label: "Regular", color: "#c8a96e", width: "60%" };
    return { label: "Fuerte", color: "#6ec88a", width: "100%" };
  };
  const strength = passwordStrength();

  return (
    <div style={styles.root}>
      <style>{globalStyles}</style>

      <div style={styles.ambientBg} />
      <div style={styles.grain} />

      {/* Back button */}
      <Link to="/" style={styles.backBtn} className="back-btn">
        <span>←</span> Volver al inicio
      </Link>

      {/* Card */}
      <div style={styles.card} className="register-card">

        {/* Logo */}
        <div style={styles.logoWrap}>
          <span style={styles.logoIcon}>◈</span>
          <span style={styles.logoText}>CLOUD<em>CINEMA</em></span>
        </div>

        <h1 style={styles.title}>Crea tu cuenta</h1>
        <p style={styles.subtitle}>Únete y disfruta del mejor cine</p>

        {error && <div style={styles.errorBox}>⚠ {error}</div>}

        <div style={styles.form}>

          {/* ── Avatar ── */}
          <div style={styles.avatarSection}>
            <div style={{ position: "relative", display: "inline-block" }}>
              {/* Avatar circle */}
              <div
                style={styles.avatarLabel}
                className="avatar-label"
                onClick={() => setShowPhotoMenu((v) => !v)}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="preview" style={styles.avatarImg} />
                ) : (
                  <div style={styles.avatarPlaceholder}>
                    <span style={styles.avatarIcon}></span>
                    <span style={styles.avatarText}>Foto de perfil</span>
                    <span style={styles.avatarHint}>Opcional</span>
                  </div>
                )}
              </div>

              {/* Dropdown menu */}
              {showPhotoMenu && (
                <div style={styles.photoMenu} className="photo-menu">
                  <button
                    style={styles.photoMenuItem}
                    className="photo-menu-item"
                    onClick={() => fileInputRef.current.click()}
                  >
                     &nbsp;Elegir archivo
                  </button>
                  <div style={styles.photoMenuDivider} />
                  <button
                    style={styles.photoMenuItem}
                    className="photo-menu-item"
                    onClick={openCamera}
                  >
                     &nbsp;Tomar foto
                  </button>
                </div>
              )}
            </div>

            {/* Input file oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          {/* ── Modal cámara ── */}
          {showCamera && (
            <div style={styles.cameraOverlay}>
              <div style={styles.cameraModal}>
                <p style={styles.cameraTitle}>📸 Tomar foto</p>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={styles.cameraVideo}
                />
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <div style={styles.cameraBtns}>
                  <button onClick={closeCamera} style={styles.cameraCancelBtn} className="camera-cancel-btn">
                    Cancelar
                  </button>
                  <button onClick={capturePhoto} style={styles.cameraCaptureBtn} className="camera-capture-btn">
                    Capturar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Name */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Nombre completo</label>
            <div style={styles.inputWrap} className="input-wrap">
              <span style={styles.inputIcon}></span>
              <input
                type="text"
                placeholder="Tu nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={styles.input}
                className="field-input"
              />
            </div>
          </div>

          {/* Email */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Correo electrónico</label>
            <div style={styles.inputWrap} className="input-wrap">
              <span style={styles.inputIcon}></span>
              <input
                type="email"
                placeholder="ejemplo@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={styles.input}
                className="field-input"
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Contraseña</label>
            <div style={styles.inputWrap} className="input-wrap">
              <span style={styles.inputIcon}></span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={styles.input}
                className="field-input"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                {showPassword ? "" : "👁"}
              </button>
            </div>
            {strength && (
              <div style={styles.strengthWrap}>
                <div style={styles.strengthBg}>
                  <div style={{ ...styles.strengthBar, width: strength.width, background: strength.color }} />
                </div>
                <span style={{ ...styles.strengthLabel, color: strength.color }}>{strength.label}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Confirmar contraseña</label>
            <div style={styles.inputWrap} className="input-wrap">
              <span style={styles.inputIcon}></span>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Repite tu contraseña"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                style={styles.input}
                className="field-input"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                {showConfirm ? "" : "👁"}
              </button>
            </div>
            {form.confirmPassword && (
              <span style={{
                fontSize: "0.75rem",
                color: form.password === form.confirmPassword ? "#6ec88a" : "#e07070",
                marginTop: "0.2rem",
              }}>
                {form.password === form.confirmPassword ? "✓ Las contraseñas coinciden" : "✗ No coinciden"}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ ...styles.submitBtn, opacity: loading ? 0.8 : 1 }}
            className="submit-btn"
          >
            {loading ? (
              <span style={styles.loadingRow}>
                <span className="spinner" style={styles.spinner} />
                Creando cuenta...
              </span>
            ) : "Crear cuenta gratis →"}
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>¿Ya tienes cuenta?</span>
            <span style={styles.dividerLine} />
          </div>

          <Link to="/login" style={styles.loginBtn} className="login-btn">
            Iniciar Sesión
          </Link>
        </div>
      </div>

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

  .register-card { animation: fadeUp 0.5s ease forwards; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .avatar-label {
    cursor: pointer;
    transition: all 0.2s ease !important;
  }
  .avatar-label:hover {
    border-color: rgba(200,169,110,0.5) !important;
    background: rgba(200,169,110,0.05) !important;
  }

  .photo-menu-item:hover {
    background: rgba(200,169,110,0.1) !important;
    color: #c8a96e !important;
  }
  .photo-menu-item { transition: all 0.15s ease !important; }

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
  .submit-btn { transition: all 0.2s ease !important; }

  .login-btn:hover {
    background: rgba(200,169,110,0.08) !important;
    border-color: rgba(200,169,110,0.4) !important;
    color: #c8a96e !important;
  }
  .login-btn { transition: all 0.2s ease !important; }

  .camera-capture-btn:hover { background: #d4b87a !important; }
  .camera-cancel-btn:hover { background: rgba(255,255,255,0.08) !important; }
  .camera-capture-btn, .camera-cancel-btn { transition: all 0.2s ease !important; }

  @keyframes spin { to { transform: rotate(360deg); } }
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
    padding: "5rem 2rem 2rem",
  },
  ambientBg: {
    position: "fixed",
    inset: 0,
    background: "radial-gradient(ellipse 50% 60% at 50% 40%, #c8a96e10 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 70%, #7b4b9e14 0%, transparent 50%)",
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
  card: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "460px",
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
    marginBottom: "1.5rem",
  },
  logoIcon: { color: "#c8a96e", fontSize: "1.2rem" },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.1rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.8rem",
    textAlign: "center",
    marginBottom: "0.5rem",
  },
  subtitle: {
    textAlign: "center",
    color: "#5a5650",
    fontSize: "0.875rem",
    marginBottom: "1.8rem",
  },
  errorBox: {
    background: "rgba(220,80,80,0.1)",
    border: "1px solid rgba(220,80,80,0.25)",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    fontSize: "0.85rem",
    color: "#e07070",
    marginBottom: "1.2rem",
    textAlign: "center",
  },
  form: { display: "flex", flexDirection: "column", gap: "1.1rem" },

  // Avatar
  avatarSection: { display: "flex", justifyContent: "center", marginBottom: "0.5rem" },
  avatarLabel: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    border: "2px dashed rgba(255,255,255,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    background: "rgba(255,255,255,0.03)",
    userSelect: "none",
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  avatarPlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.15rem",
  },
  avatarIcon: { fontSize: "1.4rem" },
  avatarText: { fontSize: "0.65rem", color: "#9e9a93", letterSpacing: "0.04em" },
  avatarHint: { fontSize: "0.6rem", color: "#3a3630" },

  // Photo menu dropdown
  photoMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#13131f",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    overflow: "hidden",
    zIndex: 20,
    minWidth: "160px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
  },
  photoMenuItem: {
    display: "block",
    width: "100%",
    padding: "0.7rem 1rem",
    background: "transparent",
    border: "none",
    color: "#e8e4dc",
    fontSize: "0.85rem",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "'DM Sans', sans-serif",
  },
  photoMenuDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.07)",
  },

  // Camera modal
  cameraOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(6px)",
  },
  cameraModal: {
    background: "#13131f",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    maxWidth: "380px",
    width: "90%",
  },
  cameraTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#e8e4dc",
  },
  cameraVideo: {
    width: "100%",
    borderRadius: "10px",
    background: "#000",
    maxHeight: "260px",
    objectFit: "cover",
  },
  cameraBtns: {
    display: "flex",
    gap: "0.75rem",
    width: "100%",
  },
  cameraCancelBtn: {
    flex: 1,
    padding: "0.75rem",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#9e9a93",
    fontSize: "0.9rem",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  cameraCaptureBtn: {
    flex: 1,
    padding: "0.75rem",
    background: "#c8a96e",
    border: "none",
    borderRadius: "10px",
    color: "#080810",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },

  // Fields
  fieldGroup: { display: "flex", flexDirection: "column", gap: "0.4rem" },
  label: { fontSize: "0.78rem", color: "#9e9a93", letterSpacing: "0.06em", textTransform: "uppercase" },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    padding: "0 1rem",
  },
  inputIcon: { fontSize: "0.9rem", marginRight: "0.6rem", opacity: 0.5 },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "#e8e4dc",
    fontSize: "0.95rem",
    padding: "0.8rem 0",
    fontFamily: "'DM Sans', sans-serif",
  },
  eyeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    padding: "0.4rem",
    opacity: 0.6,
  },

  strengthWrap: { display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.3rem" },
  strengthBg: { flex: 1, height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px" },
  strengthBar: { height: "100%", borderRadius: "2px", transition: "width 0.3s ease, background 0.3s ease" },
  strengthLabel: { fontSize: "0.72rem", minWidth: "45px" },

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
    marginTop: "0.3rem",
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
  divider: { display: "flex", alignItems: "center", gap: "0.75rem" },
  dividerLine: { flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" },
  dividerText: { fontSize: "0.78rem", color: "#3a3630", whiteSpace: "nowrap" },
  loginBtn: {
    display: "block",
    textAlign: "center",
    padding: "0.85rem",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#9e9a93",
    textDecoration: "none",
    fontSize: "0.9rem",
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