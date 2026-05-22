import { useState } from "react";
import { icons } from "../constants";
import { Icon, SectionLabel, SectionHeading } from "./ui";
import { useTheme } from "../context/ThemeContext";
import { api } from "../lib/api";

const SERVICES_OPTIONS = [
  "Website Development","Mobile App Development",
  "Networking Setup","Creative Studio Services","IT Consulting",
];

const QUICK_ACTIONS = [
  { label: "WhatsApp Us",         icon: "whatsapp", bg: "#25D366" },
  { label: "Request a Service",   icon: "zap",      bg: "#C5620B" },
  { label: "Book a Consultation", icon: "users",    bg: "#6A2B09" },
];

export default function ContactSection() {
  const { t } = useTheme();
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const upd = f => e => setForm(p => ({ ...p, [f]: e.target.value }));
  const phoneRegex = /^\+?[0-9\s\-()]+$/;

  const inputStyle = {
    width: "100%", padding: "12px 16px",
    background: t.inputBg, border: `1px solid ${t.inputBorder}`,
    borderRadius: 12, color: t.textPrimary, fontSize: 14,
    outline: "none", boxSizing: "border-box",
  };

  const submit = async () => {
    if (!form.name || !form.email || !form.phone || !form.message) {
      setError("Name, email, phone number, and message are required.");
      return;
    }

    if (!phoneRegex.test(form.phone)) {
      setError("Enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.sendMessage({ ...form, kind: "contact", source: "home-contact-section" });
      setSent(true);
      setTimeout(() => setSent(false), 4000);
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (err) {
      setError(err.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" style={{ padding: "100px 0" }}>
      <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="grid-responsive">
          <div>
            <SectionLabel>Get In Touch</SectionLabel>
            <SectionHeading style={{ fontSize: "clamp(28px,3.5vw,48px)", lineHeight: 1.1, marginBottom: 20 }}>
              Let's build something great together
            </SectionHeading>
            <p style={{ fontSize: 15, color: t.textSecondary, lineHeight: 1.8, marginBottom: 40 }}>
              Whether you're looking for premium devices, need a website built, or want to set up a professional network — we've got you covered.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {QUICK_ACTIONS.map(btn => (
                <button key={btn.label} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "14px 20px",
                  background: t.surface, border: `1px solid ${t.border}`,
                  borderRadius: 14, cursor: "pointer", color: t.textPrimary,
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(197,98,11,0.4)"; e.currentTarget.style.background = "rgba(197,98,11,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = t.surface; }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: btn.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff" }}>
                    <Icon d={icons[btn.icon]} size={17} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{
            padding: "36px 32px", background: t.cardBg,
            border: `1px solid ${t.cardBorder}`, borderRadius: 24, backdropFilter: "blur(16px)",
          }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: t.textPrimary, marginBottom: 8 }}>Message Sent!</h3>
                <p style={{ color: t.textMuted, fontSize: 14 }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: t.textPrimary, marginBottom: 8 }}>Send us a message</h3>
                {error && (
                  <div style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "rgba(192,57,43,0.12)",
                    color: "#c0392b",
                    border: "1px solid rgba(192,57,43,0.24)",
                    fontSize: 13,
                  }}>
                    {error}
                  </div>
                )}
                <input placeholder="Your Name" style={inputStyle} value={form.name} onChange={upd("name")} />
                <input placeholder="Email Address" type="email" style={inputStyle} value={form.email} onChange={upd("email")} />
                <input placeholder="Phone Number" type="tel" style={inputStyle} value={form.phone} onChange={upd("phone")} />
                <select style={{ ...inputStyle, appearance: "none" }} value={form.service} onChange={upd("service")}>
                  <option value="">Service Needed</option>
                  {SERVICES_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <textarea placeholder="Your message..." rows={4} style={{ ...inputStyle, resize: "vertical" }} value={form.message} onChange={upd("message")} />
                <button onClick={submit} disabled={loading} style={{
                  padding: "14px 24px", background: "linear-gradient(135deg,#C5620B,#6A2B09)",
                  border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 8, boxShadow: "0 8px 24px rgba(197,98,11,0.35)", transition: "transform 0.2s",
                  opacity: loading ? 0.72 : 1,
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                  <Icon d={icons.send} size={16} /> {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
