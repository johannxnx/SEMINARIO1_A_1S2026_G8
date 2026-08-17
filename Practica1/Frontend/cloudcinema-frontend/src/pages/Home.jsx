import { Link } from "react-router-dom";

const featuredMovies = [
  {
    title: "Dune: Part Two",
    genre: "Sci-Fi",
    rating: "8.9",
    year: "2024",
    color: "#c8a96e",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80&fit=crop",
  },
  {
    title: "Oppenheimer",
    genre: "Drama",
    rating: "8.4",
    year: "2023",
    color: "#e07b39",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80&fit=crop",
  },
  {
    title: "Poor Things",
    genre: "Fantasy",
    rating: "8.0",
    year: "2023",
    color: "#7eb8c9",
    img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80&fit=crop",
  },
  {
    title: "The Brutalist",
    genre: "Drama",
    rating: "7.9",
    year: "2024",
    color: "#a89b8c",
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80&fit=crop",
  },
];

export default function Home() {
  return (
    <div style={styles.root}>
      <style>{globalStyles}</style>

      {/* Ambient background */}
      <div style={styles.ambientBg} />
      <div style={styles.grain} />

      {/* Hero BG image */}
      <div style={styles.heroBgImage} />

      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>◈</span>
          <span style={styles.logoText}>CLOUD<em>CINEMA</em></span>
        </div>
        <div style={styles.navLinks}>
          <Link to="/login" style={styles.navLinkGhost}>Iniciar Sesión</Link>
          <Link to="/register" style={styles.btnPrimary}>Registrarse</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.heroLabel}>✦ Streaming Premium</p>
          <h1 style={styles.heroTitle}>
            El cine del mundo,<br />
            <span style={styles.heroAccent}>en tus manos.</span>
          </h1>
          <p style={styles.heroSub}>
            Miles de películas y series. Sin interrupciones. Sin límites.
          </p>
          <div style={styles.heroCtas}>
            <Link to="/register" style={styles.ctaPrimary}>
              Registrarse
              <span style={styles.ctaArrow}>→</span>
            </Link>
            <Link to="/login" style={styles.ctaSecondary}>
              Iniciar Sesión
            </Link>
          </div>
        </div>

        {/* Floating cards */}
        <div style={styles.cardGrid}>
          {featuredMovies.map((movie, i) => (
            <div
              key={movie.title}
              className="movie-card"
              style={{
                ...styles.card,
                animationDelay: `${i * 0.15}s`,
                "--accent": movie.color,
              }}
            >
              <div style={styles.cardPoster}>
                <img
                  src={movie.img}
                  alt={movie.title}
                  style={styles.cardImg}
                />
                {/* Color overlay */}
                <div style={{ ...styles.cardOverlay, background: `linear-gradient(to top, ${movie.color}cc 0%, transparent 60%)` }} />
                <span style={styles.cardRating}>★ {movie.rating}</span>
              </div>
              <div style={styles.cardInfo}>
                <p style={styles.cardTitle}>{movie.title}</p>
                <p style={styles.cardMeta}>{movie.genre} · {movie.year}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={styles.stats}>
        {[
          { num: "10+", label: "Películas" },
          { num: "720", label: "Calidad buena" },
          { num: "10+", label: "Géneros" },
          { num: "∞", label: "Horas de entretenimiento" },
        ].map((s) => (
          <div key={s.label} style={styles.statItem}>
            <span style={styles.statNum}>{s.num}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* CTA BOTTOM */}
      <section style={styles.ctaSection}>
        {/* Background cinematic image for CTA */}
        <div style={styles.ctaBgWrap}>
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80&fit=crop"
            alt=""
            style={styles.ctaBgImg}
          />
          <div style={styles.ctaBgOverlay} />
        </div>
        <div style={styles.ctaBox}>
          <span style={styles.ctaOrna}>◈</span>
          <h2 style={styles.ctaTitle}>¿Listo para empezar?</h2>
          <p style={styles.ctaDesc}>Únete a millones de cinéfilos y descubre el cine que el mundo tiene para ti.</p>
          <div style={styles.heroCtas}>
            <Link to="/register" style={styles.ctaPrimary}>Registrarse →</Link>
            <Link to="/login" style={styles.ctaSecondary}>Iniciar Sesión</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span style={styles.logoText}>CLOUD<em>CINEMA</em></span>
        <p style={styles.footerNote}>© 2026 CloudCinema · Todos los derechos reservados</p>
        <div style={styles.footerLinks}>
          <a href="#" style={styles.footerLink}>Privacidad</a>
          <a href="#" style={styles.footerLink}>Términos</a>
          <a href="#" style={styles.footerLink}>Contacto</a>
        </div>
      </footer>
    </div>
  );
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .movie-card {
    animation: floatIn 0.6s ease forwards;
    opacity: 0;
    transform: translateY(20px);
  }
  .movie-card:hover {
    transform: translateY(-8px) scale(1.03) !important;
    box-shadow: 0 20px 60px var(--accent, #fff)33 !important;
  }
  .movie-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }

  .genre-btn:hover {
    background: rgba(200,169,110,0.15) !important;
    border-color: #c8a96e !important;
    color: #c8a96e !important;
    transform: translateY(-2px);
  }
  .genre-btn { transition: all 0.2s ease; }

  @keyframes floatIn {
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.05); }
  }
`;

const styles = {
  root: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#080810",
    color: "#e8e4dc",
    minHeight: "100vh",
    overflowX: "hidden",
    position: "relative",
  },
  ambientBg: {
    position: "fixed",
    top: "-30%",
    left: "-20%",
    width: "140%",
    height: "140%",
    background: "radial-gradient(ellipse 60% 50% at 70% 30%, #c8a96e14 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 20% 80%, #7b4b9e18 0%, transparent 50%)",
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

  // HERO BG
  heroBgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100vh",
    backgroundImage: "url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1800&q=80&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center 30%",
    opacity: 0.08,
    zIndex: 0,
    pointerEvents: "none",
  },

  // NAV
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1.2rem 4rem",
    background: "rgba(8,8,16,0.85)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(200,169,110,0.1)",
  },
  logo: { display: "flex", alignItems: "center", gap: "0.5rem" },
  logoIcon: { color: "#c8a96e", fontSize: "1.4rem" },
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.2rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    color: "#e8e4dc",
  },
  navLinks: { display: "flex", alignItems: "center", gap: "2rem" },
  navLink: {
    color: "#9e9a93",
    textDecoration: "none",
    fontSize: "0.875rem",
    letterSpacing: "0.04em",
    transition: "color 0.2s",
  },
  navLinkGhost: {
    color: "#e8e4dc",
    textDecoration: "none",
    fontSize: "0.875rem",
    letterSpacing: "0.04em",
    padding: "0.4rem 1rem",
    border: "1px solid rgba(232,228,220,0.2)",
    borderRadius: "4px",
  },
  btnPrimary: {
    background: "#c8a96e",
    color: "#080810",
    padding: "0.5rem 1.25rem",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "0.875rem",
    letterSpacing: "0.04em",
  },

  // HERO
  hero: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6rem 4rem 4rem",
    minHeight: "88vh",
    gap: "3rem",
  },
  heroContent: { flex: 1, maxWidth: "560px" },
  heroLabel: {
    fontSize: "0.8rem",
    letterSpacing: "0.15em",
    color: "#c8a96e",
    textTransform: "uppercase",
    marginBottom: "1.5rem",
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
    lineHeight: 1.1,
    fontWeight: 700,
    marginBottom: "1.5rem",
  },
  heroAccent: { color: "#c8a96e", fontStyle: "italic" },
  heroSub: {
    fontSize: "1.1rem",
    color: "#9e9a93",
    lineHeight: 1.7,
    marginBottom: "2.5rem",
    fontWeight: 300,
  },
  heroCtas: { display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" },
  ctaPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "#c8a96e",
    color: "#080810",
    padding: "0.85rem 2rem",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "0.95rem",
    letterSpacing: "0.03em",
  },
  ctaArrow: { fontSize: "1.1rem" },
  ctaSecondary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#e8e4dc",
    textDecoration: "none",
    fontSize: "0.95rem",
    padding: "0.85rem 1.5rem",
    border: "1px solid rgba(232,228,220,0.2)",
    borderRadius: "4px",
  },

  // CARDS
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 160px)",
    gap: "1rem",
    flex: "0 0 auto",
  },
  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "10px",
    overflow: "hidden",
    cursor: "pointer",
  },
  cardPoster: {
    height: "120px",
    position: "relative",
    overflow: "hidden",
  },
  cardImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  cardOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
  },
  cardGlow: {
    position: "absolute",
    top: "30%",
    left: "30%",
    width: "40%",
    height: "40%",
    borderRadius: "50%",
    filter: "blur(20px)",
    opacity: 0.4,
    zIndex: 0,
  },
  cardRating: {
    position: "absolute",
    bottom: "6px",
    left: "8px",
    zIndex: 2,
    fontSize: "0.72rem",
    color: "#fff",
    background: "rgba(0,0,0,0.55)",
    padding: "2px 6px",
    borderRadius: "3px",
    backdropFilter: "blur(4px)",
  },
  cardInfo: { padding: "0.6rem 0.75rem 0.75rem" },
  cardTitle: { fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.2rem" },
  cardMeta: { fontSize: "0.7rem", color: "#5a5650" },

  // STATS
  stats: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
    gap: "4rem",
    padding: "2.5rem 4rem",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(255,255,255,0.02)",
    flexWrap: "wrap",
  },
  statItem: { textAlign: "center" },
  statNum: {
    display: "block",
    fontFamily: "'Playfair Display', serif",
    fontSize: "2rem",
    color: "#c8a96e",
    fontWeight: 700,
  },
  statLabel: { fontSize: "0.78rem", color: "#5a5650", letterSpacing: "0.08em", textTransform: "uppercase" },

  // SECTION
  section: {
    position: "relative",
    zIndex: 2,
    padding: "5rem 4rem",
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2rem",
    marginBottom: "2rem",
    color: "#e8e4dc",
  },
  genreGrid: { display: "flex", flexWrap: "wrap", gap: "0.75rem" },
  genreBtn: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#9e9a93",
    padding: "0.6rem 1.4rem",
    borderRadius: "50px",
    cursor: "pointer",
    fontSize: "0.875rem",
    letterSpacing: "0.04em",
  },

  // CTA SECTION
  ctaSection: {
    position: "relative",
    zIndex: 2,
    padding: "5rem 4rem",
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
  },
  ctaBgWrap: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
  },
  ctaBgImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    opacity: 0.18,
  },
  ctaBgOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to bottom, #080810 0%, transparent 40%, #080810 100%)",
  },
  ctaBox: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    maxWidth: "600px",
    padding: "4rem",
    background: "rgba(200,169,110,0.05)",
    border: "1px solid rgba(200,169,110,0.15)",
    borderRadius: "16px",
    backdropFilter: "blur(8px)",
  },
  ctaOrna: {
    display: "block",
    fontSize: "1.8rem",
    color: "#c8a96e",
    marginBottom: "1.25rem",
    opacity: 0.7,
  },
  ctaTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2.2rem",
    marginBottom: "1rem",
  },
  ctaDesc: { color: "#9e9a93", marginBottom: "2rem", lineHeight: 1.7 },

  // FOOTER
  footer: {
    position: "relative",
    zIndex: 2,
    padding: "2rem 4rem",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
  },
  footerNote: { fontSize: "0.78rem", color: "#3a3630" },
  footerLinks: { display: "flex", gap: "1.5rem" },
  footerLink: { color: "#5a5650", fontSize: "0.78rem", textDecoration: "none" },
};