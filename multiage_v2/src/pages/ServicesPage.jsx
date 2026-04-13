import { useState } from "react";
import PageLayout from "../components/PageLayout";
import { useTheme } from "../context/ThemeContext";
import { Icon, SectionLabel, PageHeroHeading, BtnPrimary, BtnGhost, GlowBlob } from "../components/ui";
import { icons } from "../constants";

/* ── Creative Studio ONLY — IT Consulting + Repair moved to /hardware */
const ALL_SERVICES = [
  {
    category: "Creative Studio",
    color: "#c0392b",
    icon: "camera",
    items: [
      { title: "Brand Identity Design",   desc: "Logo design, brand guidelines, colour systems, and typography — everything to establish a strong, consistent brand." },
      { title: "Graphic Design",          desc: "Marketing materials, social media graphics, brochures, banners, and print designs that convert." },
      { title: "Video Production",        desc: "Corporate videos, product demos, social media reels, and event coverage produced in our fully equipped studio." },
      { title: "Photography",             desc: "Product photography, corporate headshots, event coverage, and content creation for digital platforms." },
      { title: "Social Media Management", desc: "Content strategy, creation, scheduling, and community management across all major platforms." },
    ],
  },
];

/* PRICING — unchanged from original */
const PRICING = [
  {
    name: "Starter", price: "GHS 999", period: "/month",
    desc: "Perfect for small businesses getting started with professional IT support.",
    features: ["8hr helpdesk support","Monthly maintenance check","Email hosting (5 accounts)","Basic network monitoring","1 site visit/month"],
    cta: "Get Started", highlight: false,
  },
  {
    name: "Business", price: "GHS 2,499", period: "/month",
    desc: "Comprehensive IT management for growing businesses.",
    features: ["24/7 helpdesk support","Weekly maintenance","Email hosting (20 accounts)","Full network monitoring","Unlimited site visits","Cloud backup (500GB)","Cybersecurity suite"],
    cta: "Most Popular", highlight: true,
  },
  {
    name: "Enterprise", price: "Custom", period: "",
    desc: "Tailored solutions for large organisations with complex needs.",
    features: ["Dedicated account manager","SLA guarantee (<2hr response)","Unlimited email accounts","SOC monitoring 24/7","Multi-site support","Unlimited cloud backup","Annual IT strategy review"],
    cta: "Contact Sales", highlight: false,
  },
];

/* Identical ServiceGroup to original ServicesPage ─────────────── */
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
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: group.color, textTransform: "uppercase" }}>{group.category}</p>
          <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(20px,2.5vw,32px)", fontWeight: 800, color: t.textPrimary, letterSpacing: -0.5 }}>
            {group.category}
          </h3>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
        {group.items.map((item, i) => {
          const [hov, setHov] = useState(false);
          return (
            <div key={i} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
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

/* Identical PricingCard to original ─────────────────────────────── */
function PricingCard({ plan }) {
  const { t } = useTheme();
  return (
    <div style={{
      padding: "36px 30px", borderRadius: 24,
      background: plan.highlight ? "linear-gradient(145deg,rgba(197,98,11,0.18),rgba(106,43,9,0.22))" : t.cardBg,
      border: `1px solid ${plan.highlight ? "rgba(197,98,11,0.45)" : t.cardBorder}`,
      backdropFilter: "blur(16px)", position: "relative",
      boxShadow: plan.highlight ? "0 20px 60px rgba(197,98,11,0.2)" : "none",
    }}>
      {plan.highlight && (
        <div style={{
          position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
          padding: "4px 18px", background: "linear-gradient(135deg,#C5620B,#6A2B09)",
          borderRadius: 100, fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: 1, whiteSpace: "nowrap",
        }}>MOST POPULAR</div>
      )}
      <h3 style={{ fontSize: 20, fontWeight: 800, color: t.textPrimary, marginBottom: 6 }}>{plan.name}</h3>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
        <span style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 900, color: plan.highlight ? "#C5620B" : t.textPrimary, fontFamily: "'Playfair Display',serif" }}>{plan.price}</span>
        <span style={{ fontSize: 14, color: t.textMuted }}>{plan.period}</span>
      </div>
      <p style={{ fontSize: 13, color: t.textSecondary, marginBottom: 24, lineHeight: 1.6 }}>{plan.desc}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {plan.features.map(f => (
          <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: plan.highlight ? "rgba(197,98,11,0.2)" : t.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#C5620B" }}>
              <Icon d={icons.check} size={11} />
            </div>
            <span style={{ fontSize: 13, color: t.textSecondary }}>{f}</span>
          </div>
        ))}
      </div>
      <a href="/contact" style={{
        display: "block", textAlign: "center", padding: "13px",
        background: plan.highlight ? "linear-gradient(135deg,#C5620B,#6A2B09)" : t.surface,
        border: `1px solid ${plan.highlight ? "transparent" : t.border}`,
        borderRadius: 12, fontWeight: 700, fontSize: 14,
        color: plan.highlight ? "#fff" : t.textPrimary,
        textDecoration: "none", transition: "opacity 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
        {plan.cta}
      </a>
    </div>
  );
}

export default function ServicesPage() {
  const { t } = useTheme();
  return (
    <PageLayout>
      {/* Hero */}
      <section style={{ padding: "80px 0 60px", position: "relative", overflow: "hidden" }}>
        <GlowBlob color="#c0392b" size={500} x="75%" y="45%" opacity={0.12} />
        <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <SectionLabel>Creative Studio</SectionLabel>
          <PageHeroHeading style={{ marginBottom: 16 }}>
            Creative work that<br />
            <span style={{ background: "linear-gradient(135deg,#c0392b,#C5620B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              makes you stand out.
            </span>
          </PageHeroHeading>
          <p style={{ fontSize: 17, color: t.textSecondary, maxWidth: 560, lineHeight: 1.7, marginBottom: 40 }}>
            Brand identity, graphic design, video production, photography, and social media management — all under one roof.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <BtnPrimary href="/contact">Request a Service <Icon d={icons.arrow} size={15} /></BtnPrimary>
            <BtnGhost href="#pricing">View Pricing</BtnGhost>
          </div>
        </div>
      </section>

      {/* Service Groups — Creative Studio only */}
      <section style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px 40px" }}>
        {ALL_SERVICES.map((group, i) => <ServiceGroup key={i} group={group} />)}

        {/* Pointer to Hardware page */}
        <div style={{
          padding: "24px 28px", borderRadius: 18,
          background: t.surface, border: `1px solid ${t.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary, marginBottom: 4 }}>
              Looking for IT Consulting or Device Repairs?
            </h4>
            <p style={{ fontSize: 13, color: t.textMuted }}>
              IT Consulting and Repair &amp; Maintenance are now on our Hardware page.
            </p>
          </div>
          <a href="/hardware"
            onClick={e => { e.preventDefault(); window.history.pushState(null,"","/hardware"); window.dispatchEvent(new PopStateEvent("popstate")); window.scrollTo(0,0); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 12,
              background: t.surface, border: `1px solid ${t.border}`,
              fontSize: 13, fontWeight: 600, color: t.textPrimary,
              textDecoration: "none", transition: "all 0.22s", whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(197,98,11,0.35)"; e.currentTarget.style.color = "#C5620B"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textPrimary; }}
          >
            Go to Hardware <Icon d={icons.arrow} size={14} />
          </a>
        </div>
      </section>

      {/* Pricing — unchanged */}
      <section id="pricing" style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px 100px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <SectionLabel>Managed IT Plans</SectionLabel>
          <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 800, color: t.textPrimary, letterSpacing: -1 }}>
            Simple, transparent pricing
          </h2>
          <p style={{ fontSize: 15, color: t.textSecondary, marginTop: 12, maxWidth: 440, margin: "12px auto 0" }}>
            All plans include onboarding, setup, and a dedicated point of contact.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, alignItems: "start" }}>
          {PRICING.map((plan, i) => <PricingCard key={i} plan={plan} />)}
        </div>
      </section>
    </PageLayout>
  );
}
