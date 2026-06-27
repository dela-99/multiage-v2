import { useTheme } from "../context/ThemeContext";
import { useDeviceColor } from "../context/DeviceColorContext";
import { GlowBlob, Icon, BtnPrimary, BtnGhost } from "./ui";
import { icons, HERO_SERVICES as services } from "../constants";

function ServiceHighlight({ item, t }) {
  return (
    <article style={{
      padding: "18px 20px",
      borderRadius: 20,
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      backdropFilter: "blur(16px)",
      textAlign: "left",
      display: "grid",
      gap: 8,
    }}>
      <div style={{ color: t.textPrimary, fontWeight: 700, fontSize: 15, lineHeight: 1.4 }}>
        {item.label}
      </div>
      <div style={{ color: t.textMuted, fontSize: 13, lineHeight: 1.6 }}>
        {item.sub}
      </div>
    </article>
  );
}

export default function Hero() {
  const { t } = useTheme();
  const { glowColor } = useDeviceColor();

  return (
    <section id="home" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", position: "relative",
      overflow: "hidden", paddingTop: 68,
    }}>
      <GlowBlob color={glowColor} size={700} x="55%" y="45%" opacity={0.18} />
      <GlowBlob color="#C5620B" size={500} x="20%" y="80%" opacity={0.12} />

      <div style={{
        maxWidth: 1260, margin: "0 auto", padding: "0 24px",
        textAlign: "center", position: "relative", zIndex: 2, width: "100%",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 18px", background: "rgba(197,98,11,0.15)",
          border: "1px solid rgba(197,98,11,0.35)", borderRadius: 100, marginBottom: 32,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C5620B", boxShadow: "0 0 6px #C5620B" }} />
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: "#C5620B", textTransform: "uppercase" }}>
            Integrated Technology Solutions
          </span>
        </div>

        <h1 style={{
          fontFamily: "'Dans',Georgia,serif",
          fontSize: "clamp(30px,7vw,72px)", fontWeight: 800,
          lineHeight: 1.0, letterSpacing: -2, marginBottom: 24, color: t.textPrimary,
        }}>
          Integrated IT and <br />
          <span style={{ background: "linear-gradient(135deg,#C5620B,#e8892e,#C5620B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Digital
          </span>{" "}Services
        </h1>

        <p style={{ fontSize: "clamp(15px,2vw,20px)", color: t.textSecondary, maxWidth: 620, margin: "0 auto 48px", lineHeight: 1.7 }}>
          Custom software, networking, creative studio work, and managed IT support built for individuals and businesses.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
          <BtnPrimary href="#solutions">
            Explore Solutions <Icon d={icons.arrow} size={16} />
          </BtnPrimary>
          <BtnGhost href="/contact">Work With Us</BtnGhost>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          maxWidth: 980,
          margin: "0 auto",
          textAlign: "left",
        }}>
          {services.map((item) => (
            <ServiceHighlight key={item.label} item={item} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
