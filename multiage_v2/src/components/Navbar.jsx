import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "../router";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ChangePasswordForm from "./ChangePasswordForm";

/* ── Hardware added; Login handled via separate button ───────────── */
const NAV_LINKS = [
  { label: "Home",       href: "/" },
  { label: "Store",      href: "/store" },
  { label: "Networking", href: "/networking" },
  { label: "Software",   href: "/software-development" },
  { label: "Hardware",   href: "/hardware" },
  { label: "Studios",   href: "/services" },
  { label: "Contact",    href: "/contact" },
];

const ADMIN_ROLES = new Set(["admin", "ceo", "administrator", "cyber_it", "finance", "secretary", "graphics", "media"]);

function HamburgerIcon({ open }) {
  const bar = {
    display: "block", width: 20, height: 2, borderRadius: 2,
    background: "currentColor", transformOrigin: "center",
    transition: "transform 0.38s cubic-bezier(0.23,1,0.32,1), opacity 0.25s ease",
  };
  return (
    <span style={{ display: "flex", flexDirection: "column", gap: 5, width: 20 }}>
      <span style={{ ...bar, transform: open ? "translateY(7px) rotate(45deg)" : "none" }} />
      <span style={{ ...bar, opacity: open ? 0 : 1, transform: open ? "scaleX(0)" : "none" }} />
      <span style={{ ...bar, transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }} />
    </span>
  );
}

function ThemeIconAnim({ isLight }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      transition: "transform 0.55s cubic-bezier(0.34,1.56,0.64,1)",
      transform: isLight ? "rotate(0deg) scale(1)" : "rotate(200deg) scale(0.85)",
    }}>
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {isLight
          ? <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          : <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z" />
        }
      </svg>
    </span>
  );
}

function CartIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.76L20 7H7.2" />
    </svg>
  );
}

function NavPill({ link, t, isLight, currentPath, navigate }) {
  const active = currentPath === link.href;
  const [hov, setHov] = useState(false);
  return (
    <a
      href={link.href}
      onClick={e => { e.preventDefault(); navigate(link.href); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize: 13, fontWeight: 500, letterSpacing: 0.3,
        padding: "7px 13px", borderRadius: 100,
        color:      active ? "#C5620B" : hov ? (isLight ? "#6A2B09" : "#fff") : t.textSecondary,
        background: active ? "rgba(197,98,11,0.12)" : hov ? t.surfaceHover : "transparent",
        border:     active ? "1px solid rgba(197,98,11,0.3)" : "1px solid transparent",
        textDecoration: "none", transition: "all 0.22s ease", whiteSpace: "nowrap",
      }}
    >{link.label}</a>
  );
}

function MobileNavItem({ link, t, onClose, navigate }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={link.href}
      onClick={e => { e.preventDefault(); navigate(link.href); onClose(); }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center",
        padding: "13px 16px", borderRadius: 12,
        fontSize: 15, fontWeight: 500, textDecoration: "none",
        color:      hov ? "#C5620B" : t.textPrimary,
        background: hov ? "rgba(197,98,11,0.08)" : "transparent",
        transition: "all 0.2s ease",
        transform:  hov ? "translateX(4px)" : "translateX(0)",
      }}
    >{link.label}</a>
  );
}

function Logo({ navigate, t }) {
  return (
    <a href="/" onClick={e => { e.preventDefault(); navigate("/"); }}
      style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
      <img
        src="/assets/logo.png" alt="Multiage logo"
        onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
        style={{ width: 36, height: 36, borderRadius: 8, objectFit: "contain", flexShrink: 0,
          filter: "drop-shadow(0 0 4px rgba(197,98,11,0.35))" }}
      />
      <div style={{ display: "none", width: 36, height: 36, borderRadius: 10,
        background: "linear-gradient(135deg,#C5620B,#6A2B09)",
        alignItems: "center", justifyContent: "center",
        fontWeight: 800, fontSize: 16, color: "#fff", flexShrink: 0 }}>M</div>
      <span style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontWeight: 700, fontSize: 17, letterSpacing: -0.3, color: t.textPrimary, display: "block",
      }}>
        Multiage <span style={{ color: "#C5620B" }}>Technologies</span>
      </span>
    </a>
  );
}

function PasswordModal({ token, onClose }) {
  const modalRoot = typeof document !== "undefined" ? document.body : null;

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwd-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5000,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{`
        @keyframes modalEnter {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          maxHeight: "90vh",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: 24,
          padding: "24px",
          background: "rgba(30, 30, 30, 0.95)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          animation: "modalEnter 0.3s ease-out",
          position: "relative",
          color: "#ffffff",
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 12 }}>
          <h2 id="pwd-modal-title" style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.5px" }}>
            Change password
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              border: "none",
              background: "rgba(255, 255, 255, 0.1)",
              cursor: "pointer",
              fontSize: 32,
              lineHeight: 1,
              color: "#ffffff",
              width: 44,
              height: 44,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
          >
            ×
          </button>
        </div>
        <p style={{ margin: "0 0 24px", fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
          Enter your current password, then choose a new one (at least 6 characters).
        </p>
        <ChangePasswordForm token={token} />
      </div>
    </div>,
    modalRoot
  );
}

/* ── Tiny person icon for Login button ───────────────────────────── */
function PersonIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN NAVBAR
   ════════════════════════════════════════════════════════════════════ */
export default function Navbar() {
  const { isLight, toggleTheme, t } = useTheme();
  const { user, token, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const navigate     = useNavigate();
  const { pathname } = useLocation();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [pwdOpen,  setPwdOpen]    = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // UX: Prevent background scroll when mobile menu or modals are active
  useEffect(() => {
    if (menuOpen || pwdOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen, pwdOpen]);

  // UX: Support hardware/swipe back button to close active overlays
  useEffect(() => {
    if (menuOpen || pwdOpen) {
      const handlePopState = () => {
        setMenuOpen(false);
        setPwdOpen(false);
      };
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [menuOpen, pwdOpen]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const fn = () => setIsDropdownOpen(false);
    window.addEventListener("click", fn);
    return () => window.removeEventListener("click", fn);
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 860) setMenuOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const iconBtn = {
    width: 38, height: 38, borderRadius: "50%",
    background: t.surface, border: `1px solid ${t.border}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", color: t.textPrimary,
    transition: "all 0.3s ease", outline: "none", flexShrink: 0,
  };

  const onLoginPage = pathname === "/login";
  const isAdminUser = ADMIN_ROLES.has(String(user?.role || "").toLowerCase());

  const navActionPillBase = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 16px",
    background: t.surface,
    border: `1px solid ${t.border}`,
    borderRadius: 100,
    fontSize: 13,
    fontWeight: 600,
    color: t.textSecondary,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.25s ease",
    position: "relative",
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "blur(0px)",
      WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "blur(0px)",
      background: scrolled ? t.navBg : "transparent",
      borderBottom: scrolled ? `1px solid ${t.border}` : "1px solid transparent",
      boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.12)" : "none",
      transition: "all 0.4s ease",
    }}>
      <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, gap: 12 }}>

          {/* Logo */}
          <Logo navigate={navigate} t={t} />

          {/* Centre pill — desktop */}
          <div className="nav-desktop" style={{
            display: "flex", gap: 2, alignItems: "center",
            background: t.surface, border: `1px solid ${t.border}`,
            borderRadius: 100, padding: "5px 8px",
            backdropFilter: "blur(12px)", transition: "all 0.4s ease",
            flexShrink: 1, overflow: "hidden",
          }}>
            {NAV_LINKS.map(link => (
              <NavPill key={link.label} link={link} t={t}
                isLight={isLight} currentPath={pathname} navigate={navigate} />
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => navigate("/cart")}
              aria-label="Open cart"
              style={{
                ...iconBtn,
                position: "relative",
                color: pathname === "/cart" ? "#C5620B" : t.textPrimary,
                border: `1px solid ${pathname === "/cart" ? "rgba(197,98,11,0.35)" : t.border}`,
                background: pathname === "/cart" ? "rgba(197,98,11,0.14)" : t.surface,
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <CartIcon />
              {totalItems > 0 && (
                <span style={{
                  position: "absolute",
                  top: -5,
                  right: -5,
                  minWidth: 18,
                  height: 18,
                  padding: "0 4px",
                  borderRadius: 999,
                  background: "#C5620B",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 800,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 18px rgba(197,98,11,0.35)",
                }}>
                  {totalItems}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {isAdminUser && (
                  <button
                    type="button"
                    onClick={() => navigate("/admin/dashboard")}
                    style={{
                      ...navActionPillBase,
                      background: pathname === "/admin" || pathname === "/admin/dashboard"
                        ? "rgba(197,98,11,0.14)"
                        : t.surface,
                      border: `1px solid ${pathname === "/admin" || pathname === "/admin/dashboard" ? "rgba(197,98,11,0.35)" : t.border}`,
                      color: pathname === "/admin" || pathname === "/admin/dashboard" ? "#C5620B" : t.textSecondary,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = t.surfaceHover; e.currentTarget.style.color = t.textPrimary; e.currentTarget.style.borderColor = "rgba(197,98,11,0.35)"; }}
                    onMouseLeave={e => {
                      const isDashboardPath = pathname === "/admin" || pathname === "/admin/dashboard";
                      e.currentTarget.style.background = isDashboardPath ? "rgba(197,98,11,0.14)" : t.surface;
                      e.currentTarget.style.color = isDashboardPath ? "#C5620B" : t.textSecondary;
                      e.currentTarget.style.borderColor = isDashboardPath ? "rgba(197,98,11,0.35)" : t.border;
                    }}
                  >
                    Dashboard
                  </button>
                )}
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 100,
                      background: "rgba(197,98,11,0.12)",
                      border: "1px solid rgba(197,98,11,0.18)",
                      color: t.textPrimary,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      display: "flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    {user?.name || "Account"}
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      background: t.cardBg,
                      border: `1px solid ${t.border}`,
                      borderRadius: 12,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                      padding: "6px",
                      minWidth: "160px",
                      zIndex: 1000,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2
                    }}>
                      <button
                        onClick={() => { setPwdOpen(true); setIsDropdownOpen(false); }}
                        style={{ textAlign: "left", padding: "10px 12px", borderRadius: 8, background: "transparent", border: "none", color: t.textPrimary, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        Change password
                      </button>
                      <button
                        onClick={() => { handleLogout(); setIsDropdownOpen(false); }}
                        style={{ textAlign: "left", padding: "10px 12px", borderRadius: 8, background: "transparent", border: "none", color: t.textPrimary, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/my-orders")}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "7px 16px",
                    background: pathname === "/my-orders" ? "rgba(197,98,11,0.14)" : t.surface,
                    border: `1px solid ${pathname === "/my-orders" ? "rgba(197,98,11,0.35)" : t.border}`,
                    borderRadius: 100,
                    fontSize: 13, fontWeight: 600, color: pathname === "/my-orders" ? "#C5620B" : t.textSecondary,
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = t.surfaceHover; e.currentTarget.style.color = t.textPrimary; e.currentTarget.style.borderColor = "rgba(197,98,11,0.35)"; }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = pathname === "/my-orders" ? "rgba(197,98,11,0.14)" : t.surface;
                    e.currentTarget.style.color = pathname === "/my-orders" ? "#C5620B" : t.textSecondary;
                    e.currentTarget.style.borderColor = pathname === "/my-orders" ? "rgba(197,98,11,0.35)" : t.border;
                  }}
                >
                  My orders
                </button>
              </div>
            ) : (
              <a
                href="/login"
                onClick={e => { e.preventDefault(); navigate("/login"); }}
                className="nav-desktop"
                style={{
                  ...navActionPillBase,
                  textDecoration: "none", whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = t.surfaceHover; e.currentTarget.style.color = t.textPrimary; e.currentTarget.style.borderColor = "rgba(197,98,11,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = t.surface; e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.borderColor = t.border; }}
              >
                <PersonIcon /> Login
              </a>
            )}

            {/* Theme toggle — always visible */}
            <button onClick={toggleTheme} aria-label="Toggle dark/light mode" style={iconBtn}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
              <ThemeIconAnim isLight={isLight} />
            </button>

            {/* Hamburger — mobile/tablet only */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="nav-mobile" aria-label="Toggle menu"
              style={{
                ...iconBtn, borderRadius: 10,
                background: menuOpen ? "rgba(197,98,11,0.18)" : t.surface,
                border: `1px solid ${menuOpen ? "rgba(197,98,11,0.4)" : t.border}`,
                color: menuOpen ? "#C5620B" : t.textPrimary,
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / tablet drawer */}
      <div style={{
        overflow: "hidden",
        maxHeight: menuOpen ? 640 : 0,
        opacity:   menuOpen ? 1   : 0,
        transition: "max-height 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease",
      }}>
        <div style={{
          margin: "0 16px 16px", padding: "8px", borderRadius: 18,
          background: t.navBg, border: `1px solid ${t.border}`,
          backdropFilter: "blur(28px)", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          display: "flex", flexDirection: "column", gap: 2,
        }}>
          {NAV_LINKS.map(link => (
            <MobileNavItem key={link.label} link={link} t={t}
              navigate={navigate} onClose={() => setMenuOpen(false)} />
          ))}

          <div style={{ height: 1, background: t.border, margin: "6px 8px" }} />

          {isAuthenticated ? (
            <>
              {isAdminUser && (
                <button
                  type="button"
                  onClick={() => { navigate("/admin/dashboard"); setMenuOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    width: "100%",
                    padding: "13px 16px", borderRadius: 12,
                    fontSize: 14, fontWeight: 600,
                    color: t.textPrimary, background: t.surface, border: `1px solid ${t.border}`,
                    transition: "background 0.2s",
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = t.surfaceHover; }}
                  onMouseLeave={e => { e.currentTarget.style.background = t.surface; }}
                >
                  Dashboard
                </button>
              )}
              <button
                type="button"
                onClick={() => { navigate("/cart"); setMenuOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%",
                  padding: "13px 16px", borderRadius: 12,
                  fontSize: 14, fontWeight: 600,
                  color: t.textPrimary, background: t.surface, border: `1px solid ${t.border}`,
                  transition: "background 0.2s",
                  cursor: "pointer", fontFamily: "inherit",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = t.surfaceHover; }}
                onMouseLeave={e => { e.currentTarget.style.background = t.surface; }}
              >
                <CartIcon /> Cart {totalItems > 0 ? `(${totalItems})` : ""}
              </button>
              <button
                type="button"
                onClick={() => { navigate("/my-orders"); setMenuOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%",
                  padding: "13px 16px", borderRadius: 12,
                  fontSize: 14, fontWeight: 600,
                  color: t.textPrimary, background: t.surface, border: `1px solid ${t.border}`,
                  transition: "background 0.2s",
                  cursor: "pointer", fontFamily: "inherit",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = t.surfaceHover; }}
                onMouseLeave={e => { e.currentTarget.style.background = t.surface; }}
              >
                My orders
              </button>
              <button
                type="button"
                onClick={() => { setPwdOpen(true); setMenuOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%",
                  padding: "13px 16px", borderRadius: 12,
                  fontSize: 14, fontWeight: 600,
                  color: t.textPrimary, background: t.surface, border: `1px solid ${t.border}`,
                  transition: "background 0.2s",
                  cursor: "pointer", fontFamily: "inherit",
                }}
                onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover}
                onMouseLeave={e => e.currentTarget.style.background = t.surface}
              >
                Change password
              </button>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", border: "none",
                  padding: "13px 16px", borderRadius: 12,
                  fontSize: 14, fontWeight: 600,
                  color: t.textPrimary, background: t.surface, border: `1px solid ${t.border}`,
                  transition: "background 0.2s",
                  cursor: "pointer", fontFamily: "inherit",
                }}
                onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover}
                onMouseLeave={e => e.currentTarget.style.background = t.surface}
              >
                Logout
              </button>
            </>
          ) : (
            !onLoginPage && (
              <>
                <button
                  type="button"
                  onClick={() => { navigate("/cart"); setMenuOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    width: "100%",
                    padding: "13px 16px", borderRadius: 12,
                    fontSize: 14, fontWeight: 600,
                    color: t.textPrimary, background: t.surface, border: `1px solid ${t.border}`,
                    transition: "background 0.2s",
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover}
                  onMouseLeave={e => e.currentTarget.style.background = t.surface}
                >
                  <CartIcon /> Cart {totalItems > 0 ? `(${totalItems})` : ""}
                </button>
                <a
                  href="/login"
                  onClick={e => { e.preventDefault(); navigate("/login"); setMenuOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "13px 16px", borderRadius: 12,
                    fontSize: 14, fontWeight: 600,
                    color: t.textPrimary, textDecoration: "none",
                    background: t.surface, border: `1px solid ${t.border}`,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover}
                  onMouseLeave={e => e.currentTarget.style.background = t.surface}
                >
                  <PersonIcon /> Login
                </a>
              </>
            )
          )}
        </div>
      </div>

      {pwdOpen && isAuthenticated && token && (
        <PasswordModal token={token} onClose={() => setPwdOpen(false)} />
      )}
    </nav>
  );
}
