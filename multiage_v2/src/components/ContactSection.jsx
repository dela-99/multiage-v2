import { useState } from "react";
import { icons } from "../constants";
import { Icon, SectionLabel, SectionHeading } from "./ui";
import { useTheme } from "../context/ThemeContext";

const SERVICES_OPTIONS = [
  "Electronics / Device Purchase","Website Development","Mobile App Development",
  "Networking Setup","Creative Studio Services","IT Consulting",
];

const QUICK_ACTIONS = [
  { label: "WhatsApp Us",         icon: "whatsapp", bg: "#25D366" },
  { label: "Request a Service",   icon: "zap",      bg: "#C5620B" },
  { label: "Book a Consultation", icon: "users",    bg: "#6A2B09" },
];

export default function ContactSection() {
  const { t, isLight } = useTheme();
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const upd = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const inputStyle = {
    width: "100%", padding: "12px 16px",
    background: t.inputBg, border: `1px solid ${t.inputBorder}`,
    borderRadius: 12, color: t.textPrimary, fontSize: 14,
    outline: "none", boxSizing: "border-box",
  };

  const submit = () => {
    if (!form.name || !form.email) return;
    setSent(true); setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", service: "", message: "" });
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
                <input placeholder="Your Name" style={inputStyle} value={form.name} onChange={upd("name")} />
                <input placeholder="Email Address" type="email" style={inputStyle} value={form.email} onChange={upd("email")} />
                <select style={{ ...inputStyle, appearance: "none" }} value={form.service} onChange={upd("service")}>
                  <option value="">Service Needed</option>
                  {SERVICES_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <textarea placeholder="Your message..." rows={4} style={{ ...inputStyle, resize: "vertical" }} value={form.message} onChange={upd("message")} />
                <button onClick={submit} style={{
                  padding: "14px 24px", background: "linear-gradient(135deg,#C5620B,#6A2B09)",
                  border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 700,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 8, boxShadow: "0 8px 24px rgba(197,98,11,0.35)", transition: "transform 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                  <Icon d={icons.send} size={16} /> Send Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
