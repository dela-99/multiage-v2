import { useMemo, useState } from "react";
import { useNavigate } from "../router";
import { useTheme } from "../context/ThemeContext";
import { api } from "../lib/api";

function LockIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
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
  );
}

function evaluatePasswordStrength(password) {
  return {
    length: password.length >= 8,
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
}

function PasswordInput({ value, onChange, placeholder, visible, onToggle, theme }) {
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
        <LockIcon />
      </div>
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        required
        style={{
          width: "100%",
          padding: "14px 48px 14px 46px",
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
      <button
        type="button"
        onClick={onToggle}
        aria-label={visible ? "Hide password" : "Show password"}
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          border: "none",
          background: "transparent",
          color: theme.textMuted,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
        }}
      >
        <EyeIcon open={visible} />
      </button>
    </div>
  );
}

function StrengthRule({ ok, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, color: ok ? "#76d39a" : "rgba(255,255,255,0.6)", fontSize: 12 }}>
      <span style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: ok ? "#1e8449" : "rgba(255,255,255,0.18)",
        flexShrink: 0,
      }} />
      <span>{text}</span>
    </div>
  );
}

function StrengthMeter({ password }) {
  const checks = evaluatePasswordStrength(password);
  const passed = Object.values(checks).filter(Boolean).length;
  const barColor = passed === 3 ? "#1e8449" : passed === 2 ? "#C5620B" : "#c0392b";

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{
        height: 8,
        borderRadius: 999,
        background: "rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}>
        <div style={{
          width: `${(passed / 3) * 100}%`,
          height: "100%",
          borderRadius: 999,
          background: barColor,
          transition: "width 0.25s ease, background 0.25s ease",
        }} />
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        <StrengthRule ok={checks.length} text="At least 8 characters" />
        <StrengthRule ok={checks.number} text="Includes a number" />
        <StrengthRule ok={checks.symbol} text="Includes a symbol" />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const { t, bgGradient } = useTheme();
  const navigate = useNavigate();
  const token = useMemo(() => new URLSearchParams(window.location.search).get("token") || "", []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const checks = evaluatePasswordStrength(password);
  const passwordStrong = checks.length && checks.number && checks.symbol;
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const canSubmit = Boolean(token) && passwordStrong && passwordsMatch && !loading;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Reset link expired or invalid.");
      return;
    }

    if (!passwordStrong) {
      setError("Password too weak.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const result = await api.resetPassword({ token, password });
      setSuccess(result.message || "Password reset successfully.");
      setTimeout(() => navigate("/login"), 1600);
    } catch (err) {
      setError(err.message || "Reset link expired or invalid.");
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
      <div style={{ width: "100%", maxWidth: 450 }}>
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
            <h1 style={{ margin: 0, color: t.textPrimary, fontSize: 30, fontWeight: 800 }}>Reset password</h1>
            <p style={{ margin: "10px 0 0", color: t.textMuted, fontSize: 14, lineHeight: 1.7 }}>
              Create a strong new password for your account.
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

            <PasswordInput
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="New password"
              visible={showPassword}
              onToggle={() => setShowPassword((current) => !current)}
              theme={t}
            />

            <StrengthMeter password={password} />

            <PasswordInput
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((current) => !current)}
              theme={t}
            />

            {!passwordsMatch && confirmPassword && (
              <div style={{ color: "#ff7262", fontSize: 13, marginTop: -4 }}>
                Passwords do not match.
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                width: "100%",
                padding: "15px 18px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #C5620B, #6A2B09)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                cursor: canSubmit ? "pointer" : "not-allowed",
                opacity: canSubmit ? 1 : 0.55,
                boxShadow: "0 12px 28px rgba(197,98,11,0.28)",
                fontFamily: "inherit",
              }}
            >
              {loading ? "Updating password..." : "Reset password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
