import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { useTheme } from "../context/ThemeContext";
import { Icon, SectionLabel, PageHeroHeading, BtnPrimary, GlowBlob } from "../components/ui";
import { icons } from "../constants";
import { api } from "../lib/api";

const CONTACT_OPTIONS = [
  { icon: "whatsapp", color: "#25D366", label: "WhatsApp", sub: "Quick responses", href: "https://wa.me/233552803112" },
  { icon: "mail",     color: "#C5620B", label: "Email Us",  sub: "multiagetechnologies@gmail.com", href: "mailto:multiagetechnologies@gmail.com" },
  { icon: "phone",    color: "#2c5f8a", label: "Call Us",   sub: "055 280 3112", href: "tel:0552803112" },
  { icon: "globe",    color: "#6c3483", label: "Visit Us",  sub: "Accra, Greater Accra", href: "#map" },
];

const SERVICES_OPTIONS = [
  "Electronics / Device Purchase","Website Development","Mobile App Development",
  "Networking Setup","Cloud Infrastructure","Creative Studio Services",
  "IT Consulting","Device Repair","Other",
];

const FAQ = [
  { q: "How quickly do you respond to enquiries?", a: "We respond to all WhatsApp and email enquiries within 2 hours during business hours (Mon–Sat, 8am–7pm)." },
  { q: "Do you deliver devices outside Accra?",    a: "Yes — we ship nationwide via trusted courier services. Delivery to major cities typically takes 1–3 business days." },
  { q: "Can I visit your showroom?",               a: "Absolutely. Our showroom in Accra is open Monday to Saturday, 9am–6pm. Call ahead to ensure your preferred device is in stock." },
  { q: "Do you offer payment plans?",              a: "We offer flexible instalment plans on select devices and services. Contact us to discuss options." },
];

export default function ContactPage() {
  const { t } = useTheme();
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upd = f => e => setForm(p => ({ ...p, [f]: e.target.value }));
  const submit = async () => {
    if (!form.name || !form.email || !form.message) return;

    try {
      setLoading(true);
      setError("");
      await api.sendMessage({ ...form, kind: "contact", source: "contact-page" });
      setSent(true);
      setTimeout(() => setSent(false), 5000);
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (err) {
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px",
    background: t.inputBg, border: `1px solid ${t.inputBorder}`,
    borderRadius: 12, color: t.textPrimary, fontSize: 14, outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section style={{ padding: "80px 0 60px", position: "relative", overflow: "hidden" }}>
        <GlowBlob color="#C5620B" size={500} x="70%" y="50%" opacity={0.13} />
        <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <SectionLabel>Contact Us</SectionLabel>
          <PageHeroHeading style={{ marginBottom: 16 }}>
            Let's talk about<br />
            <span style={{ background: "linear-gradient(135deg,#C5620B,#e8892e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              your project.
            </span>
          </PageHeroHeading>
          <p style={{ fontSize: 17, color: t.textSecondary, maxWidth: 520, lineHeight: 1.7 }}>
            We'd love to hear from you. Send us a message, and we'll get back to you within hours.
          </p>
        </div>
      </section>

      {/* Contact option cards */}
      <section style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
          {CONTACT_OPTIONS.map(opt => (
            <a key={opt.label} href={opt.href} style={{ textDecoration: "none" }}>
              <div style={{
                padding: "24px", borderRadius: 18,
                background: t.cardBg, border: `1px solid ${t.cardBorder}`,
                backdropFilter: "blur(14px)", transition: "all 0.25s",
                display: "flex", flexDirection: "column", gap: 12,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = opt.color + "55"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.cardBorder; e.currentTarget.style.transform = "none"; }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${opt.color}22`, border: `1px solid ${opt.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center", color: opt.color,
                }}>
                  <Icon d={icons[opt.icon]} size={20} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary }}>{opt.label}</div>
                  <div style={{ fontSize: 13, color: t.textMuted }}>{opt.sub}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Contact form + info */}
      <section style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }} className="grid-responsive">

          {/* Form */}
          <div style={{
            padding: "40px 36px", borderRadius: 24,
            background: t.cardBg, border: `1px solid ${t.cardBorder}`, backdropFilter: "blur(16px)",
          }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 20 }}>🎉</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: t.textPrimary, marginBottom: 10 }}>Message Sent!</h3>
                <p style={{ color: t.textSecondary, fontSize: 15, lineHeight: 1.6 }}>
                  Thanks for reaching out. We'll get back to you within 2 business hours.
                </p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: t.textPrimary, marginBottom: 24 }}>Send us a message</h3>
                {error && (
                  <div style={{
                    marginBottom: 16,
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: "rgba(192,57,43,0.12)",
                    color: "#c0392b",
                    border: "1px solid rgba(192,57,43,0.24)",
                  }}>
                    {error}
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <input placeholder="Your Name *" style={inputStyle} value={form.name} onChange={upd("name")}
                      onFocus={e => e.target.style.borderColor = "#C5620B"} onBlur={e => e.target.style.borderColor = t.inputBorder} />
                    <input placeholder="Email Address *" type="email" style={inputStyle} value={form.email} onChange={upd("email")}
                      onFocus={e => e.target.style.borderColor = "#C5620B"} onBlur={e => e.target.style.borderColor = t.inputBorder} />
                  </div>
                  <input placeholder="Phone Number" style={inputStyle} value={form.phone} onChange={upd("phone")}
                    onFocus={e => e.target.style.borderColor = "#C5620B"} onBlur={e => e.target.style.borderColor = t.inputBorder} />
                  <select style={{ ...inputStyle, appearance: "none" }} value={form.service} onChange={upd("service")}
                    onFocus={e => e.target.style.borderColor = "#C5620B"} onBlur={e => e.target.style.borderColor = t.inputBorder}>
                    <option value="">Service Needed</option>
                    {SERVICES_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <textarea placeholder="Tell us about your project…" rows={5} style={{ ...inputStyle, resize: "vertical" }} value={form.message} onChange={upd("message")}
                    onFocus={e => e.target.style.borderColor = "#C5620B"} onBlur={e => e.target.style.borderColor = t.inputBorder} />
                  <BtnPrimary onClick={submit} style={{ justifyContent: "center", opacity: loading ? 0.75 : 1 }}>
                    <Icon d={icons.send} size={16} /> {loading ? "Sending..." : "Send Message"}
                  </BtnPrimary>
                </div>
              </>
            )}
          </div>

          {/* Info + FAQ */}
          <div>
            <div style={{ padding: "32px", borderRadius: 20, background: t.cardBg, border: `1px solid ${t.cardBorder}`, backdropFilter: "blur(14px)", marginBottom: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: t.textPrimary, marginBottom: 16 }}>Business Hours</h3>
              {[["Monday – Friday", "8:00am – 7:00pm"], ["Saturday", "9:00am – 6:00pm"], ["Sunday", "Closed"]].map(([day, hrs]) => (
                <div key={day} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${t.border}` }}>
                  <span style={{ fontSize: 14, color: t.textSecondary }}>{day}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: t.textPrimary }}>{hrs}</span>
                </div>
              ))}
              <p style={{ fontSize: 13, color: t.textMuted, marginTop: 16 }}>WhatsApp support available outside business hours for urgent issues.</p>
            </div>

            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: t.textPrimary, marginBottom: 16 }}>Frequently Asked Questions</h3>
              {FAQ.map((item, i) => (
                <div key={i} style={{ borderBottom: `1px solid ${t.border}`, overflow: "hidden" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                    width: "100%", padding: "16px 0", display: "flex", justifyContent: "space-between",
                    alignItems: "center", background: "none", border: "none", cursor: "pointer",
                    color: t.textPrimary, textAlign: "left",
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{item.q}</span>
                    <span style={{ fontSize: 18, color: "#C5620B", transform: openFaq === i ? "rotate(45deg)" : "none", transition: "transform 0.25s" }}>+</span>
                  </button>
                  <div style={{ maxHeight: openFaq === i ? 200 : 0, overflow: "hidden", transition: "max-height 0.35s ease" }}>
                    <p style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.7, paddingBottom: 16 }}>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
