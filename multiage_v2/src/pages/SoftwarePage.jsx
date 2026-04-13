import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { useTheme } from "../context/ThemeContext";
import { Icon, SectionLabel, PageHeroHeading, BtnPrimary, BtnGhost, GlowBlob } from "../components/ui";
import { icons } from "../constants";

const SERVICES = [
  {
    icon: "globe", color: "#6c3483",
    title: "Web Development",
    desc: "Custom websites, landing pages, and web applications built with React, Next.js, and modern frameworks. Fast, SEO-friendly, and mobile-first.",
    features: ["React / Next.js", "E-commerce", "CMS Integration", "SEO Optimised"],
  },
  {
    icon: "phone", color: "#2c5f8a",
    title: "Mobile App Development",
    desc: "Native iOS and Android apps, and cross-platform solutions using React Native and Flutter — from concept to App Store launch.",
    features: ["iOS & Android", "React Native", "Flutter", "API Integration"],
  },
  {
    icon: "monitor", color: "#C5620B",
    title: "Enterprise Software",
    desc: "Custom ERP, CRM, inventory management, and business automation tools that replace expensive off-the-shelf solutions.",
    features: ["Custom ERP/CRM", "Automation", "Dashboards", "REST APIs"],
  },
  {
    icon: "code", color: "#27ae60",
    title: "API & Backend Development",
    desc: "Robust REST and GraphQL APIs, database architecture, and cloud-native backend services built for performance and scale.",
    features: ["Node.js / Python", "PostgreSQL", "GraphQL", "Microservices"],
  },
  {
    icon: "camera", color: "#c0392b",
    title: "UI/UX Design",
    desc: "User research, wireframing, prototyping, and pixel-perfect UI design. We make software that people actually enjoy using.",
    features: ["Figma Design", "Prototyping", "Design Systems", "User Testing"],
  },
  {
    icon: "zap", color: "#d4a800",
    title: "Digital Transformation",
    desc: "Modernise legacy systems, migrate to the cloud, and digitise manual processes — with a clear roadmap and minimal disruption.",
    features: ["Legacy Migration", "Cloud Setup", "Process Automation", "Staff Training"],
  },
];

const PROCESS = [
  { step: "01", title: "Discovery", desc: "We understand your business goals, users, and technical requirements through structured workshops." },
  { step: "02", title: "Design",    desc: "Wireframes, user flows, and interactive prototypes — reviewed and approved before any code is written." },
  { step: "03", title: "Build",     desc: "Agile development in 2-week sprints with weekly demos so you always know where things stand." },
  { step: "04", title: "Launch",    desc: "QA testing, deployment, and go-live support. We stay on until everything runs smoothly." },
  { step: "05", title: "Support",   desc: "Ongoing maintenance, updates, and feature development as your business evolves." },
];

const TECH = ["React","Next.js","React Native","Flutter","Node.js","Python","FastAPI","PostgreSQL","MongoDB","Redis","Docker","AWS","Figma","TypeScript"];

function ServiceCard({ svc }) {
  const { t } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      padding: "36px 30px", borderRadius: 22,
      background: hov ? t.surfaceHover : t.cardBg,
      border: `1px solid ${hov ? svc.color + "55" : t.cardBorder}`,
      backdropFilter: "blur(16px)", transition: "all 0.3s",
      transform: hov ? "translateY(-6px)" : "none",
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 16, marginBottom: 20,
        background: hov ? svc.color : `${svc.color}22`,
        border: `1px solid ${svc.color}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: hov ? "#fff" : svc.color,
        boxShadow: hov ? `0 8px 24px ${svc.color}44` : "none",
        transition: "all 0.3s",
      }}>
        <Icon d={icons[svc.icon]} size={22} />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: t.textPrimary, marginBottom: 12 }}>{svc.title}</h3>
      <p style={{ fontSize: 13, color: t.textSecondary, lineHeight: 1.75, marginBottom: 20 }}>{svc.desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {svc.features.map(f => (
          <span key={f} style={{
            padding: "4px 10px", borderRadius: 100,
            background: `${svc.color}18`, border: `1px solid ${svc.color}33`,
            fontSize: 11, fontWeight: 600, color: svc.color,
          }}>{f}</span>
        ))}
      </div>
    </div>
  );
}

export default function SoftwarePage() {
  const { t } = useTheme();

  return (
    <PageLayout>
      {/* Hero */}
      <section style={{ padding: "80px 0 60px", position: "relative", overflow: "hidden" }}>
        <GlowBlob color="#6c3483" size={600} x="75%" y="45%" opacity={0.14} />
        <GlowBlob color="#C5620B" size={400} x="10%" y="70%" opacity={0.10} />
        <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <SectionLabel>Software Development</SectionLabel>
          <PageHeroHeading style={{ marginBottom: 16 }}>
            Software that<br />
            <span style={{ background: "linear-gradient(135deg,#6c3483,#C5620B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              scales with you.
            </span>
          </PageHeroHeading>
          <p style={{ fontSize: 17, color: t.textSecondary, maxWidth: 560, lineHeight: 1.7, marginBottom: 40 }}>
            We design and build web applications, mobile apps, and enterprise software that solve real business problems — built in Ghana, ready for the world.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <BtnPrimary href="/contact">Start Your Project <Icon d={icons.arrow} size={15} /></BtnPrimary>
            <BtnGhost href="#process">How We Work</BtnGhost>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <SectionLabel>What We Build</SectionLabel>
          <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 800, color: t.textPrimary, letterSpacing: -1 }}>
            Full-spectrum development services
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
          {SERVICES.map((svc, i) => <ServiceCard key={i} svc={svc} />)}
        </div>
      </section>

      {/* Process */}
      <section id="process" style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <SectionLabel>How We Work</SectionLabel>
          <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 800, color: t.textPrimary, letterSpacing: -1 }}>
            Our development process
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 20 }}>
          {PROCESS.map((p, i) => (
            <div key={i} style={{
              padding: "28px 24px", borderRadius: 20,
              background: t.cardBg, border: `1px solid ${t.cardBorder}`, backdropFilter: "blur(14px)",
            }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "rgba(197,98,11,0.3)", fontFamily: "'Playfair Display',serif", marginBottom: 12 }}>{p.step}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: t.textPrimary, marginBottom: 8 }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.65 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px 100px" }}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <SectionLabel>Tech Stack</SectionLabel>
          <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(24px,3vw,40px)", fontWeight: 800, color: t.textPrimary, letterSpacing: -1 }}>Technologies we master</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 64 }}>
          {TECH.map(tech => (
            <span key={tech} style={{
              padding: "8px 18px", borderRadius: 100,
              background: t.surface, border: `1px solid ${t.border}`,
              fontSize: 13, fontWeight: 600, color: t.textSecondary,
            }}>{tech}</span>
          ))}
        </div>

        <div style={{
          padding: "56px 48px", borderRadius: 24,
          background: "linear-gradient(135deg,rgba(108,52,131,0.15),rgba(197,98,11,0.15))",
          border: "1px solid rgba(197,98,11,0.25)", textAlign: "center", backdropFilter: "blur(20px)",
        }}>
          <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: t.textPrimary, marginBottom: 16 }}>
            Have a project in mind?
          </h2>
          <p style={{ fontSize: 15, color: t.textSecondary, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Tell us what you're building. We'll give you a free consultation and detailed quote within 48 hours.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <BtnPrimary href="/contact">Get a Free Quote <Icon d={icons.arrow} size={15} /></BtnPrimary>
            <BtnGhost href="https://wa.me/233000000000"><Icon d={icons.whatsapp} size={15} /> Chat on WhatsApp</BtnGhost>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
