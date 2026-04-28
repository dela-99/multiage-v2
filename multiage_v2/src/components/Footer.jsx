import { icons } from "../constants";
import { Icon } from "./ui";
import { useTheme } from "../context/ThemeContext";

/* ── Logo — matches Navbar logo component ────────────────────────── */
function FooterLogo({ t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <img
        src="/assets/logo.png"
        alt="Multiage logo"
        onError={e => {
          e.currentTarget.style.display = "none";
          e.currentTarget.nextSibling.style.display = "flex";
        }}
        style={{
          width: 34, height: 34, borderRadius: 8,
          objectFit: "contain", flexShrink: 0,
          filter: "drop-shadow(0 0 4px rgba(197,98,11,0.3))",
        }}
      />
      {/* Fallback square */}
      <div style={{
        display: "none", width: 34, height: 34, borderRadius: 10,
        background: "linear-gradient(135deg,#C5620B,#6A2B09)",
        alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: 15, color: "#fff", flexShrink: 0,
      }}>M</div>

      <span style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 700, fontSize: 17, letterSpacing: -0.3,
        color: t.textPrimary,
      }}>
        Multiage <span style={{ color: "#C5620B" }}>Technologies</span>
      </span>
    </div>
  );
}

const COMPANY_SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/multiage_tech_01", icon: "instagram", aria: "Follow us on Instagram" },
  { label: "X (Twitter)", href: "https://x.com/multiage_tech", icon: "twitter", aria: "Follow us on X (Twitter)" },
  { label: "TikTok", href: "https://www.tiktok.com/@multiage_tech_01", icon: "tiktok", aria: "Follow us on TikTok" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61570689230114", icon: "facebook", aria: "Follow us on Facebook" },
  { label: "WhatsApp", href: "https://whatsapp.com/channel/0029VbBFSR7BFLgVK4WXDY3w", icon: "whatsapp", aria: "Join our WhatsApp Channel" },
];

const FOOTER_COLS = [
  { heading: "Company",  links: [["About Us","#"],["Careers","#"],["Blog","#"],["Press","#"]] },
  { heading: "Services", links: [["Electronics Store","/store"],["Software Dev","/software-development"],["Networking","/networking"],["Creative Studio","/services"]] },
  { heading: "Contact",  links: [["WhatsApp","#"],["Email Us","#"],["Book a Call","/contact"],["Accra, Ghana","#"]] },
];

function navLink(href) {
  if (href.startsWith("/")) {
    window.history.pushState(null, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo(0, 0);
  }
}

export default function Footer() {
  const { t } = useTheme();

  return (
    <footer style={{ borderTop: `1px solid ${t.border}`, padding: "60px 0 32px" }}>
      <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 56 }}
          className="footer-grid"
        >

          {/* Brand column */}
          <div>
            <FooterLogo t={t} />

            <p style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.8, maxWidth: 300 }}>
              Integrated IT &amp; electronics solutions for individuals and businesses.
              Premium devices, digital products, and technology services.
            </p>

            {/* Social icons — each wrapped in real anchor with target="_blank" */}
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              {COMPANY_SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.aria}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: t.surface, border: `1px solid ${t.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: t.textMuted, transition: "all 0.25s",
                    textDecoration: "none",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background   = "rgba(197,98,11,0.14)";
                    e.currentTarget.style.color        = "#C5620B";
                    e.currentTarget.style.borderColor  = "rgba(197,98,11,0.35)";
                    e.currentTarget.style.transform    = "translateY(-3px)";
                    e.currentTarget.style.boxShadow    = "0 6px 16px rgba(197,98,11,0.2)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background   = t.surface;
                    e.currentTarget.style.color        = t.textMuted;
                    e.currentTarget.style.borderColor  = t.border;
                    e.currentTarget.style.transform    = "none";
                    e.currentTarget.style.boxShadow    = "none";
                  }}
                >
                  <Icon d={icons[s.icon]} size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map(col => (
            <div key={col.heading}>
              <h4 style={{
                fontSize: 12, fontWeight: 700, letterSpacing: 2,
                color: "#C5620B", textTransform: "uppercase", marginBottom: 20,
              }}>
                {col.heading}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    onClick={e => { e.preventDefault(); navLink(href); }}
                    style={{ fontSize: 13, color: t.textMuted, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = t.textPrimary}
                    onMouseLeave={e => e.target.style.color = t.textMuted}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: `1px solid ${t.border}`, paddingTop: 24,
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 12,
        }}>
          <p style={{ fontSize: 12, color: t.textMuted }}>
            © {new Date().getFullYear()} Multiage Technologies. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(txt => (
              <a
                key={txt}
                href="#"
                style={{ fontSize: 12, color: t.textMuted, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = t.textPrimary}
                onMouseLeave={e => e.target.style.color = t.textMuted}
              >
                {txt}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
