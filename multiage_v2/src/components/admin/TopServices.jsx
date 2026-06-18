import { useTheme } from "../../context/ThemeContext";

export default function TopServices({ items, compact = false }) {
  const { t } = useTheme();

  return (
    <section style={{
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 28,
      padding: compact ? 20 : 26,
      backdropFilter: "blur(16px)",
    }}>
      <div style={{ marginBottom: compact ? 14 : 20 }}>
        <h2 style={{ margin: 0, fontSize: compact ? 22 : 28, fontWeight: 800, color: t.textPrimary, letterSpacing: -0.6 }}>
          Top Service Categories
        </h2>
        <div style={{ marginTop: 8, fontSize: 13, color: t.textMuted }}>
          Most requested services from contact and inquiry records
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{
          minHeight: compact ? 120 : 220,
          borderRadius: 22,
          border: `1px dashed ${t.border}`,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          color: t.textMuted,
          padding: 24,
        }}>
          No service activity yet. Categories will appear here when inquiries are received.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 18 }}>
          {items.map((item) => (
            <article key={item.name} style={{
              borderRadius: 22,
              padding: 16,
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${t.border}`,
              display: "grid",
              gap: 10,
            }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                display: "grid",
                placeItems: "center",
                background: "rgba(197,98,11,0.12)",
                color: "#C5620B",
                fontWeight: 800,
                fontSize: 18,
              }}>
                {item.count}
              </div>
              <div>
                <div style={{ color: t.textPrimary, fontWeight: 700, lineHeight: 1.5, marginBottom: 6 }}>{item.name}</div>
                <div style={{ color: "#C5620B", fontSize: 13, fontWeight: 700 }}>{item.count} request{item.count === 1 ? "" : "s"}</div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
