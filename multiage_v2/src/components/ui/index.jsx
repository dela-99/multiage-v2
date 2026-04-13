import { useState } from "react";
import { icons } from "../../constants";
import { useTheme } from "../../context/ThemeContext";

// ── Inline SVG Icon ────────────────────────────────────────────────
export const Icon = ({ d, size = 20, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    style={style}>
    <path d={d} />
  </svg>
);

// ── Radial Glow Blob ───────────────────────────────────────────────
export const GlowBlob = ({ color, size = 400, x = "50%", y = "50%", opacity = 0.25 }) => (
  <div style={{
    position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)",
    width: size, height: size, borderRadius: "50%",
    background: `radial-gradient(circle,${color} 0%,transparent 70%)`,
    opacity, pointerEvents: "none", filter: "blur(60px)",
    transition: "background 0.8s ease",
  }} />
);

// ── Brand Logo Mark ────────────────────────────────────────────────
export const LogoMark = () => (
  <div style={{
    width: 36, height: 36, borderRadius: 10,
    background: "linear-gradient(135deg,#C5620B,#6A2B09)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 800, fontSize: 16, color: "#fff", flexShrink: 0,
  }}>M</div>
);

// ── Brand Wordmark ─────────────────────────────────────────────────
export const Wordmark = ({ color }) => {
  const { t } = useTheme();
  return (
    <span style={{
      fontFamily: "'Playfair Display',Georgia,serif",
      fontWeight: 700, fontSize: 17, letterSpacing: -0.3,
      color: color ?? t.textPrimary,
    }}>
      Multiage <span style={{ color: "#C5620B" }}>Technologies</span>
    </span>
  );
};

// ── Section Label ──────────────────────────────────────────────────
export const SectionLabel = ({ children }) => (
  <p style={{
    fontSize: 12, fontWeight: 600, letterSpacing: 3,
    color: "#C5620B", textTransform: "uppercase", marginBottom: 12,
  }}>{children}</p>
);

// ── Section Heading ────────────────────────────────────────────────
export const SectionHeading = ({ children, style = {} }) => {
  const { t } = useTheme();
  return (
    <h2 style={{
      fontFamily: "'Playfair Display',Georgia,serif",
      fontSize: "clamp(28px,4vw,52px)", fontWeight: 800,
      color: t.textPrimary, letterSpacing: -1, ...style,
    }}>{children}</h2>
  );
};

// ── Page Hero Heading (larger) ─────────────────────────────────────
export const PageHeroHeading = ({ children, style = {} }) => {
  const { t } = useTheme();
  return (
    <h1 style={{
      fontFamily: "'Playfair Display',Georgia,serif",
      fontSize: "clamp(36px,5vw,68px)", fontWeight: 900,
      color: t.textPrimary, letterSpacing: -2, lineHeight: 1.05, ...style,
    }}>{children}</h1>
  );
};

// ── Themed Card wrapper ────────────────────────────────────────────
export const Card = ({ children, style = {}, hoverOrange = false }) => {
  const { t } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov && hoverOrange ? "rgba(197,98,11,0.10)" : t.cardBg,
        border: `1px solid ${hov && hoverOrange ? "rgba(197,98,11,0.35)" : t.cardBorder}`,
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderRadius: 20,
        transform: hov ? "translateY(-5px)" : "none",
        transition: "all 0.3s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ── Orange gradient button ─────────────────────────────────────────
export const BtnPrimary = ({ children, href, onClick, style = {} }) => {
  const Tag = href ? "a" : "button";
  const handleClick = (e) => {
    if (href && href.startsWith("/") && !href.startsWith("//")) {
      e.preventDefault();
      window.history.pushState(null, "", href);
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo(0, 0);
    }
    if (onClick) onClick(e);
  };
  return (
    <Tag href={href} onClick={handleClick} style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "13px 28px", borderRadius: 12,
      background: "linear-gradient(135deg,#C5620B,#6A2B09)",
      color: "#fff", fontWeight: 700, fontSize: 14,
      textDecoration: "none", border: "none", cursor: "pointer",
      boxShadow: "0 8px 28px rgba(197,98,11,0.35)",
      transition: "transform 0.2s,box-shadow 0.2s",
      ...style,
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(197,98,11,0.5)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(197,98,11,0.35)"; }}
    >{children}</Tag>
  );
};

// ── Ghost button ───────────────────────────────────────────────────
export const BtnGhost = ({ children, href, onClick, style = {} }) => {
  const { t } = useTheme();
  const Tag = href ? "a" : "button";
  const handleClick = (e) => {
    if (href && href.startsWith("/") && !href.startsWith("//")) {
      e.preventDefault();
      window.history.pushState(null, "", href);
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo(0, 0);
    }
    if (onClick) onClick(e);
  };
  return (
    <Tag href={href} onClick={handleClick} style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "13px 28px", borderRadius: 12,
      background: t.surface, border: `1px solid ${t.border}`,
      color: t.textPrimary, fontWeight: 600, fontSize: 14,
      textDecoration: "none", cursor: "pointer",
      transition: "background 0.2s",
      ...style,
    }}
      onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover}
      onMouseLeave={e => e.currentTarget.style.background = t.surface}
    >{children}</Tag>
  );
};

// ── SPA-aware link wrapper ─────────────────────────────────────────
// Use this inside non-router components to navigate without page reload
export const NavLink = ({ to, children, style = {}, ...rest }) => {
  // We'll resolve navigate lazily to avoid circular imports
  const handleClick = (e) => {
    if (to && to.startsWith("/") && !to.startsWith("//")) {
      e.preventDefault();
      window.history.pushState(null, "", to);
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo(0, 0);
    }
  };
  return (
    <a href={to} onClick={handleClick} style={style} {...rest}>
      {children}
    </a>
  );
};
