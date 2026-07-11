import { useTheme } from "../../context/ThemeContext";

function TrendArrow({ positive }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {positive ? (
        <path d="M7 17 17 7M9 7h8v8" />
      ) : (
        <path d="M7 7 17 17M15 17H7V9" />
      )}
    </svg>
  );
}

export default function DashboardCard({ title, subtitle, value, change, icon }) {
  const { t } = useTheme();
  const safeChange = Number.isFinite(Number(change)) ? Number(change) : 0;
  const positive = safeChange >= 0;

  return (
    <div style={{
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 22,
      padding: 22,
      minHeight: 150,
      display: "grid",
      gap: 18,
      backdropFilter: "blur(14px)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary, marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: 12, color: t.textMuted }}>{subtitle}</div>
        </div>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          background: "rgba(197,98,11,0.12)",
          border: "1px solid rgba(197,98,11,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#C5620B",
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "end" }}>
        <div style={{ fontSize: 30, fontWeight: 800, color: t.textPrimary, letterSpacing: -0.8 }}>
          {value}
        </div>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 10px",
          borderRadius: 999,
          background: positive ? "rgba(39,174,96,0.12)" : "rgba(192,57,43,0.12)",
          color: positive ? "#27ae60" : "#c0392b",
          fontSize: 12,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}>
          <TrendArrow positive={positive} />
          <span>{positive ? "+" : ""}{safeChange.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
