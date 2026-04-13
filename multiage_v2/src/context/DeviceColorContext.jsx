import { createContext, useContext, useState } from "react";
import { DEVICE_COLORS } from "../constants";

// ── Context ────────────────────────────────────────────────────────────────────
const DeviceColorContext = createContext(null);

// ── Provider ───────────────────────────────────────────────────────────────────
export function DeviceColorProvider({ children }) {
  const [glowColor, setGlowColor] = useState(DEVICE_COLORS.midnight.glow);

  const setDeviceColor = (colorKey) => {
    const entry = DEVICE_COLORS[colorKey];
    if (entry) setGlowColor(entry.glow);
  };

  const setGlowDirect = (glowValue) => setGlowColor(glowValue);

  return (
    <DeviceColorContext.Provider value={{ glowColor, setDeviceColor, setGlowDirect }}>
      {children}
    </DeviceColorContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useDeviceColor() {
  const ctx = useContext(DeviceColorContext);
  if (!ctx) throw new Error("useDeviceColor must be used inside <DeviceColorProvider>");
  return ctx;
}
