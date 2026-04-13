import { useEffect, useRef } from "react";
import { SLIDER_CARDS, icons } from "../constants";
import { Icon, SectionLabel, SectionHeading } from "./ui";
import { useTheme } from "../context/ThemeContext";

const DOUBLED = [...SLIDER_CARDS, ...SLIDER_CARDS];

export default function WhatWeDoSlider() {
  const { t } = useTheme();
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let pos = 0, raf;
    const step = () => {
      pos -= 0.6;
      const half = track.scrollWidth / 2;
      if (Math.abs(pos) >= half) pos = 0;
      track.style.transform = `translateX(${pos}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section style={{ padding: "100px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px 48px", textAlign: "center" }}>
        <SectionLabel>What We Do</SectionLabel>
        <SectionHeading>Built for every technology need</SectionHeading>
      </div>

      <div style={{ overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 100, zIndex: 2, background: `linear-gradient(to right,${t.sliderFade},transparent)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 100, zIndex: 2, background: `linear-gradient(to left,${t.sliderFade},transparent)`, pointerEvents: "none" }} />

        <div ref={trackRef} style={{ display: "flex", gap: 20, width: "max-content", willChange: "transform" }}>
          {DOUBLED.map((card, i) => (
            <div key={i} style={{
              width: 260, padding: "28px 24px", borderRadius: 20,
              background: t.cardBg, border: `1px solid ${t.cardBorder}`,
              backdropFilter: "blur(16px)", flexShrink: 0, transition: "transform 0.3s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}>
              <div style={{
                width: 48, height: 28, borderRadius: 14,
                background: `linear-gradient(135deg,${card.color}55,${card.color}22)`,
                border: `1px solid ${card.color}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 18, color: card.color,
              }}>
                <Icon d={icons[card.icon]} size={22} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary, marginBottom: 6 }}>{card.title}</h3>
              <p style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>{card.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
