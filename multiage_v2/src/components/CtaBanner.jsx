import { useTheme } from "../context/ThemeContext";
import { Icon, BtnPrimary, BtnGhost } from "./ui";
import { icons } from "../constants";

export default function CtaBanner() {
  const { t } = useTheme();
  return (
    <section style={{ padding: "80px 0" }}>
      <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px" }}>
        <div style={{
          borderRadius: 28, padding: "64px 48px",
          background: "linear-gradient(135deg,rgba(197,98,11,0.18) 0%,rgba(106,43,9,0.22) 100%)",
          border: "1px solid rgba(197,98,11,0.28)",
          backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", gap: 24, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-60px", right: "-60px",
            width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle,rgba(197,98,11,0.3),transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 16px", background: "rgba(197,98,11,0.2)",
            border: "1px solid rgba(197,98,11,0.4)", borderRadius: 100,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C5620B", boxShadow: "0 0 6px #C5620B" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#C5620B", textTransform: "uppercase" }}>Ready to start?</span>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "clamp(28px,4vw,52px)", fontWeight: 900,
            color: t.textPrimary, letterSpacing: -1, maxWidth: 600,
          }}>
            Let's build something great together
          </h2>
          <p style={{ fontSize: 16, color: t.textSecondary, maxWidth: 480, lineHeight: 1.7 }}>
            Whether you need premium devices, a custom website, or a full network setup — our team is ready.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <BtnPrimary href="/contact">
              Get a Free Quote <Icon d={icons.arrow} size={16} />
            </BtnPrimary>
            <BtnGhost href="https://wa.me/23355280311">
              <Icon d={icons.whatsapp} size={16} /> WhatsApp Us
            </BtnGhost>
          </div>
        </div>
      </div>
    </section>
  );
}
