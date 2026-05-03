import { useEffect, useMemo, useState, useRef } from "react";
import PageLayout from "../PageLayout";
import Sidebar from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";
import { getSidebarItems, normalizeAdminRole } from "../../config/adminSidebar";

function useViewport() {
  const [width, setWidth] = useState(() => 
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 150);
    };

    window.addEventListener("resize", onResize);
    
    return () => {
      window.removeEventListener("resize", onResize);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return width;
}

export function StatIcon({ type }) {
  const paths = {
    revenue: "M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7H14.5a3.5 3.5 0 0 1 0 7H6",
    orders: "M7 4h10l1 2h3v2H3V6h3l1-2Z M5 8h14v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8Z",
    income: "M4 18 10 12 14 15 20 7",
    expenses: "M20 17 14 11 10 14 4 6",
    balance: "M4 19V9 M10 19V5 M16 19v-8 M22 19v-12",
    menu: "M4 7h16 M4 12h16 M4 17h16",
    shield: "M12 3l7 4v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V7l7-4Z",
    media: "M4 7h16 M4 12h10 M4 17h7 M18 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  };

  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[type] || paths.menu} />
    </svg>
  );
}

export function fieldStyle(theme) {
  return {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: `1px solid ${theme.inputBorder}`,
    background: theme.inputBg,
    color: theme.textPrimary,
    boxSizing: "border-box",
    fontFamily: "inherit",
  };
}

export function SectionShell({ title, description, children }) {
  const { t } = useTheme();

  return (
    <section style={{
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 28,
      padding: 26,
      backdropFilter: "blur(16px)",
    }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: t.textPrimary, letterSpacing: -0.6 }}>{title}</h2>
        {description && <div style={{ marginTop: 8, fontSize: 13, color: t.textMuted }}>{description}</div>}
      </div>
      {children}
    </section>
  );
}

export default function RoleDashboardLayout({
  role,
  title,
  subtitle,
  loading,
  error,
  sections,
  renderSection,
}) {
  const { t } = useTheme();
  const viewportWidth = useViewport();
  const isMobile = viewportWidth < 980;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarItems = useMemo(() => getSidebarItems(normalizeAdminRole(role)), [role]);
  const [sectionKey, setSectionKey] = useState("");

  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (sidebarItems.length === 0) {
      setSectionKey("");
      return;
    }

    const visibleKeys = new Set(sidebarItems.map((item) => item.key));
    setSectionKey((current) => (visibleKeys.has(current) ? current : sidebarItems[0].key));
  }, [sidebarItems]);

  const selectedItem = sidebarItems.find((item) => item.key === sectionKey) || sidebarItems[0];

  return (
    <PageLayout>
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "84px 20px 96px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "290px 1fr", gap: 24, alignItems: "start" }}>
          <Sidebar
            items={sidebarItems}
            active={sectionKey}
            onSelect={setSectionKey}
            isMobile={isMobile}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div style={{ display: "grid", gap: 22 }}>
            <div style={{
              background: t.cardBg,
              border: `1px solid ${t.cardBorder}`,
              borderRadius: 28,
              padding: "24px 24px",
              backdropFilter: "blur(16px)",
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              alignItems: "center",
              flexWrap: "wrap",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open sidebar menu"
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      border: `1px solid ${t.border}`,
                      background: t.surface,
                      color: t.textPrimary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <StatIcon type="menu" />
                  </button>
                )}
                <div>
                  <div style={{ color: t.textMuted, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 8 }}>
                    {title}
                  </div>
                  <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, color: t.textPrimary, letterSpacing: -0.8 }}>
                    {selectedItem?.label || title}
                  </h1>
                  <div style={{ marginTop: 8, color: t.textSecondary, fontSize: 14, lineHeight: 1.6 }}>
                    {subtitle}
                  </div>
                </div>
              </div>

              <div style={{ minWidth: isMobile ? "100%" : 280 }}>
                <div style={{
                  padding: "14px 16px",
                  borderRadius: 16,
                  background: t.inputBg,
                  border: `1px solid ${t.inputBorder}`,
                  color: t.textMuted,
                  fontSize: 13,
                }}>
                  Role-based dashboard view. Only approved workspace sections are shown for this account.
                </div>
              </div>
            </div>

            {error && (
              <div style={{
                padding: "12px 14px",
                borderRadius: 14,
                background: "rgba(192,57,43,0.12)",
                color: "#c0392b",
                border: "1px solid rgba(192,57,43,0.24)",
              }}>
                {error}
              </div>
            )}

            {loading ? (
              <div style={{
                background: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
                borderRadius: 28,
                padding: "100px 24px",
                textAlign: "center",
                color: t.textMuted,
              }}>
                Loading dashboard...
              </div>
            ) : selectedItem ? (
              renderSection(sectionKey, sections)
            ) : (
              <SectionShell title="Access limited" description="No approved dashboard sections were found for this role.">
                <div style={{ color: t.textSecondary, lineHeight: 1.7 }}>
                  You are not authorised to view this dashboard.
                </div>
              </SectionShell>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
