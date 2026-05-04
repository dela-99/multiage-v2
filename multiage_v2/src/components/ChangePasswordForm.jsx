import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { api } from "../lib/api";

function fieldStyle(theme) {
  return {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: `1px solid ${theme.inputBorder}`,
    background: theme.inputBg,
    color: theme.textPrimary,
    boxSizing: "border-box",
    fontFamily: "inherit",
    fontSize: 14,
  };
}

function EyeIcon({ visible }) {
  return visible ? (
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

function PasswordField({ label, autoComplete, value, onChange, visible, onToggle, theme }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: theme.textSecondary }}>{label}</span>
      <div style={{ position: "relative" }}>
        <input
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          style={{ ...fieldStyle(theme), paddingRight: 44 }}
          required
          minLength={autoComplete === "current-password" ? undefined : 6}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
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
          <EyeIcon visible={visible} />
        </button>
      </div>
    </label>
  );
}

/**
 * Logged-in password change (users and admins). Requires current password.
 */
export default function ChangePasswordForm({ token, onSuccess }) {
  const { t } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      setLoading(true);
      await api.changePassword({ currentPassword, newPassword }, token);
      setSuccess("Your password has been updated.");
      resetFields();
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Could not update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, maxWidth: 400 }}>
      {error && (
        <div style={{
          padding: "10px 12px",
          borderRadius: 10,
          background: "rgba(192,57,43,0.12)",
          color: "#c0392b",
          fontSize: 13,
          border: "1px solid rgba(192,57,43,0.24)",
        }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{
          padding: "10px 12px",
          borderRadius: 10,
          background: "rgba(39,174,96,0.12)",
          color: "#1e8449",
          fontSize: 13,
          border: "1px solid rgba(39,174,96,0.24)",
        }}>
          {success}
        </div>
      )}
      <PasswordField
        label="Current password"
        autoComplete="current-password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        visible={showCurrentPassword}
        onToggle={() => setShowCurrentPassword((value) => !value)}
        theme={t}
      />
      <PasswordField
        label="New password"
        autoComplete="new-password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        visible={showNewPassword}
        onToggle={() => setShowNewPassword((value) => !value)}
        theme={t}
      />
      <PasswordField
        label="Confirm new password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        visible={showConfirmPassword}
        onToggle={() => setShowConfirmPassword((value) => !value)}
        theme={t}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: 4,
          padding: "13px 24px",
          borderRadius: 12,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.75 : 1,
          background: "linear-gradient(135deg,#C5620B,#6A2B09)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          fontFamily: "inherit",
          boxShadow: "0 8px 28px rgba(197,98,11,0.35)",
        }}
      >
        {loading ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
