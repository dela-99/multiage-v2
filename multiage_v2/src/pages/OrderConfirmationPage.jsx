import PageLayout from "../components/PageLayout";
import { BtnPrimary, PageHeroHeading, SectionLabel } from "../components/ui";
import { useTheme } from "../context/ThemeContext";

export default function OrderConfirmationPage() {
  const { t } = useTheme();
  const order = JSON.parse(localStorage.getItem("multiage_last_order") || "null");

  return (
    <PageLayout>
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "80px 24px 100px" }}>
        <SectionLabel>Order Confirmed</SectionLabel>
        <PageHeroHeading style={{ marginBottom: 18 }}>
          Your order has been
          <span style={{
            display: "block",
            background: "linear-gradient(135deg,#C5620B,#e8892e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            received successfully.
          </span>
        </PageHeroHeading>
        <p style={{ fontSize: 16, color: t.textSecondary, maxWidth: 560, lineHeight: 1.7, marginBottom: 32 }}>
          {order?.isPaid
            ? "Your payment has been confirmed and your order is now queued for fulfillment."
            : "We have saved your order and our team will contact you shortly to confirm fulfillment details."}
        </p>

        <div style={{
          padding: "28px 32px",
          borderRadius: 24,
          background: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          marginBottom: 28,
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: t.textPrimary, marginBottom: 18 }}>Order Summary</h2>
          {order ? (
            <>
              <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
                {order.items?.map((item) => (
                  <div key={item.product || item._id} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 16,
                    paddingBottom: 12,
                    borderBottom: `1px solid ${t.border}`,
                  }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: t.textPrimary }}>{item.name}</div>
                      <div style={{ fontSize: 13, color: t.textMuted }}>Quantity: {item.quantity}</div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#C5620B" }}>
                      GHS {Number(item.price).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, color: t.textPrimary }}>
                <span>Total</span>
                <span>GHS {Number(order.totalPrice || 0).toLocaleString()}</span>
              </div>
              <div style={{ display: "grid", gap: 8, marginTop: 18, fontSize: 14, color: t.textSecondary }}>
                <div>
                  <strong style={{ color: t.textPrimary }}>Payment status:</strong>{" "}
                  <span style={{ color: order.isPaid ? "#1e8449" : "#C5620B", fontWeight: 700 }}>
                    {order.isPaid ? "Paid" : order.paymentStatus || "Pending"}
                  </span>
                </div>
                {order.paymentReference && (
                  <div>
                    <strong style={{ color: t.textPrimary }}>Reference:</strong> {order.paymentReference}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p style={{ color: t.textMuted }}>No recent order summary found yet.</p>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <BtnPrimary href="/my-orders">View my orders</BtnPrimary>
          <BtnPrimary href="/store">Back to Store</BtnPrimary>
        </div>
      </section>
    </PageLayout>
  );
}
