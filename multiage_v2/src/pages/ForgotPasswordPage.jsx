import { useState } from "react";
import { useNavigate } from "../router";
import { useTheme } from "../context/ThemeContext";
import { api } from "../lib/api";

function MailIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function EmailInput({ value, onChange, theme }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <div style={{
        position: "absolute",
        left: 16,
        top: "50%",
        transform: "translateY(-50%)",
        color: focused ? "#C5620B" : theme.textMuted,
        pointerEvents: "none",
      }}>
        <MailIcon />
      </div>
      <input
        type="email"
        aria-label="Email address"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Email address"
        required
        style={{
          width: "100%",
          padding: "14px 16px 14px 46px",
          borderRadius: 14,
          border: `1px solid ${focused ? "rgba(197,98,11,0.7)" : theme.inputBorder}`,
          background: focused ? "rgba(255,255,255,0.12)" : theme.inputBg,
          color: theme.textPrimary,
          outline: "none",
          fontSize: 14,
          fontFamily: "inherit",
          boxSizing: "border-box",
          boxShadow: focused ? "0 0 0 4px rgba(197,98,11,0.10)" : "none",
          transition: "all 0.2s ease",
        }}
      />
    </div>
  );
}

export default function ForgotPasswordPage() {
  const { t, bgGradient } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.forgotPassword({ email });
      setSuccess("If an account exists for this email, you will receive a reset link shortly.");
    } catch (err) {
      setError(err.message || "Could not send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, rgba(10,10,12,0.80), rgba(27,16,10,0.72)), ${bgGradient}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "28px 18px",
    }}>
      <div style={{ width: "100%", maxWidth: 430 }}>
        <div style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.08))",
          border: "1px solid rgba(255,255,255,0.16)",
          borderRadius: 26,
          padding: "34px 28px",
          backdropFilter: "blur(24px) saturate(140%)",
          WebkitBackdropFilter: "blur(24px) saturate(140%)",
          boxShadow: "0 24px 72px rgba(0,0,0,0.26), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h1 style={{ margin: 0, color: t.textPrimary, fontSize: 30, fontWeight: 800 }}>Forgot password?</h1>
            <p style={{ margin: "10px 0 0", color: t.textMuted, fontSize: 14, lineHeight: 1.7 }}>
              Enter your email and we’ll send you a secure reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
            {error && (
              <div style={{
                padding: "12px 14px",
                borderRadius: 14,
                background: "rgba(192,57,43,0.12)",
                color: "#ff7262",
                border: "1px solid rgba(192,57,43,0.24)",
                fontSize: 13,
                textAlign: "center",
              }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{
                padding: "12px 14px",
                borderRadius: 14,
                background: "rgba(30,132,73,0.12)",
                color: "#76d39a",
                border: "1px solid rgba(30,132,73,0.24)",
                fontSize: 13,
                textAlign: "center",
              }}>
                {success}
              </div>
            )}

            <EmailInput
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              theme={t}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "15px 18px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #C5620B, #6A2B09)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.72 : 1,
                boxShadow: "0 12px 28px rgba(197,98,11,0.28)",
                fontFamily: "inherit",
              }}
            >
              {loading ? "Sending reset link..." : "Send Reset Link"}
            </button>
          </form>

          <div style={{ marginTop: 22, textAlign: "center" }}>
            <a
              href="/login"
              onClick={(event) => { event.preventDefault(); navigate("/login"); }}
              style={{ color: "#C5620B", textDecoration: "none", fontWeight: 700, fontSize: 13 }}
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
