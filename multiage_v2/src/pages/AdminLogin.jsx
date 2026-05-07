import { useState } from "react";
import { useNavigate } from "../router";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const ADMIN_ROLES = new Set(["admin", "ceo", "administrator", "cyber_it", "finance"]);

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
const ShieldIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

function FormInput({ type, placeholder, value, onChange, IconCmp, t }) {
  const [focused, setFocused] = useState(false);
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
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required
        style={{
          width: "100%", padding: "13px 16px 13px 42px",
          background: focused ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.10)",
          border: `1px solid ${focused ? "rgba(197,98,11,0.75)" : "rgba(255,255,255,0.14)"}`,
          borderRadius: 12, color: t.textPrimary,
          fontSize: 14, fontFamily: "inherit", outline: "none",
          transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
          boxSizing: "border-box",
          boxShadow: focused ? "0 0 0 4px rgba(197,98,11,0.12)" : "none",
        }}
      />
    </div>
  );
}

export default function AdminLogin() {
  const { t, bgGradient } = useTheme();
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login({ email, password });
      const normalizedRole = String(user.role || "").toLowerCase();
      if (!ADMIN_ROLES.has(normalizedRole)) {
        logout();
        setError("This account is not an admin account.");
        return;
      }
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Cannot connect to server. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(135deg, rgba(7,7,10,0.94), rgba(16,12,10,0.92)), ${bgGradient}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 20px", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url('/assets/logo-transparent.png')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "min(64vw, 760px)",
        opacity: 0.12,
        filter: "blur(0.5px) saturate(1.05)",
        transform: "scale(1.04)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at center, rgba(197,98,11,0.08), rgba(0,0,0,0.72) 62%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 560, height: 560, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(197,98,11,0.22) 0%,transparent 70%)",
        top: "-12%", right: "-8%", pointerEvents: "none", filter: "blur(60px)",
      }} />
      <div style={{
        position: "absolute", width: 380, height: 380, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(106,43,9,0.18) 0%,transparent 70%)",
        bottom: "-5%", left: "-5%", pointerEvents: "none", filter: "blur(60px)",
      }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <a href="/" onClick={e => { e.preventDefault(); navigate("/"); }}
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img
              src="/assets/logo-transparent.png" alt="Multiage"
              className="object-contain"
              onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
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
          <a href="/" onClick={e => { e.preventDefault(); navigate("/"); }}
            style={{ fontSize: 13, color: t.textMuted, textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = t.textPrimary}
            onMouseLeave={e => e.target.style.color = t.textMuted}>
            ← Back to site
          </a>
        </div>

        <div style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 28, padding: "36px 32px",
          backdropFilter: "blur(26px) saturate(145%)", WebkitBackdropFilter: "blur(26px) saturate(145%)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.16)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(145deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02) 42%, rgba(197,98,11,0.08) 100%)",
            pointerEvents: "none",
          }} />
          <div style={{ textAlign: "center", marginBottom: 26 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "5px 16px", borderRadius: 100, marginBottom: 14,
              background: "rgba(197,98,11,0.16)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(12px)",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C5620B", boxShadow: "0 0 6px #C5620B" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#C5620B", textTransform: "uppercase" }}>
                Admin Portal
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "clamp(22px,4vw,30px)", fontWeight: 800,
              color: t.textPrimary, letterSpacing: -0.5, marginBottom: 8,
            }}>
              Admin Sign In
            </h1>
            <p style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.6 }}>
              Access the Multiage admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14, position: "relative", zIndex: 1 }}>
            {error && (
              <div style={{
                padding: "10px", borderRadius: 8, background: "rgba(255,0,0,0.1)",
                color: "#ff4d4d", fontSize: 13, textAlign: "center", border: "1px solid rgba(255,0,0,0.2)"
              }}>
                {error}
              </div>
            )}
            <FormInput
              type="email" placeholder="Email address"
              value={email} onChange={e => setEmail(e.target.value)}
              IconCmp={PersonIcon} t={t}
            />
            <FormInput
              type="password" placeholder="Password"
              value={password} onChange={e => setPassword(e.target.value)}
              IconCmp={LockIcon} t={t}
            />
            <p style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.5, marginTop: -4, textAlign: "center" }}>
              After you sign in, use <strong style={{ color: t.textSecondary }}>Change password</strong> in the navigation bar or under Admin <strong style={{ color: t.textSecondary }}>Settings</strong>.
            </p>
            <button
              type="submit"
              style={{
                width: "100%", padding: "14px", marginTop: 4,
                background: "linear-gradient(135deg,#C5620B,#6A2B09)",
                border: "none", borderRadius: 12,
                color: "#fff", fontSize: 15, fontWeight: 700, opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 8px 28px rgba(197,98,11,0.35)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              disabled={loading}
              onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(197,98,11,0.52)"; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(197,98,11,0.38)"; }}
            >
              <ShieldIcon /> {loading ? "Signing in..." : "Sign in as Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
