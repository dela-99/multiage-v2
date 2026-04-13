import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhatWeDoSlider from "../components/WhatWeDoSlider";
import ServicesGrid from "../components/ServicesGrid";
import OurSolutions from "../components/OurSolutions";
import CtaBanner from "../components/CtaBanner";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import { useDeviceColor } from "../context/DeviceColorContext";

export default function Home() {
  const { bgGradient, t } = useTheme();
  const { glowColor } = useDeviceColor();

  return (
    <div style={{ minHeight: "100vh", background: bgGradient, color: t.textPrimary, position: "relative" }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse 60% 50% at 80% 30%,${glowColor}15,transparent)`,
        transition: "background 1s ease",
      }} />
      <Navbar />
      <main style={{ position: "relative", zIndex: 1 }} className="page-enter">
        <Hero />
        <WhatWeDoSlider />
        <ServicesGrid />
        <OurSolutions />
        <CtaBanner />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
