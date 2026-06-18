import { useState } from "react";
import { icons } from "../constants";
import { Icon, SectionLabel, SectionHeading } from "./ui";
import { useTheme } from "../context/ThemeContext";

const SOLUTIONS = [
  {
    icon: "network",
    color: "#2c5f8a",
    title: "Networking Solutions",
    desc: "Full office network setups, router & firewall configuration, server deployment, and ongoing managed IT support for businesses.",
    href: "/networking",
    cta: "Learn More",
  },
  {
    icon: "code",
    color: "#6c3483",
    title: "Web & Software Development",
    desc: "Custom websites, business platforms, mobile apps, and enterprise software built with modern stacks and delivered on time.",
    href: "/software-development",
    cta: "Learn More",
  },
  {
    icon: "zap",
    color: "#d4a800",
    title: "Cloud Infrastructure",
    desc: "Cloud hosting, automated backups, email hosting, and scalable infrastructure so your business never goes offline.",
    href: "/networking",
    cta: "Learn More",
  },
  {
    icon: "camera",
    color: "#c0392b",
    title: "Creative Studio",
    desc: "Professional graphics, brand identity, video production, and digital content — everything to make your brand stand out.",
    href: "/services",
    cta: "See Portfolio",
  },
  {
    icon: "users",
    color: "#27ae60",
    title: "IT Consulting",
    desc: "Strategic technology advice, digital transformation roadmaps, and hands-on consulting to help your business scale with confidence.",
    href: "/services",
    cta: "Talk to Us",
  },
];

function SolutionCard({ sol }) {
  const { t } = useTheme();
  const [hov, setHov] = useState(false);

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      padding: "36px 30px", borderRadius: 22,
      background: hov ? t.surfaceHover : t.cardBg,
      border: `1px solid ${hov ? sol.color + "55" : t.cardBorder}`,
      backdropFilter: "blur(16px)",
      transform: hov ? "translateY(-6px)" : "none",
      transition: "all 0.3s ease",
      display: "flex", flexDirection: "column", gap: 0,
    }}>
      {/* Icon */}
      <div style={{
        width: 56, height: 56, borderRadius: 16, marginBottom: 22,
        background: hov ? `linear-gradient(135deg,${sol.color},${sol.color}aa)` : `${sol.color}22`,
        border: `1px solid ${sol.color}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: hov ? "#fff" : sol.color,
        boxShadow: hov ? `0 8px 24px ${sol.color}44` : "none",
        transition: "all 0.3s",
      }}>
        <Icon d={icons[sol.icon]} size={24} />
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 700, color: t.textPrimary, marginBottom: 12 }}>{sol.title}</h3>
      <p style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.75, flexGrow: 1, marginBottom: 24 }}>{sol.desc}</p>

      <a href={sol.href} onClick={e => { if(sol.href.startsWith("/")){ e.preventDefault(); window.history.pushState(null,"",sol.href); window.dispatchEvent(new PopStateEvent("popstate")); window.scrollTo(0,0); }}} style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 13, fontWeight: 700, color: sol.color,
        textDecoration: "none", transition: "gap 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.gap = "10px"}
        onMouseLeave={e => e.currentTarget.style.gap = "6px"}>
        {sol.cta} <Icon d={icons.arrow} size={14} />
      </a>
    </div>
  );
}

export default function OurSolutions() {
  const { t } = useTheme();
  return (
    <section id="solutions" style={{ padding: "100px 0" }}>
      <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <SectionLabel>Our Solutions</SectionLabel>
          <SectionHeading>Technology that works for you</SectionHeading>
          <p style={{ fontSize: 16, color: t.textSecondary, marginTop: 16, maxWidth: 520, margin: "16px auto 0" }}>
            We combine software, networking, and creative services into integrated solutions that help businesses grow and teams stay productive.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
          {SOLUTIONS.map((sol, i) => <SolutionCard key={i} sol={sol} />)}
        </div>
      </div>
    </section>
  );
}
