import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTheme } from "../context/ThemeContext";

export default function PageLayout({ children }) {
  const { bgGradient, t } = useTheme();
  return (
    <div style={{ minHeight: "100vh", background: bgGradient, color: t.textPrimary }}>
      <Navbar />
      <main style={{ paddingTop: 68 }} className="page-enter">
        {children}
      </main>
      <Footer />
    </div>
  );
}
