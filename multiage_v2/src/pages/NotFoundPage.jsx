import PageLayout from "../components/PageLayout";
import { BtnPrimary, SectionLabel, PageHeroHeading } from "../components/ui";
import { useTheme } from "../context/ThemeContext";

export default function NotFoundPage() {
  const { t } = useTheme();

  return (
    <PageLayout>
      <section style={{
        maxWidth: 640, margin: "0 auto", padding: "120px 24px 100px",
        textAlign: "center",
      }}>
        <SectionLabel>404</SectionLabel>
        <PageHeroHeading style={{ marginBottom: 16 }}>
          Page not found
        </PageHeroHeading>
        <p style={{ fontSize: 16, color: t.textSecondary, lineHeight: 1.7, marginBottom: 32 }}>
          The link may be broken or the page may have been removed. Try the home page or the store.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <BtnPrimary href="/">Home</BtnPrimary>
          <BtnPrimary href="/store">Store</BtnPrimary>
        </div>
      </section>
    </PageLayout>
  );
}
