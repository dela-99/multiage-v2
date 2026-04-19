import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import { PageHeroHeading, SectionLabel, BtnPrimary } from "../components/ui";
import { useTheme } from "../context/ThemeContext";
import { api } from "../lib/api";
import { useNavigate } from "../router";

export default function PaymentCallbackPage() {
  const { t } = useTheme();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("We are confirming your payment with Paystack.");

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference");

    async function verify() {
      if (!reference) {
        if (active) {
          setStatus("error");
          setMessage("Payment reference is missing from the callback URL.");
        }
        return;
      }

      try {
        const result = await api.verifyPayment(reference);
        if (!active) {
          return;
        }

        if (result.order) {
          localStorage.setItem("multiage_last_order", JSON.stringify(result.order));
          localStorage.removeItem("multiage_pending_order");
        }

        setStatus(result.status === "success" ? "success" : "pending");
        setMessage(
          result.status === "success"
            ? "Payment confirmed successfully. Redirecting to your order confirmation."
            : `Payment status: ${result.status || "pending"}.`
        );

        if (result.status === "success") {
          setTimeout(() => navigate("/order-confirmation"), 1200);
        }
      } catch (err) {
        if (active) {
          setStatus("error");
          setMessage(err.message || "We could not verify the payment right now.");
        }
      }
    }

    verify();
    return () => { active = false; };
  }, [navigate]);

  return (
    <PageLayout>
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "88px 24px 100px" }}>
        <SectionLabel>Payment Update</SectionLabel>
        <PageHeroHeading style={{ marginBottom: 16 }}>
          {status === "success" ? "Payment confirmed." : status === "error" ? "Payment check failed." : "Verifying payment."}
        </PageHeroHeading>
        <p style={{ fontSize: 16, color: t.textSecondary, lineHeight: 1.7, maxWidth: 560, marginBottom: 30 }}>
          {message}
        </p>

        <div style={{
          padding: "28px 30px",
          borderRadius: 24,
          background: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          marginBottom: 24,
        }}>
          <div style={{
            display: "inline-flex",
            padding: "6px 14px",
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 13,
            color: status === "success" ? "#1e8449" : status === "error" ? "#c0392b" : "#C5620B",
            background: status === "success"
              ? "rgba(30,132,73,0.12)"
              : status === "error"
                ? "rgba(192,57,43,0.12)"
                : "rgba(197,98,11,0.12)",
          }}>
            {status === "success" ? "Paid" : status === "error" ? "Attention needed" : "In progress"}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <BtnPrimary href="/my-orders">View my orders</BtnPrimary>
          <BtnPrimary href="/store">Back to store</BtnPrimary>
        </div>
      </section>
    </PageLayout>
  );
}
