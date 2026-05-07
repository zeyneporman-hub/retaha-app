import { useState, useEffect } from "react";

const hotels = {
  "lueneburg-bergstroem": "Bergström Lüneburg",
  "norderney-bruns": "Inselhotel Bruns Norderney",
};

export default function Dashboard({ hotelId }) {
  const [stats, setStats] = useState([]);
  const [period, setPeriod] = useState("all");
  const hotelName = hotels[hotelId] || hotelId;

  useEffect(() => {
    fetch(`https://retaha-app.onrender.com/stats/${hotelId}/filter?period=${period}`)
      .then((r) => r.json())
      .then((data) => setStats(data.stats || []));
  }, [hotelId, period]);

  const total = stats.reduce((sum, s) => sum + s.count, 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <p style={styles.label}>KONTROL PANELİ</p>
        <h1 style={styles.title}>{hotelName}</h1>
        <div style={styles.divider}></div>
      </div>

      <div style={styles.filterRow}>
        {["all", "today", "week", "month"].map((p) => (
          <button
            key={p}
            style={{ ...styles.filterBtn, ...(period === p ? styles.filterActive : {}) }}
            onClick={() => setPeriod(p)}
          >
            {p === "all" ? "Tümü" : p === "today" ? "Bugün" : p === "week" ? "Bu Hafta" : "Bu Ay"}
          </button>
        ))}
      </div>

      <div style={styles.totalCard}>
        <p style={styles.totalLabel}>Toplam Tıklama</p>
        <p style={styles.totalNumber}>{total}</p>
      </div>

      <div style={styles.grid}>
        {stats.length === 0 ? (
          <p style={styles.empty}>Henüz veri yok.</p>
        ) : (
          stats.map((s) => (
            <div key={s.button} style={styles.card}>
              <p style={styles.cardName}>{s.button}</p>
              <p style={styles.cardCount}>{s.count}</p>
              <p style={styles.cardLabel}>tıklama</p>
              <div style={styles.bar}>
                <div style={{ ...styles.barFill, width: `${Math.round((s.count / total) * 100)}%` }}></div>
              </div>
              <p style={styles.percent}>{Math.round((s.count / total) * 100)}%</p>
            </div>
          ))
        )}
      </div>

      <p style={styles.footer}>© 2026 retaha platform</p>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#0f0f0f", fontFamily: "Georgia, serif", color: "white", padding: "2rem 1rem" },
  header: { textAlign: "center", marginBottom: "2rem" },
  label: { fontSize: "0.75rem", letterSpacing: "4px", color: "#c9a96e", margin: "0 0 0.5rem" },
  title: { fontSize: "2rem", fontWeight: "normal", color: "#f5f0e8", margin: "0 0 1rem" },
  divider: { width: "60px", height: "1px", background: "#c9a96e", margin: "0 auto" },
  filterRow: { display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "2rem", flexWrap: "wrap" },
  filterBtn: { padding: "0.5rem 1.2rem", border: "1px solid #555", borderRadius: "20px", background: "transparent", color: "#999", cursor: "pointer", fontSize: "0.85rem" },
  filterActive: { border: "1px solid #c9a96e", color: "#c9a96e" },
  totalCard: { textAlign: "center", marginBottom: "2rem", padding: "1.5rem", border: "1px solid #c9a96e", borderRadius: "8px", maxWidth: "300px", margin: "0 auto 2rem" },
  totalLabel: { fontSize: "0.8rem", color: "#999", letterSpacing: "2px", margin: "0 0 0.5rem" },
  totalNumber: { fontSize: "3rem", color: "#c9a96e", margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", maxWidth: "900px", margin: "0 auto" },
  card: { background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", padding: "1.5rem", textAlign: "center" },
  cardIcon: { fontSize: "2rem" },
  cardName: { fontSize: "0.9rem", color: "#999", margin: "0.5rem 0" },
  cardCount: { fontSize: "2.5rem", color: "#f5f0e8", margin: "0.5rem 0 0" },
  cardLabel: { fontSize: "0.75rem", color: "#555", margin: "0 0 1rem" },
  bar: { background: "#333", borderRadius: "4px", height: "4px", margin: "0.5rem 0" },
  barFill: { background: "#c9a96e", height: "100%", borderRadius: "4px", transition: "width 0.5s" },
  percent: { fontSize: "0.8rem", color: "#c9a96e", margin: 0 },
  empty: { color: "#555", textAlign: "center", gridColumn: "1/-1" },
  footer: { textAlign: "center", padding: "2rem", fontSize: "0.75rem", color: "#555", marginTop: "2rem", borderTop: "1px solid #222" },
};