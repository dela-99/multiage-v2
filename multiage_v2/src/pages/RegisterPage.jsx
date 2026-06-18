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

const EyeIcon = ({ visible }) => (
  visible ? (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" />
      <path d="M10.58 10.58A2 2 0 0 0 13.42 13.42" />
      <path d="M9.88 5.09A9.77 9.77 0 0 1 12 4.91c5 0 9.27 3.11 11 7.09a11.82 11.82 0 0 1-4.18 5.23" />
      <path d="M6.61 6.61A11.81 11.81 0 0 0 1 12c1.73 3.98 6 7.09 11 7.09a9.77 9.77 0 0 0 4.09-.88" />
    </svg>
  ) : (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
);

function FormInput({ type, placeholder, value, onChange, IconCmp, t, visible, onToggle }) {
  const [focused, setFocused] = useState(false);
  const resolvedType = type === "password" && visible ? "text" : type;
  return (
    <div style={{ position: "relative" }}>
      <div style={{
        position: "absolute", left: 14, top: "50%",
        transform: "translateY(-50%)", pointerEvents: "none",
        color: focused ? "#C5620B" : t.textMuted,
        transition: "color 0.2s",
      }}>
        <IconCmp />
      </div>
      <input
        type={resolvedType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required
        style={{
          width: "100%", padding: `13px ${type === "password" ? "46px" : "16px"} 13px 42px`,
          background: t.inputBg,
          border: `1px solid ${focused ? "#C5620B" : t.inputBorder}`,
          borderRadius: 12, color: t.textPrimary,
          fontSize: 14, fontFamily: "inherit", outline: "none",
          transition: "border-color 0.2s, background 0.2s",
          boxSizing: "border-box",
        }}
      />
      {type === "password" && onToggle && (
        <button
          type="button"
          onClick={onToggle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label={visible ? "Hide password" : "Show password"}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            border: "none",
            background: "transparent",
            color: focused ? "#C5620B" : t.textMuted,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
            outline: "none",
            boxShadow: focused ? "0 0 0 4px rgba(197,98,11,0.18)" : "none",
            borderRadius: 8,
          }}
        >
          <EyeIcon visible={visible} />
        </button>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const { t, bgGradient } = useTheme();
  const navigate = useNavigate();
  const { register, logout } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const user = await register({ name, email, password });
      const normalizedRole = String(user.role || "").toLowerCase();
      if (normalizedRole !== "user") {
        logout();
        setError("This email is reserved for an administrator account. Contact support.");
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
      minHeight: "100vh", background: bgGradient,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 20px", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", width: 560, height: 560, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(197,98,11,0.14) 0%,transparent 70%)",
        top: "-12%", right: "-8%", pointerEvents: "none", filter: "blur(60px)",
      }} />
      <div style={{
        position: "absolute", width: 380, height: 380, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(106,43,9,0.11) 0%,transparent 70%)",
        bottom: "-5%", left: "-5%", pointerEvents: "none", filter: "blur(60px)",
      }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img
              src="/assets/logo-transparent.png" alt="Multiage"
              className="object-contain"
              onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
              style={{ width: 32, height: 32, borderRadius: 8,
                filter: "drop-shadow(0 0 4px rgba(197,98,11,0.35))" }}
            />
            <div style={{ display: "none", width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg,#C5620B,#6A2B09)",
              alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 14, color: "#fff" }}>M</div>
            <span style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontWeight: 700, fontSize: 16, color: t.textPrimary,
            }}>
              Multiage <span style={{ color: "#C5620B" }}>Technologies</span>
            </span>
          </a>

          <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}
            style={{ fontSize: 13, color: t.textMuted, textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => { e.target.style.color = t.textPrimary; }}
            onMouseLeave={(e) => { e.target.style.color = t.textMuted; }}>
            ← Back to site
          </a>
        </div>

        <div style={{
          background: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          borderRadius: 24, padding: "36px 32px",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
        }}>
          <div style={{ textAlign: "center", marginBottom: 26 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "5px 16px", borderRadius: 100, marginBottom: 14,
              background: "rgba(197,98,11,0.12)",
              border: "1px solid rgba(197,98,11,0.28)",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#C5620B", textTransform: "uppercase" }}>
                New account
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "clamp(22px,4vw,30px)", fontWeight: 800,
              color: t.textPrimary, letterSpacing: -0.5, marginBottom: 8,
            }}>
              Create your account
            </h1>
            <p style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.6 }}>
              Request services, track inquiries, and manage your password anytime.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {error && (
              <div style={{
                padding: "10px", borderRadius: 8, background: "rgba(255,0,0,0.1)",
                color: "#ff4d4d", fontSize: 13, textAlign: "center", border: "1px solid rgba(255,0,0,0.2)",
              }}>
                {error}
              </div>
            )}
            <FormInput
              type="text" placeholder="Full name"
              value={name} onChange={(e) => setName(e.target.value)}
              IconCmp={PersonIcon} t={t}
            />
            <FormInput
              type="email" placeholder="Email address"
              value={email} onChange={(e) => setEmail(e.target.value)}
              IconCmp={PersonIcon} t={t}
            />
            <FormInput
              type="password" placeholder="Password (min. 6 characters)"
              value={password} onChange={(e) => setPassword(e.target.value)}
              IconCmp={LockIcon} t={t}
              visible={showPassword}
              onToggle={() => setShowPassword((value) => !value)}
            />
            <FormInput
              type="password" placeholder="Confirm password"
              value={confirm} onChange={(e) => setConfirm(e.target.value)}
              IconCmp={LockIcon} t={t}
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((value) => !value)}
            />

            <button
              type="submit"
              style={{
                width: "100%", padding: "14px", marginTop: 4,
                background: "linear-gradient(135deg,#C5620B,#6A2B09)",
                border: "none", borderRadius: 12,
                color: "#fff", fontSize: 15, fontWeight: 700, opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 8px 28px rgba(197,98,11,0.38)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              disabled={loading}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(197,98,11,0.52)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(197,98,11,0.38)"; }}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0 16px" }}>
            <div style={{ flex: 1, height: 1, background: t.border }} />
            <span style={{ fontSize: 12, color: t.textMuted }}>or</span>
            <div style={{ flex: 1, height: 1, background: t.border }} />
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: t.textMuted }}>
            Already have an account?{" "}
            <a
              href="/login"
              onClick={(e) => { e.preventDefault(); navigate("/login"); }}
              style={{ color: "#C5620B", textDecoration: "none", fontWeight: 600 }}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
