import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateProfile } from "../services/Userservice.js";

export default function EditarPerfil() {
  const navigate = useNavigate();

  // Cargar usuario desde sessionStorage
  const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    name: storedUser.nombre_completo || "",
    currentPassword: "",
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(
    storedUser.foto_perfil || null
  );
  const [showCurrent, setShowCurrent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Cámara
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
    setPhoto(file);
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
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch {
      setError("No se pudo acceder a la cámara. Verifica los permisos.");
      setShowCamera(false);
    }
  };

  // ── Capturar foto ───────────────────────────────────────────
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], "foto_perfil.jpg", { type: "image/jpeg" });
      setPhoto(file);
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

  // ── Guardar cambios ─────────────────────────────────────────
  const handleSave = async () => {
    setError("");

    if (!form.name.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }
    if (!form.currentPassword) {
      setError("Debes ingresar tu contraseña actual para guardar cambios.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("id_usuario", storedUser.id_usuario);
      formData.append("nombre_completo", form.name.trim());
      formData.append("password_actual", form.currentPassword);
      if (photo) formData.append("foto", photo);

      const data = await updateProfile(formData);

      // Actualizar sessionStorage con el nuevo nombre
      const updatedUser = {
        ...storedUser,
        nombre_completo: form.name.trim(),
        ...(photo && { foto_perfil: photoPreview }),
      };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));

      setSaved(true);
      setForm((prev) => ({ ...prev, currentPassword: "" }));
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "Error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.root}>
      <style>{globalStyles}</style>
      <div style={styles.ambientBg} />
      <div style={styles.grain} />

      {/* NAV */}
      <nav style={styles.nav}>
        <Link to="/gallery" style={styles.logoWrap}>
          <span style={styles.logoIcon}>◈</span>
          <span style={styles.logoText}>CLOUD<em>CINEMA</em></span>
        </Link>
        <Link to="/gallery" style={styles.backBtn} className="back-btn">
          ← Volver a la galería
        </Link>
      </nav>

      {/* PAGE */}
      <div style={styles.page}>

        {/* LEFT — Avatar card */}
        <div style={styles.sidebar}>
          <div style={styles.avatarCard}>

            {/* Avatar con menú */}
            <div style={{ position: "relative", display: "inline-block", marginBottom: "0.4rem" }}>
              <div
                style={styles.avatarWrap}
                className="avatar-wrap"
                onClick={() => setShowPhotoMenu((v) => !v)}
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="avatar" style={styles.avatarImg} />
                ) : (
                  <div style={styles.avatarFallback}>
                    <span style={styles.avatarInitial}>
                      {(storedUser.nombre_completo || "U")[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <div style={styles.avatarOverlay} className="avatar-overlay">
                  <span style={styles.avatarOverlayIcon}></span>
                  <span style={styles.avatarOverlayText}>Cambiar</span>
                </div>
              </div>

              {/* Dropdown */}
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

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <p style={styles.avatarName}>{form.name || "Usuario"}</p>
            <p style={styles.avatarEmail}>{storedUser.correo || ""}</p>
            <div style={styles.avatarBadge}>✓ Cuenta activa</div>
          </div>

          {/* Info de campos editables */}
          <div style={styles.infoBox}>
            <p style={styles.infoTitle}> Campos editables</p>
            <p style={styles.infoText}>• Nombre completo</p>
            <p style={styles.infoText}>• Foto de perfil</p>
            <div style={styles.infoDivider} />
            <p style={styles.infoWarning}> Se requiere tu contraseña actual para guardar cualquier cambio.</p>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h1 style={styles.formTitle}>Editar perfil</h1>
            <p style={styles.formSubtitle}>Actualiza tu nombre y foto de perfil</p>
          </div>

          {error && <div style={styles.errorBox}>⚠ {error}</div>}
          {saved && <div style={styles.successBox}>✓ Cambios guardados correctamente</div>}

          <div style={styles.fields}>

            {/* Nombre */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Nombre completo</label>
              <div style={styles.inputWrap} className="input-wrap">
                <span style={styles.inputIcon}></span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={styles.input}
                  className="field-input"
                  placeholder="Tu nombre"
                />
              </div>
            </div>

            {/* Correo — solo lectura */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                Correo electrónico <span style={styles.readonlyBadge}>No editable</span>
              </label>
              <div style={{ ...styles.inputWrap, opacity: 0.5 }} className="input-wrap">
                <span style={styles.inputIcon}>✉</span>
                <input
                  type="email"
                  value={storedUser.correo || ""}
                  style={styles.input}
                  readOnly
                  disabled
                />
              </div>
            </div>

            {/* Separador */}
            <div style={styles.separator}>
              <span style={styles.separatorLine} />
              <span style={styles.separatorText}>Verificación de identidad</span>
              <span style={styles.separatorLine} />
            </div>

            {/* Contraseña actual — obligatoria */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                Contraseña actual <span style={styles.requiredBadge}>Obligatorio</span>
              </label>
              <div style={styles.inputWrap} className="input-wrap">
                <span style={styles.inputIcon}></span>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                  style={styles.input}
                  className="field-input"
                  placeholder="Ingresa tu contraseña para confirmar"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={styles.eyeBtn}>
                  {showCurrent ? "" : "👁"}
                </button>
              </div>
              <span style={styles.fieldHint}>
                Necesaria para verificar tu identidad antes de guardar cambios.
              </span>
            </div>

          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <Link to="/gallery" style={styles.cancelBtn} className="cancel-btn">
              Cancelar
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ ...styles.saveBtn, opacity: saving ? 0.8 : 1 }}
              className="save-btn"
            >
              {saving ? (
                <span style={styles.loadingRow}>
                  <span className="spinner" style={styles.spinner} />
                  Guardando...
                </span>
              ) : "Guardar cambios →"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal cámara */}
      {showCamera && (
        <div style={styles.cameraOverlay}>
          <div style={styles.cameraModal}>
            <p style={styles.cameraTitle}>📸 Tomar foto de perfil</p>
            <video ref={videoRef} autoPlay playsInline style={styles.cameraVideo} />
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

  .avatar-wrap { cursor: pointer; }
  .avatar-wrap:hover .avatar-overlay { opacity: 1 !important; }
  .avatar-overlay { transition: opacity 0.2s !important; }

  .photo-menu-item:hover { background: rgba(200,169,110,0.1) !important; color: #c8a96e !important; }
  .photo-menu-item { transition: all 0.15s ease !important; }

  .input-wrap:focus-within {
    border-color: rgba(200,169,110,0.6) !important;
    box-shadow: 0 0 0 3px rgba(200,169,110,0.08) !important;
  }
  .field-input:focus { outline: none; }
  .field-input::placeholder { color: #3a3630; }

  .save-btn:hover:not(:disabled) {
    background: #d4b87a !important;
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(200,169,110,0.3) !important;
  }
  .save-btn { transition: all 0.2s !important; }

  .cancel-btn:hover { background: rgba(255,255,255,0.06) !important; color: #e8e4dc !important; }
  .cancel-btn { transition: all 0.2s !important; }

  .camera-capture-btn:hover { background: #d4b87a !important; }
  .camera-cancel-btn:hover { background: rgba(255,255,255,0.08) !important; }
  .camera-capture-btn, .camera-cancel-btn { transition: all 0.2s ease !important; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { animation: spin 0.8s linear infinite; }
  @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
`;

const styles = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#080810",
    color: "#e8e4dc",
    minHeight: "100vh",
    position: "relative",
  },
  ambientBg: {
    position: "fixed", inset: 0,
    background: "radial-gradient(ellipse 50% 50% at 30% 30%, #c8a96e0d 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 70%, #7b4b9e10 0%, transparent 50%)",
    pointerEvents: "none", animation: "pulse 8s ease infinite", zIndex: 0,
  },
  grain: {
    position: "fixed", inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
    opacity: 0.4, pointerEvents: "none", zIndex: 1,
  },
  nav: {
    position: "sticky", top: 0, zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "1rem 3rem",
    background: "rgba(8,8,16,0.9)", backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(200,169,110,0.08)",
  },
  logoWrap: { display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" },
  logoIcon: { color: "#c8a96e", fontSize: "1.2rem" },
  logoText: { fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.12em", color: "#e8e4dc" },
  backBtn: {
    display: "inline-flex", alignItems: "center", gap: "0.4rem",
    color: "#9e9a93", textDecoration: "none", fontSize: "0.85rem",
    padding: "0.5rem 1rem", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "50px", background: "rgba(255,255,255,0.03)",
  },
  page: {
    position: "relative", zIndex: 2,
    display: "flex", gap: "2rem", padding: "3rem",
    maxWidth: "1000px", margin: "0 auto", alignItems: "flex-start",
  },

  // SIDEBAR
  sidebar: { width: "260px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "1rem" },
  avatarCard: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px", padding: "2rem 1.5rem",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem",
    animation: "fadeIn 0.4s ease forwards",
  },
  avatarWrap: {
    position: "relative", width: "90px", height: "90px",
    borderRadius: "50%", overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  avatarFallback: {
    width: "100%", height: "100%",
    background: "linear-gradient(135deg, #c8a96e, #8c6e3a)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  avatarInitial: { fontSize: "2rem", fontWeight: 700, color: "#080810" },
  avatarOverlay: {
    position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    gap: "0.2rem", opacity: 0,
  },
  avatarOverlayIcon: { fontSize: "1.2rem" },
  avatarOverlayText: { fontSize: "0.65rem", color: "#fff", letterSpacing: "0.06em" },
  avatarName: { fontWeight: 600, fontSize: "1rem" },
  avatarEmail: { fontSize: "0.78rem", color: "#5a5650" },
  avatarBadge: {
    marginTop: "0.2rem", fontSize: "0.7rem", color: "#6ec88a",
    background: "rgba(110,200,138,0.1)", border: "1px solid rgba(110,200,138,0.2)",
    padding: "0.2rem 0.7rem", borderRadius: "50px",
  },

  // Photo dropdown
  photoMenu: {
    position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
    background: "#13131f", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", overflow: "hidden", zIndex: 20,
    minWidth: "160px", boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
  },
  photoMenuItem: {
    display: "block", width: "100%", padding: "0.7rem 1rem",
    background: "transparent", border: "none", color: "#e8e4dc",
    fontSize: "0.85rem", cursor: "pointer", textAlign: "left",
    fontFamily: "'DM Sans', sans-serif",
  },
  photoMenuDivider: { height: "1px", background: "rgba(255,255,255,0.07)" },

  // Info box
  infoBox: {
    background: "rgba(200,169,110,0.04)", border: "1px solid rgba(200,169,110,0.12)",
    borderRadius: "12px", padding: "1.2rem",
  },
  infoTitle: { fontSize: "0.8rem", fontWeight: 600, color: "#c8a96e", marginBottom: "0.6rem" },
  infoText: { fontSize: "0.78rem", color: "#9e9a93", marginBottom: "0.25rem" },
  infoDivider: { height: "1px", background: "rgba(200,169,110,0.1)", margin: "0.7rem 0" },
  infoWarning: { fontSize: "0.75rem", color: "#7a6a50", lineHeight: 1.5 },

  // FORM CARD
  formCard: {
    flex: 1, background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px",
    padding: "2.5rem", animation: "fadeIn 0.4s ease 0.1s both",
  },
  formHeader: { marginBottom: "2rem" },
  formTitle: { fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", marginBottom: "0.4rem" },
  formSubtitle: { color: "#5a5650", fontSize: "0.875rem" },

  errorBox: {
    background: "rgba(220,80,80,0.1)", border: "1px solid rgba(220,80,80,0.25)",
    borderRadius: "8px", padding: "0.75rem 1rem",
    fontSize: "0.85rem", color: "#e07070", marginBottom: "1.5rem",
  },
  successBox: {
    background: "rgba(110,200,138,0.1)", border: "1px solid rgba(110,200,138,0.25)",
    borderRadius: "8px", padding: "0.75rem 1rem",
    fontSize: "0.85rem", color: "#6ec88a", marginBottom: "1.5rem",
  },

  fields: { display: "flex", flexDirection: "column", gap: "1.3rem" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "0.45rem" },
  label: { fontSize: "0.78rem", color: "#9e9a93", letterSpacing: "0.06em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.5rem" },
  readonlyBadge: {
    textTransform: "none", letterSpacing: 0, fontSize: "0.68rem",
    color: "#3a3630", background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)", borderRadius: "4px",
    padding: "0.1rem 0.4rem",
  },
  requiredBadge: {
    textTransform: "none", letterSpacing: 0, fontSize: "0.68rem",
    color: "#c8a96e", background: "rgba(200,169,110,0.08)",
    border: "1px solid rgba(200,169,110,0.2)", borderRadius: "4px",
    padding: "0.1rem 0.4rem",
  },
  inputWrap: {
    display: "flex", alignItems: "center",
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px", padding: "0 1rem",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputIcon: { fontSize: "0.9rem", marginRight: "0.6rem", opacity: 0.5, flexShrink: 0 },
  input: {
    flex: 1, background: "transparent", border: "none",
    color: "#e8e4dc", fontSize: "0.95rem", padding: "0.8rem 0",
    fontFamily: "'DM Sans', sans-serif",
  },
  eyeBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem", padding: "0.4rem", opacity: 0.6 },
  fieldHint: { fontSize: "0.72rem", color: "#3a3630", marginTop: "0.15rem" },

  separator: { display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.3rem 0" },
  separatorLine: { flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" },
  separatorText: { fontSize: "0.72rem", color: "#3a3630", whiteSpace: "nowrap" },

  actions: {
    display: "flex", justifyContent: "flex-end", gap: "0.75rem",
    marginTop: "2.5rem", paddingTop: "1.5rem",
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  cancelBtn: {
    padding: "0.75rem 1.5rem", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px", color: "#9e9a93", textDecoration: "none",
    fontSize: "0.9rem", background: "transparent",
  },
  saveBtn: {
    background: "#c8a96e", color: "#080810", border: "none",
    borderRadius: "8px", padding: "0.75rem 1.75rem",
    fontSize: "0.9rem", fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
  },
  loadingRow: { display: "flex", alignItems: "center", gap: "0.5rem" },
  spinner: {
    display: "inline-block", width: "13px", height: "13px",
    border: "2px solid rgba(8,8,16,0.3)", borderTopColor: "#080810", borderRadius: "50%",
  },

  // Camera modal
  cameraOverlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
    zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(6px)",
  },
  cameraModal: {
    background: "#13131f", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px", padding: "1.5rem",
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: "1rem", maxWidth: "380px", width: "90%",
  },
  cameraTitle: { fontSize: "1rem", fontWeight: 600, color: "#e8e4dc" },
  cameraVideo: { width: "100%", borderRadius: "10px", background: "#000", maxHeight: "260px", objectFit: "cover" },
  cameraBtns: { display: "flex", gap: "0.75rem", width: "100%" },
  cameraCancelBtn: {
    flex: 1, padding: "0.75rem",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px", color: "#9e9a93", fontSize: "0.9rem",
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
  cameraCaptureBtn: {
    flex: 1, padding: "0.75rem",
    background: "#c8a96e", border: "none",
    borderRadius: "10px", color: "#080810", fontSize: "0.9rem",
    fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  },
};