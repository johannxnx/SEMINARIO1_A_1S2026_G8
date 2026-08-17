import { useEffect } from "react";

export default function Notification({
  message,
  type = "success", // success | error | info
  onClose,
  duration = 4000
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const colors = {
    success: {
      bg: "#1e2b22",
      accent: "#6ec88a",
      icon: "✔"
    },
    error: {
      bg: "#2b1e1e",
      accent: "#e07070",
      icon: "✖"
    },
    info: {
      bg: "#1e2430",
      accent: "#6ea8c8",
      icon: "ℹ"
    }
  };

  const current = colors[type];

  return (
    <div style={{
      position: "fixed",
      bottom: "30px",
      right: "30px",
      minWidth: "320px",
      background: current.bg,
      color: "#fff",
      padding: "1rem 1.2rem",
      borderRadius: "14px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      zIndex: 9999,
      animation: "slideIn 0.4s ease"
    }}>

      {/* Icono */}
      <div style={{
        background: current.accent,
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        color: "#000"
      }}>
        {current.icon}
      </div>

      {/* Texto */}
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: "0.9rem" }}>{message}</p>
      </div>

      {/* Botón cerrar */}
      <button
        onClick={onClose}
        style={{
          background: "transparent",
          border: "none",
          color: "#aaa",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        ✕
      </button>

      {/* Barra progreso */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        height: "4px",
        width: "100%",
        background: current.accent,
        animation: `progress ${duration}ms linear`
      }} />
    </div>
  );
}