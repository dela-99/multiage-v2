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
      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary }}>Current password</span>
        <input
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          style={fieldStyle(t)}
          required
        />
      </label>
      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary }}>New password</span>
        <input
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={fieldStyle(t)}
          required
          minLength={6}
        />
      </label>
      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary }}>Confirm new password</span>
        <input
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={fieldStyle(t)}
          required
          minLength={6}
        />
      </label>
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
