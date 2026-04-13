import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { useTheme } from "../context/ThemeContext";
import { Icon, SectionLabel, PageHeroHeading, BtnPrimary, BtnGhost, GlowBlob } from "../components/ui";
import { icons } from "../constants";

/* ── IT Consulting + Repair & Maintenance moved here from ServicesPage */
const HARDWARE_SERVICES = [
  {
    category: "IT Consulting",
    color: "#2c5f8a",
    icon: "users",
    items: [
      { title: "Digital Strategy",    desc: "Technology roadmapping, digital transformation planning, and IT budget advisory for growing businesses." },
      { title: "IT Procurement",      desc: "We source and negotiate the best deals on hardware, software licences, and cloud subscriptions." },
      { title: "Systems Integration", desc: "Connect disparate business tools — CRM, ERP, accounting software — into a unified, automated workflow." },
      { title: "Staff Training",      desc: "Hands-on training workshops for Microsoft 365, Google Workspace, cybersecurity, and custom software." },
    ],
  },
  {
    category: "Repair & Maintenance",
    color: "#27ae60",
    icon: "zap",
    items: [
      { title: "Device Repairs",           desc: "Screen replacements, battery swaps, charging port repairs for iPhones, Samsung, laptops, and tablets." },
      { title: "Data Recovery",            desc: "Professional data recovery from damaged phones, laptops, and storage drives — no data, no charge." },
      { title: "Software Troubleshooting", desc: "Virus removal, OS reinstallation, slow computer diagnosis, and performance optimisation." },
      { title: "Preventive Maintenance",   desc: "Scheduled cleaning, thermal paste replacement, and hardware health checks to extend device lifespan." },
    ],
  },
];

/* Exact same ServiceGroup + card style as ServicesPage ─────────── */
function ServiceGroup({ group }) {
  const { t } = useTheme();
  return (
    <div style={{ marginBottom: 72 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: `${group.color}22`, border: `1px solid ${group.color}44`,
          display: "flex", alignItems: "center", justifyContent: "center", color: group.color,
        }}>
          <Icon d={icons[group.icon]} size={22} />
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: group.color, textTransform: "uppercase" }}>
            {group.category}
          </p>
          <h3 style={{
            fontFamily: "'Dans',Georgia,serif",
            fontSize: "clamp(20px,2.5vw,32px)", fontWeight: 800,
            color: t.textPrimary, letterSpacing: -0.5,
          }}>{group.category}</h3>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
        {group.items.map((item, i) => {
          const [hov, setHov] = useState(false);
          return (
            <div key={i}
              onMouseEnter={() => setHov(true)}
              onMouseLeave={() => setHov(false)}
              style={{
                padding: "24px 22px", borderRadius: 18,
                background: hov ? t.surfaceHover : t.cardBg,
                border: `1px solid ${hov ? group.color + "44" : t.cardBorder}`,
                backdropFilter: "blur(14px)", transition: "all 0.28s",
                transform: hov ? "translateY(-3px)" : "none",
              }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: group.color, marginBottom: 12 }} />
              <h4 style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary, marginBottom: 8 }}>{item.title}</h4>
              <p style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.65 }}>{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HardwarePage() {
  const { t } = useTheme();
  return (
    <PageLayout>
      {/* Hero */}
      <section style={{ padding: "80px 0 60px", position: "relative", overflow: "hidden" }}>
        <GlowBlob color="#2c5f8a" size={500} x="75%" y="45%" opacity={0.12} />
        <GlowBlob color="#27ae60" size={400} x="10%" y="65%" opacity={0.10} />
        <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <SectionLabel>Hardware &amp; Support</SectionLabel>
          <PageHeroHeading style={{ marginBottom: 16 }}>
            IT support and <br />
            <span style={{
              background: "linear-gradient(135deg,#2c5f8a,#27ae60)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              hardware services.
            </span>
          </PageHeroHeading>
          <p style={{ fontSize: 17, color: t.textSecondary, maxWidth: 560, lineHeight: 1.7, marginBottom: 40 }}>
            From IT consulting and systems integration to device repairs and preventive maintenance
            — we keep your hardware running and your team productive.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <BtnPrimary href="/contact">Book a Service <Icon d={icons.arrow} size={15} /></BtnPrimary>
            <BtnGhost href="/contact">
              <Icon d={icons.whatsapp} size={15} /> WhatsApp Us
            </BtnGhost>
          </div>
        </div>
      </section>

      {/* Service groups */}
      <section style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px 40px" }}>
        {HARDWARE_SERVICES.map((group, i) => <ServiceGroup key={i} group={group} />)}
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px 100px" }}>
        <div style={{
          padding: "52px 44px", borderRadius: 24, textAlign: "center",
          background: "linear-gradient(135deg,rgba(44,95,138,0.15),rgba(39,174,96,0.12))",
          border: "1px solid rgba(44,95,138,0.25)", backdropFilter: "blur(20px)",
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "clamp(22px,3.5vw,38px)", fontWeight: 800,
            color: t.textPrimary, marginBottom: 14,
          }}>
            Need a repair or IT consultation?
          </h2>
          <p style={{ fontSize: 15, color: t.textSecondary, maxWidth: 440, margin: "0 auto 28px", lineHeight: 1.7 }}>
            Bring your device in or book an on-site visit. We respond within  hours.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <BtnPrimary href="/contact">Book Now <Icon d={icons.arrow} size={15} /></BtnPrimary>
            <BtnGhost href="/services">View Pricing</BtnGhost>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
