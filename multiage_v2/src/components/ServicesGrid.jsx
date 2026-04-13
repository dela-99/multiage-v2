import { useState } from "react";
import { SERVICES_GRID, icons } from "../constants";
import { Icon, SectionLabel, SectionHeading } from "./ui";
import { useTheme } from "../context/ThemeContext";

function ServiceCard({ svc }) {
  const { t } = useTheme();
  const [hov, setHov] = useState(false);

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      padding: "32px 28px", borderRadius: 20,
      background: hov ? "rgba(197,98,11,0.10)" : t.cardBg,
      border: `1px solid ${hov ? "rgba(197,98,11,0.38)" : t.cardBorder}`,
      backdropFilter: "blur(16px)",
      transform: hov ? "translateY(-6px)" : "none",
      transition: "all 0.3s", cursor: "pointer",
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 16,
        background: hov ? "linear-gradient(135deg,#C5620B,#6A2B09)" : "rgba(197,98,11,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 20, color: hov ? "#fff" : "#C5620B",
        boxShadow: hov ? "0 8px 24px rgba(197,98,11,0.35)" : "none",
        transition: "all 0.3s",
      }}>
        <Icon d={icons[svc.icon]} size={22} />
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: t.textPrimary, marginBottom: 10 }}>{svc.title}</h3>
      <p style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.7 }}>{svc.desc}</p>
      <div style={{
        marginTop: 20, display: "flex", alignItems: "center", gap: 6,
        fontSize: 13, fontWeight: 600, color: "#C5620B",
        opacity: hov ? 1 : 0, transition: "opacity 0.3s",
      }}>
        Learn more <Icon d={icons.arrow} size={14} />
      </div>
    </div>
  );
}

export default function ServicesGrid() {
  const { t } = useTheme();
  return (
    <section id="services" style={{ padding: "100px 0" }}>
      <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <SectionLabel>Our Services</SectionLabel>
          <SectionHeading>Everything your business needs</SectionHeading>
          <p style={{ fontSize: 16, color: t.textSecondary, marginTop: 16, maxWidth: 480, margin: "16px auto 0" }}>
            From premium hardware to custom software — we deliver complete technology ecosystems.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
          {SERVICES_GRID.map((svc, i) => <ServiceCard key={i} svc={svc} />)}
        </div>
      </div>
    </section>
  );
}
