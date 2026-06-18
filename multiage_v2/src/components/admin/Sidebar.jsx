import { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

function MenuIcon({ path }) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

const ICONS = {
  Dashboard: "M3 13h8V3H3v10ZM13 21h8V11h-8v10ZM13 3v6h8V3h-8ZM3 21v-6h8v6H3Z",
  Leads: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2 M16 3.13a4 4 0 0 1 0 7.75 M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  Projects: "M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2Z M12 22V11 M20 6.5l-8 4.5-8-4.5",
  Reports: "M4 19V9 M10 19V5 M16 19v-8 M22 19v-12",
  Users: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2 M16 3.13a4 4 0 0 1 0 7.75 M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  "Media / Content": "M4 7h16 M4 12h10 M4 17h7 M18 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  Communications: "M4 6h16v12H4z M4 7l8 6 8-6",
  Settings: "M12 3v3 M12 18v3 M4.93 4.93l2.12 2.12 M16.95 16.95l2.12 2.12 M3 12h3 M18 12h3 M4.93 19.07l2.12-2.12 M16.95 7.05l2.12-2.12 M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
};

export default function Sidebar({ items, active, onSelect, isMobile, isOpen, onClose }) {
  const { t } = useTheme();

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isOpen]);

  return (
    <>
      {isMobile && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? "visible" : "hidden",
            zIndex: 998,
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          aria-hidden="true"
        />
      )}

      <aside style={{
        width: isMobile ? 280 : "100%",
        background: t.cardBg,
        border: isMobile ? `1px solid ${t.border}` : `1px solid ${t.cardBorder}`,
        borderRadius: isMobile ? 0 : 28,
        padding: 22,
        backdropFilter: "blur(16px)",
        position: isMobile ? "fixed" : "sticky",
        top: isMobile ? 0 : 88,
        left: isMobile ? (isOpen ? 0 : -320) : "auto",
        height: isMobile ? "100vh" : "calc(100vh - 120px)",
        zIndex: 999,
        transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: isMobile && isOpen ? "10px 0 40px rgba(0,0,0,0.2)" : "none",
        overflowY: "auto",
      }}>
        <div style={{ display: isMobile ? "none" : "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <img
            src="/assets/logo-transparent.png"
            alt="Admin Logo"
            className="object-contain"
            style={{
              width: 46,
              height: 46,
              borderRadius: 16,
              boxShadow: "0 14px 24px rgba(197,98,11,0.24)",
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ color: t.textPrimary, fontWeight: 800, fontSize: 17 }}>Multiage</div>
            <div style={{ color: t.textMuted, fontSize: 12 }}>Admin Console</div>
          </div>
        </div>

        <nav style={{ display: "grid", gap: 8 }}>
          {items.map((item) => {
            const activeItem = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onSelect(item.key);
                  if (isMobile) onClose();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 14,
                  width: "100%",
                  textAlign: "left",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: 18,
                  padding: "14px 14px",
                  background: activeItem ? "linear-gradient(135deg,#C5620B,#6A2B09)" : "transparent",
                  color: activeItem ? "#fff" : t.textSecondary,
                  boxShadow: activeItem ? "0 14px 30px rgba(197,98,11,0.22)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <span style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    background: activeItem ? "rgba(255,255,255,0.14)" : "rgba(197,98,11,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <MenuIcon path={ICONS[item.key] || ICONS.Dashboard} />
                  </span>
                  <span style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.label}
                  </span>
                  {item.key === "Communications" && item.unreadCount > 0 && (
                    <span style={{ marginLeft: "auto", background: "#C5620B", color: "#fff", fontSize: 10, padding: "2px 6px", borderRadius: 6, fontWeight: 800 }}>
                      {item.unreadCount}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
