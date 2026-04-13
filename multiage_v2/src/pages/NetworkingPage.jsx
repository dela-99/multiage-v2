import PageLayout from "../components/PageLayout";
import { useTheme } from "../context/ThemeContext";
import { Icon, SectionLabel, PageHeroHeading, BtnPrimary, BtnGhost, GlowBlob } from "../components/ui";
import { icons } from "../constants";

const SECTIONS = [
  {
    label: "Cloud Infrastructure",
    color: "#2c5f8a",
    icon: "globe",
    intro: "Reliable, scalable cloud solutions that keep your business running 24/7.",
    services: [
      { icon: "zap",     title: "Cloud Hosting",       desc: "Fully managed VPS and dedicated servers with 99.9% uptime SLA. We handle setup, configuration, and monitoring." },
      { icon: "monitor", title: "Automated Backups",   desc: "Daily encrypted backups of all your critical data stored across multiple geographic locations." },
      { icon: "mail",    title: "Business Email",      desc: "Professional business email hosting on your own domain — Microsoft 365 and Google Workspace setup and management." },
      { icon: "code",    title: "Cloud Migrations",    desc: "Seamless migration of your on-premise infrastructure to the cloud with zero data loss and minimal downtime." },
    ],
  },
  {
    label: "Networking Solutions",
    color: "#C5620B",
    icon: "network",
    intro: "End-to-end network design, deployment, and management for offices of all sizes.",
    services: [
      { icon: "network", title: "Office Network Setup",          desc: "Complete LAN/WAN infrastructure design and installation — structured cabling, switches, access points." },
      { icon: "zap",     title: "Router & Firewall Config",      desc: "Enterprise-grade router and firewall setup with intrusion detection, VPN, and traffic shaping." },
      { icon: "monitor", title: "Server Deployment",             desc: "Physical and virtual server deployment: Windows Server, Linux, VMware, Hyper-V environments." },
      { icon: "users",   title: "Wi-Fi Optimisation",            desc: "Site surveys and strategic access point placement for full-coverage, high-performance wireless networks." },
    ],
  },
  {
    label: "Cybersecurity",
    color: "#c0392b",
    icon: "zap",
    intro: "Proactive security measures to protect your business data and infrastructure.",
    services: [
      { icon: "zap",     title: "Network Security",     desc: "Multi-layer security architecture including IDS/IPS, next-gen firewalls, and zero-trust network access." },
      { icon: "monitor", title: "24/7 Monitoring",      desc: "Round-the-clock SOC monitoring with real-time alerts and rapid incident response." },
      { icon: "code",    title: "Vulnerability Audits", desc: "Regular penetration testing and security assessments to identify and patch vulnerabilities before attackers do." },
      { icon: "users",   title: "Staff Training",       desc: "Cybersecurity awareness training for your team covering phishing, social engineering, and best practices." },
    ],
  },
  {
    label: "Maintenance & Support",
    color: "#27ae60",
    icon: "users",
    intro: "Ongoing IT support and proactive maintenance to keep your systems performing.",
    services: [
      { icon: "phone",   title: "Helpdesk Support",     desc: "Dedicated IT helpdesk available via phone, email, and WhatsApp for fast resolution of any technical issues." },
      { icon: "monitor", title: "System Monitoring",    desc: "Proactive monitoring of servers, networks, and endpoints with automated alerts and performance reports." },
      { icon: "zap",     title: "Scheduled Maintenance",desc: "Regular system updates, patch management, and health checks to prevent issues before they occur." },
      { icon: "network", title: "On-Site Support",      desc: "Rapid on-site response across Accra and Greater Accra for hardware failures and complex issues." },
    ],
  },
];

const STATS = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "< 4hr", label: "Response Time" },
  { value: "200+",  label: "Networks Deployed" },
  { value: "24/7",  label: "Monitoring" },
];

function ServiceTile({ svc, color }) {
  const { t } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      padding: "28px 24px", borderRadius: 18,
      background: hov ? t.surfaceHover : t.cardBg,
      border: `1px solid ${hov ? color + "55" : t.cardBorder}`,
      backdropFilter: "blur(14px)", transition: "all 0.28s",
      transform: hov ? "translateY(-4px)" : "none",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, marginBottom: 16,
        background: `${color}22`, border: `1px solid ${color}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color, transition: "all 0.28s",
        ...(hov ? { background: color, color: "#fff", boxShadow: `0 6px 18px ${color}44` } : {}),
      }}>
        <Icon d={icons[svc.icon]} size={20} />
      </div>
      <h4 style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary, marginBottom: 8 }}>{svc.title}</h4>
      <p style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.7 }}>{svc.desc}</p>
    </div>
  );
}

import { useState } from "react";

export default function NetworkingPage() {
  const { t } = useTheme();

  return (
    <PageLayout>
      {/* Hero */}
      <section style={{ padding: "80px 0 60px", position: "relative", overflow: "hidden" }}>
        <GlowBlob color="#2c5f8a" size={600} x="70%" y="50%" opacity={0.14} />
        <GlowBlob color="#C5620B" size={400} x="15%" y="70%" opacity={0.10} />
        <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <SectionLabel>Cloud & Networking</SectionLabel>
          <PageHeroHeading style={{ marginBottom: 16 }}>
            Infrastructure that<br />
            <span style={{ background: "linear-gradient(135deg,#2c5f8a,#C5620B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              never sleeps.
            </span>
          </PageHeroHeading>
          <p style={{ fontSize: 17, color: t.textSecondary, maxWidth: 560, lineHeight: 1.7, marginBottom: 40 }}>
            From cloud hosting and business email to full office networks and cybersecurity — we build and manage the technology backbone your business relies on.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <BtnPrimary href="/contact">Get a Free Assessment <Icon d={icons.arrow} size={15} /></BtnPrimary>
            <BtnGhost href="#solutions">See Our Services</BtnGhost>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 20 }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              padding: "28px 24px", borderRadius: 18, textAlign: "center",
              background: t.cardBg, border: `1px solid ${t.cardBorder}`, backdropFilter: "blur(14px)",
            }}>
              <div style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 900, color: "#C5620B", fontFamily: "'Playfair Display',serif", marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Sections */}
      <div id="solutions" style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px 100px" }}>
        {SECTIONS.map((sec, i) => (
          <div key={i} style={{ marginBottom: 80 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: `${sec.color}22`, border: `1px solid ${sec.color}44`,
                display: "flex", alignItems: "center", justifyContent: "center", color: sec.color,
              }}>
                <Icon d={icons[sec.icon]} size={22} />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: sec.color, textTransform: "uppercase", marginBottom: 2 }}>{sec.label}</p>
                <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3vw,36px)", fontWeight: 800, color: t.textPrimary, letterSpacing: -0.5 }}>
                  {sec.label}
                </h2>
              </div>
            </div>
            <p style={{ fontSize: 15, color: t.textSecondary, marginBottom: 32, maxWidth: 560 }}>{sec.intro}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
              {sec.services.map((svc, j) => <ServiceTile key={j} svc={svc} color={sec.color} />)}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div style={{
          padding: "56px 48px", borderRadius: 24,
          background: "linear-gradient(135deg,rgba(44,95,138,0.15),rgba(197,98,11,0.15))",
          border: "1px solid rgba(197,98,11,0.25)", textAlign: "center", backdropFilter: "blur(20px)",
        }}>
          <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: t.textPrimary, marginBottom: 16 }}>
            Ready to upgrade your infrastructure?
          </h2>
          <p style={{ fontSize: 15, color: t.textSecondary, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Get a free network assessment and personalised proposal from our certified engineers.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <BtnPrimary href="/contact">Book Free Assessment <Icon d={icons.arrow} size={15} /></BtnPrimary>
            <BtnGhost href="https://wa.me/233000000000"><Icon d={icons.whatsapp} size={15} /> WhatsApp Us</BtnGhost>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
