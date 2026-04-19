import { useState } from "react";
import { useNavigate } from "../router";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const PersonIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const LockIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

function FormInput({ type, placeholder, value, onChange, IconCmp, theme }) {
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
        transition: "color 0.2s ease",
      }}>
        <IconCmp />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
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

export default function LoginPage() {
  const { t, bgGradient } = useTheme();
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login({ email, password });
      if (user.role !== "user") {
        logout();
        setError("This account is not a user account.");
        return;
      }
      navigate("/");
    } catch (err) {
      setError(err.message || "Cannot connect to server. Ensure backend is running.");
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
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        width: 520,
        height: 520,
        top: "-12%",
        right: "-10%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(197,98,11,0.18), transparent 62%)",
        filter: "blur(56px)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        width: 380,
        height: 380,
        bottom: "-10%",
        left: "-8%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(106,43,9,0.18), transparent 66%)",
        filter: "blur(50px)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 430, position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img
              src="/assets/logo.png"
              alt="Multiage"
              onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
              style={{ width: 38, height: 38, borderRadius: 10, objectFit: "contain", filter: "drop-shadow(0 0 6px rgba(197,98,11,0.35))" }}
            />
            <div style={{
              display: "none",
              width: 38,
              height: 38,
              borderRadius: 10,
              background: "linear-gradient(135deg,#C5620B,#6A2B09)",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
            }}>M</div>
            <span style={{ color: t.textPrimary, fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700 }}>
              Multiage <span style={{ color: "#C5620B" }}>Technologies</span>
            </span>
          </a>
        </div>

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
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              marginBottom: 14,
              background: "rgba(197,98,11,0.14)",
              border: "1px solid rgba(197,98,11,0.24)",
              color: "#C5620B",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: 1.6,
              textTransform: "uppercase",
            }}>
              Secure Login
            </div>

            <h1 style={{
              margin: 0,
              color: t.textPrimary,
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: -0.7,
            }}>
              Sign in
            </h1>

            <p style={{
              margin: "10px 0 0",
              color: t.textMuted,
              fontSize: 14,
              lineHeight: 1.7,
            }}>
              Access your account, track orders, and continue shopping.
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

            <FormInput
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              IconCmp={PersonIcon}
              theme={t}
            />

            <FormInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              IconCmp={LockIcon}
              theme={t}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -2 }}>
              <a href="#"
                style={{ color: "#C5620B", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
                Forgot password?
              </a>
            </div>

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
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div style={{ marginTop: 22, textAlign: "center" }}>
            <p style={{ margin: 0, color: t.textMuted, fontSize: 13, lineHeight: 1.7 }}>
              New customer?{" "}
              <a
                href="/register"
                onClick={(e) => { e.preventDefault(); navigate("/register"); }}
                style={{ color: "#C5620B", textDecoration: "none", fontWeight: 700 }}
              >
                Create your account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
