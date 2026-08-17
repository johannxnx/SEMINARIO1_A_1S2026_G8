import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getUserPlaylist,
  removeFromPlaylist
} from "../services/playlistService";
import Notification from "../components/Notification";


export default function Playlist() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const [search, setSearch] = useState("");
const [profileOpen, setProfileOpen] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const id_usuario = user.id_usuario;

  const userName = user.nombre_completo || "Usuario";
  const userEmail = user.correo || "";
  const userInitial = userName[0]?.toUpperCase() || "U";
  const userPhoto = user.foto_perfil || null;


  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);

  const [notification, setNotification] = useState({
    message: "",
    type: "success",
    visible: false
  });

  // Cargar playlist
  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const data = await getUserPlaylist(id_usuario);
        setPlaylist(data);
      } catch (error) {
        setNotification({
          message: error.message,
          type: "error",
          visible: true
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id_usuario]);

  //  Ver película
  const handlePlay = (url) => {
    window.open(url, "_blank");
  };

  // Eliminar
  const handleRemove = async (movie) => {
    try {
      await removeFromPlaylist(id_usuario, movie.id_pelicula);

      setPlaylist(prev =>
        prev.filter(p => p.id_pelicula !== movie.id_pelicula)
      );

      setNotification({
        message: `"${movie.titulo}" eliminada de tu lista`,
        type: "info",
        visible: true
      });

    } catch (error) {
      setNotification({
        message: error.message,
        type: "error",
        visible: true
      });
    }
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth"
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };


  return (
    <div style={styles.root}>



      <style>{globalStyles}</style>

      {notification.visible && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() =>
            setNotification(prev => ({ ...prev, visible: false }))
          }
        />
      )}

      <h1 style={styles.title}> Mi Lista</h1>

      {/* NAV */}
      <nav style={styles.nav}>
        <Link to="/" style={styles.logoWrap} className="logo-link">
          <span style={styles.logoIcon}>◈</span>
          <span style={styles.logoText}>
            CLOUD<em>CINEMA</em>
          </span>
        </Link>

        {/* Playlist Button */}
        <Link
          to="/gallery"
          style={styles.playlistBtn}
          className="playlist-btn"
        >
          Volver
        </Link>



        {/* Profile */}
        <div style={styles.profileArea}>
          <button
            style={styles.profileBtn}
            className="profile-btn"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            {/* Avatar: foto real o inicial */}
            <div style={styles.profileAvatar}>
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt={userName}
                  style={styles.profileAvatarImg}
                />
              ) : (
                <span style={styles.profileInitial}>{userInitial}</span>
              )}
            </div>
            <span style={styles.profileName}>{userName}</span>
            <span
              style={{
                fontSize: "0.7rem",
                color: "#5a5650",
                transition: "transform 0.2s",
                transform: profileOpen ? "rotate(180deg)" : "rotate(0)",
              }}
            >
              ▼
            </span>
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div style={styles.dropdown} className="dropdown">
              <div style={styles.dropdownHeader}>
                <div style={styles.dropdownAvatar}>
                  {userPhoto ? (
                    <img
                      src={userPhoto}
                      alt={userName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        color: "#c8a96e",
                      }}
                    >
                      {userInitial}
                    </span>
                  )}
                </div>
                <div>
                  <p style={styles.dropdownName}>{userName}</p>
                  <p style={styles.dropdownEmail}>{userEmail}</p>
                </div>
              </div>
              <div style={styles.dropdownDivider} />
              <button
                style={styles.dropdownItem}
                className="dropdown-item"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/edit-profile");
                }}
              >
                &nbsp;Editar perfil
              </button>
              <div style={styles.dropdownDivider} />
              <button
                style={{ ...styles.dropdownItem, color: "#e07070" }}
                className="dropdown-item"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </nav>

      {loading ? (
        <p>Cargando...</p>
      ) : playlist.length === 0 ? (
        <p>No tienes películas en tu lista.</p>
      ) : (
        <div style={styles.carouselWrapper}>
          <button onClick={() => scroll("left")} style={styles.arrow}>‹</button>

          <div style={styles.carousel} ref={scrollRef}>
            {playlist.map(movie => (
              <div key={movie.id_pelicula} style={styles.card}>
                <img
                  src={movie.poster_url}
                  alt={movie.titulo}
                  style={styles.poster}
                />

                <div style={styles.cardInfo}>
                  <h3>{movie.titulo}</h3>
                  <p>{movie.director}</p>
                  <p style={{ fontSize: "0.8rem", color: "#aaa" }}>
                    {movie.fecha_agregado_formateada}
                  </p>

                  <div style={styles.actions}>
                    <button
                      style={styles.playBtn}
                      onClick={() => handlePlay(movie.url_contenido)}
                    >
                      Ver
                    </button>

                    <button
                      style={styles.removeBtn}
                      onClick={() => handleRemove(movie)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => scroll("right")} style={styles.arrow}>›</button>

        </div>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        <span style={styles.logoText}>
          CLOUD<em>CINEMA</em>
        </span>
        <p style={{ fontSize: "0.75rem", color: "#2e2b28" }}>
          © 2026 · Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
}



const styles = {
    root: {
      minHeight: "100vh",
      padding: "3rem",
      background: "#0f0f17",
      color: "#fff"
    },
    title: {
      marginBottom: "2rem"
    },
    carouselWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    },
    carousel: {
      display: "flex",
      gap: "1.5rem",
      overflowX: "auto",
      scrollBehavior: "smooth",
      padding: "1rem"
    },
    arrow: {
      background: "#1f1f2e",
      border: "none",
      color: "#fff",
      fontSize: "2rem",
      cursor: "pointer",
      padding: "0 1rem"
    },
    card: {
      minWidth: "240px",
      background: "#1a1a26",
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      transition: "0.3s"
    },
    poster: {
      width: "100%",
      height: "320px",
      objectFit: "cover"
    },
    cardInfo: {
      padding: "1rem"
    },
    actions: {
      marginTop: "1rem",
      display: "flex",
      gap: "0.5rem"
    },
    playBtn: {
      flex: 1,
      padding: "0.5rem",
      borderRadius: "6px",
      border: "none",
      background: "#c8a96e",
      cursor: "pointer"
    },
    removeBtn: {
      flex: 1,
      padding: "0.5rem",
      borderRadius: "6px",
      border: "none",
      background: "#e07070",
      cursor: "pointer"
    },

    ambientBg: {
        position: "fixed",
        inset: 0,
        background:
          "radial-gradient(ellipse 60% 50% at 30% 20%, #c8a96e0d 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 70%, #7b4b9e10 0%, transparent 50%)",
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
      nav: {
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 3rem",
        background: "rgba(8,8,16,0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(200,169,110,0.08)",
        gap: "1.5rem",
      },

    logoIcon: { color: "#c8a96e", fontSize: "1.2rem" },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.1rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#e8e4dc",
  },

  profileArea: { position: "relative", flexShrink: 0 },
  profileBtn: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "50px",
    padding: "0.4rem 1rem 0.4rem 0.4rem",
    cursor: "pointer",
    color: "#e8e4dc",
  },
  profileAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #c8a96e, #8c6e3a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },
  profileAvatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  profileInitial: { fontSize: "0.85rem", fontWeight: 600, color: "#080810" },
  profileName: {
    fontSize: "0.85rem",
    color: "#9e9a93",
    maxWidth: "120px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  playlistBtn: {
    textDecoration: "none",
    padding: "8px 18px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
    letterSpacing: "0.5px",
    color: "#1f1f1f",
    background: "linear-gradient(135deg, #f5c518, #e6b800)",
    transition: "all 0.25s ease",
    marginRight: "18px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
      
  dropdown: {
    position: "absolute",
    top: "calc(100% + 0.5rem)",
    right: 0,
    width: "220px",
    background: "#0f0f1a",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "14px",
    padding: "0.5rem",
    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
    zIndex: 200,
  },
  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem",
  },
  dropdownAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "rgba(200,169,110,0.1)",
    border: "1px solid rgba(200,169,110,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
  },
  dropdownName: { fontSize: "0.875rem", fontWeight: 500 },
  dropdownEmail: { fontSize: "0.72rem", color: "#5a5650" },
  dropdownDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.06)",
    margin: "0.25rem 0",
  },
  dropdownItem: {
    display: "block",
    width: "100%",
    textAlign: "left",
    background: "none",
    border: "none",
    color: "#9e9a93",
    padding: "0.65rem 0.75rem",
    fontSize: "0.85rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "0.02em",
  },


      footer: {
        position: "relative",
        zIndex: 2,
        padding: "2rem 3rem",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },


  };
  
  const globalStyles = `
  ::-webkit-scrollbar {
    height: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
  }

  @keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
  
}

.playlist-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
}
  `;