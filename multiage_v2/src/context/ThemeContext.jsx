import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("theme-light", isLight);
  }, [isLight]);

  const toggleTheme = () => setIsLight((l) => !l);

  const bgGradient = isLight
    ? "linear-gradient(160deg,#fff5eb 0%,#fdefd6 25%,#f7e4c4 50%,#fff8f2 100%)"
    : "linear-gradient(160deg,#0c0603 0%,#1a0800 25%,#110500 55%,#040404 100%)";

  const t = {
    textPrimary:   isLight ? "#1a0a00"                : "#f5f0e8",
    textSecondary: isLight ? "#4a2210"                : "rgba(245,240,232,0.72)",
    textMuted:     isLight ? "#7a4525"                : "rgba(245,240,232,0.48)",
    surface:       isLight ? "rgba(255,255,255,0.88)" : "rgba(17,17,17,0.82)",
    surfaceHover:  isLight ? "rgba(255,248,240,0.98)" : "rgba(28,28,28,0.92)",
    border:        isLight ? "rgba(106,43,9,0.16)"    : "rgba(255,255,255,0.10)",
    cardBg:        isLight ? "rgba(255,255,255,0.92)" : "rgba(18,18,18,0.88)",
    cardBorder:    isLight ? "rgba(106,43,9,0.16)"    : "rgba(255,255,255,0.10)",
    navBg:         isLight ? "rgba(255,245,235,0.92)" : "rgba(12,6,3,0.86)",
    inputBg:       isLight ? "#ffffff"                : "#111827",
    inputBorder:   isLight ? "rgba(106,43,9,0.22)"    : "rgba(255,255,255,0.14)",
    sliderFade:    isLight ? "#fff5eb"                : "#0c0603",
    badgeBg:       isLight ? "rgba(106,43,9,0.09)"    : "rgba(255,255,255,0.08)",
  };

  return (
    <ThemeContext.Provider value={{ isLight, toggleTheme, bgGradient, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside <ThemeProvider>");
  return ctx;
}
