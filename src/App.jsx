import Dashboard from "./Dashboard";
const hotels = {
  "lueneburg-bergstroem": "Bergström Lüneburg",
  "norderney-bruns": "Inselhotel Bruns Norderney",
};

function HotelPage({ hotelId }) {
  const hotelName = hotels[hotelId] || "Otel";

  const handleClick = (buttonName) => {
    fetch("http://localhost:8000/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotel_id: hotelId,
        button_name: buttonName,
        timestamp: new Date().toISOString(),
      }),
    });
    alert(`${buttonName} Seçildi!`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.overlay}>
          <p style={styles.label}>HOŞGELDINIZ</p>
          <h1 style={styles.hotelName}>{hotelName}</h1>
          <div style={styles.divider}></div>
          <p style={styles.tagline}>Lüks, huzur ve unutulmaz anlar</p>
        </div>
      </div>
      <div style={styles.buttonSection}>
        {[
          { name: "Doğrudan Rezervasyon", desc: "En iyi fiyatla oda ayırtın" },
          { name: "Restoran", desc: "Gurme deneyimi için rezervasyon" },
          { name: "Spa", desc: "Kendinizi şımartın" },
          { name: "Değerlendirme Yaz", desc: "Deneyiminizi paylaşın" },
        ].map((btn) => (
          <button key={btn.name} style={styles.btn} onClick={() => handleClick(btn.name)}
            onMouseEnter={e => e.currentTarget.style.background = "#c9a96e"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={styles.btnIcon}>{btn.icon}</span>
            <div>
              <div style={styles.btnName}>{btn.name}</div>
              <div style={styles.btnDesc}>{btn.desc}</div>
            </div>
          </button>
        ))}
      </div>
      <p style={styles.footer}>© 2026 {hotelName} · retaha platform</p>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#0f0f0f", fontFamily: "'Georgia', serif", color: "white" },
  hero: {
    height: "40vh",
    background: "linear-gradient(135deg, #1a1208 0%, #3d2b1f 40%, #1a1208 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    borderBottom: "1px solid #c9a96e",
    position: "relative",
  },
  overlay: { textAlign: "center", padding: "2rem" },
  label: { fontSize: "0.75rem", letterSpacing: "4px", color: "#c9a96e", margin: "0 0 0.5rem" },
  hotelName: { fontSize: "2.2rem", fontWeight: "normal", margin: "0 0 1rem", color: "#f5f0e8" },
  divider: { width: "60px", height: "1px", background: "#c9a96e", margin: "0 auto 1rem" },
  tagline: { fontSize: "0.9rem", color: "#999", margin: 0, fontStyle: "italic" },
  buttonSection: { padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.8rem", maxWidth: "480px", margin: "0 auto" },
  btn: {
  display: "flex", alignItems: "center", gap: "1rem",
  padding: "1.2rem 1.5rem", border: "1px solid #c9a96e",
  borderRadius: "4px", background: "transparent", color: "#f5f0e8",
  cursor: "pointer", textAlign: "left", transition: "background 0.3s",
  width: "100%",
  whiteSpace: "normal",
  wordBreak: "break-word",
},
  btnIcon: { fontSize: "1.5rem", minWidth: "2rem" },
  btnName: { fontSize: "1rem", fontWeight: "bold", marginBottom: "0.2rem", color: "#f5f0e8" },
  btnDesc: { fontSize: "0.8rem", color: "#999" },
  footer: { textAlign: "center", padding: "2rem", fontSize: "0.75rem", color: "#555", borderTop: "1px solid #222" },
};

export default function App() {
  const path = window.location.pathname;
  if (path.startsWith("/dashboard/")) {
    const hotelId = path.split("/dashboard/")[1];
    return <Dashboard hotelId={hotelId} />;
  }
  const hotelId = path.split("/hotels/")[1] || "lueneburg-bergstroem";
  return <HotelPage hotelId={hotelId} />;
}