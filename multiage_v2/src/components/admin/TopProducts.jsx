import { useTheme } from "../../context/ThemeContext";

export default function TopProducts({ items }) {
  const { t } = useTheme();

  return (
    <section style={{
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 28,
      padding: 26,
      backdropFilter: "blur(16px)",
    }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: t.textPrimary, letterSpacing: -0.6 }}>
          Top Selling Products
        </h2>
        <div style={{ marginTop: 8, fontSize: 13, color: t.textMuted }}>
          Products are rendered from real order volume only
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{
          minHeight: 220,
          borderRadius: 22,
          border: `1px dashed ${t.border}`,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          color: t.textMuted,
          padding: 24,
        }}>
          No top-selling products yet. Product cards will appear here when orders are available.
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
              gap: 14,
            }}>
              <div style={{
                aspectRatio: "1 / 1",
                borderRadius: 18,
                overflow: "hidden",
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${t.border}`,
                display: "grid",
                placeItems: "center",
              }}>
                {item.image ? (
                  <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ color: t.textMuted, fontSize: 12, fontWeight: 700 }}>No image</div>
                )}
              </div>
              <div>
                <div style={{ color: t.textPrimary, fontWeight: 700, lineHeight: 1.5, marginBottom: 6 }}>{item.name}</div>
                <div style={{ color: "#C5620B", fontSize: 13, fontWeight: 700 }}>{item.quantity} units sold</div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
