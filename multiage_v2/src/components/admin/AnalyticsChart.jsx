import { useTheme } from "../../context/ThemeContext";

function SummaryMetric({ label, value, change }) {
  const { t } = useTheme();
  const safeChange = Number.isFinite(Number(change)) ? Number(change) : 0;
  const positive = safeChange >= 0;

  return (
    <div style={{
      padding: "8px 0",
      minWidth: 140,
      borderRight: `1px solid ${t.border}`,
    }}>
      <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: t.textPrimary }}>{value}</div>
        <div style={{
          padding: "4px 8px",
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 700,
          background: positive ? "rgba(39,174,96,0.12)" : "rgba(192,57,43,0.12)",
          color: positive ? "#27ae60" : "#c0392b",
        }}>
          {positive ? "+" : ""}{safeChange.toFixed(1)}%
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsChart({
  rangeDays = 30,
  onRangeChange = () => {},
  income = 0,
  expenses = 0,
  balance = 0,
  changes = {},
  hasChartData,
}) {
  const { t } = useTheme();
  const safeChanges = {
    income: Number.isFinite(Number(changes.income)) ? Number(changes.income) : 0,
    expenses: Number.isFinite(Number(changes.expenses)) ? Number(changes.expenses) : 0,
    balance: Number.isFinite(Number(changes.balance)) ? Number(changes.balance) : 0,
  };

  return (
    <section style={{
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 28,
      padding: 26,
      backdropFilter: "blur(16px)",
      display: "grid",
      gap: 24,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: t.textPrimary, letterSpacing: -0.6 }}>
            Service Analytics
          </h2>
          <div style={{ marginTop: 8, fontSize: 13, color: t.textMuted }}>
            Service pipeline overview for the selected window
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: t.textMuted }}>Sort by</span>
          <select
            value={rangeDays}
            onChange={(event) => onRangeChange(Number(event.target.value))}
            style={{
              padding: "11px 14px",
              borderRadius: 12,
              border: `1px solid ${t.inputBorder}`,
              background: t.inputBg,
              color: t.textPrimary,
              fontFamily: "inherit",
            }}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <SummaryMetric label="Service Requests" value={String(income)} change={safeChanges.income} />
        <SummaryMetric label="Pending Follow-ups" value={String(expenses)} change={safeChanges.expenses} />
        <div style={{ padding: "8px 0", minWidth: 140 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 8 }}>Completed Engagements</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: t.textPrimary }}>{String(balance)}</div>
            <div style={{
              padding: "4px 8px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              background: safeChanges.balance >= 0 ? "rgba(39,174,96,0.12)" : "rgba(192,57,43,0.12)",
              color: safeChanges.balance >= 0 ? "#27ae60" : "#c0392b",
            }}>
              {safeChanges.balance >= 0 ? "+" : ""}{safeChanges.balance.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div style={{
        minHeight: 280,
        borderRadius: 24,
        border: `1px dashed ${t.border}`,
        background: "linear-gradient(180deg, rgba(197,98,11,0.06), rgba(197,98,11,0.02))",
        padding: 22,
        display: "grid",
        alignItems: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary, marginBottom: 8 }}>
            Analytics chart container
          </div>
          <div style={{ maxWidth: 460, margin: "0 auto", fontSize: 13, lineHeight: 1.7, color: t.textMuted }}>
            {hasChartData
              ? "Service inquiry data is available and ready to plug into a chart component without changing the API layer."
              : "No service activity is available in the selected range yet. This container is ready for live CRM data."}
          </div>
        </div>
      </div>
    </section>
  );
}
