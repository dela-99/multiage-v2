import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import { BtnPrimary, SectionLabel, PageHeroHeading } from "../components/ui";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
export default function MyOrdersPage() {
  const { t } = useTheme();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const data = await api.getMyOrders(token);
        if (active) {
          setOrders(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Could not load orders.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [token]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingId(orderId);
      const updatedOrder = await api.cancelOrder(orderId, token);
      setOrders((current) => current.map((order) => (
        order._id === orderId ? updatedOrder : order
      )));
      setToast("Order cancelled successfully");
      setError("");
    } catch (err) {
      setError(err.message || "Could not cancel this order.");
    } finally {
      setCancellingId("");
    }
  };

  return (
    <PageLayout>
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px 100px" }}>
        <SectionLabel>Your purchases</SectionLabel>
        <PageHeroHeading style={{ marginBottom: 12 }}>
          My orders
        </PageHeroHeading>
        <p style={{ fontSize: 15, color: t.textSecondary, marginBottom: 28, lineHeight: 1.6 }}>
          Status updates appear here as your orders move through fulfillment.
        </p>

        {error && (
          <div style={{
            marginBottom: 20, padding: "12px 14px", borderRadius: 12,
            background: "rgba(192,57,43,0.12)", color: "#c0392b",
            border: "1px solid rgba(192,57,43,0.24)",
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <p style={{ color: t.textMuted }}>Loading your orders…</p>
        ) : orders.length === 0 ? (
          <div style={{
            padding: "32px 24px", borderRadius: 20,
            background: t.cardBg, border: `1px solid ${t.cardBorder}`,
            textAlign: "center",
          }}>
            <p style={{ color: t.textSecondary, marginBottom: 20 }}>You have not placed an order yet.</p>
            <BtnPrimary href="/store">Browse the store</BtnPrimary>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 18 }}>
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  padding: "22px 24px", borderRadius: 20,
                  background: t.cardBg, border: `1px solid ${t.cardBorder}`,
                }}
              >
                <div style={{
                  display: "flex", flexWrap: "wrap", justifyContent: "space-between",
                  gap: 12, marginBottom: 14, alignItems: "baseline",
                }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.2, color: "#C5620B", textTransform: "uppercase" }}>
                      Order
                    </span>
                    <div style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary, marginTop: 4 }}>
                      #{String(order._id).slice(-8).toUpperCase()}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, color: t.textMuted }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                    </div>
                    <div style={{
                      marginTop: 6, display: "inline-block",
                      padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700,
                      background: "rgba(197,98,11,0.12)", color: "#C5620B",
                      textTransform: "capitalize",
                    }}>
                      {order.status || "pending"}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 12, color: order.isPaid ? "#1e8449" : t.textMuted, fontWeight: 700 }}>
                      {order.isPaid ? "Payment confirmed" : `Payment: ${order.paymentStatus || "pending"}`}
                    </div>
                  </div>
                </div>
                <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
                  {(order.items || []).map((item) => (
                    <div
                      key={`${order._id}-${item.name}-${item.price}`}
                      style={{
                        display: "flex", justifyContent: "space-between", gap: 16,
                        fontSize: 14, color: t.textSecondary,
                      }}
                    >
                      <span>{item.name} × {item.quantity}</span>
                      <span style={{ fontWeight: 600, color: t.textPrimary }}>
                        GHS {(Number(item.price) * Number(item.quantity)).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontWeight: 800, fontSize: 16, color: t.textPrimary,
                  paddingTop: 12, borderTop: `1px solid ${t.border}`,
                }}>
                  <span>Total</span>
                  <span style={{ color: "#C5620B" }}>GHS {Number(order.totalPrice || 0).toLocaleString()}</span>
                </div>
                {order.paymentReference && (
                  <div style={{ marginTop: 12, fontSize: 13, color: t.textMuted }}>
                    Payment reference: {order.paymentReference}
                  </div>
                )}
                {order.status === "pending" && (
                  <div style={{ marginTop: 16 }}>
                    <button
                      type="button"
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingId === order._id}
                      style={{
                        padding: "10px 16px",
                        borderRadius: 12,
                        border: "1px solid rgba(192,57,43,0.28)",
                        background: "rgba(192,57,43,0.12)",
                        color: "#c0392b",
                        fontWeight: 700,
                        cursor: cancellingId === order._id ? "not-allowed" : "pointer",
                        opacity: cancellingId === order._id ? 0.65 : 1,
                        fontFamily: "inherit",
                      }}
                    >
                      {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 28 }}>
          <BtnPrimary href="/store">Back to store</BtnPrimary>
        </div>

        {toast && (
          <div style={{
            position: "fixed",
            right: 20,
            bottom: 20,
            zIndex: 2500,
            padding: "12px 16px",
            borderRadius: 14,
            background: "rgba(30,132,73,0.94)",
            color: "#fff",
            fontWeight: 700,
            boxShadow: "0 16px 40px rgba(0,0,0,0.24)",
          }}>
            {toast}
          </div>
        )}
      </section>
    </PageLayout>
  );
}
