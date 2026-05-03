import { useMemo } from "react";
import RoleDashboardLayout, { StatIcon } from "../../components/admin/RoleDashboardLayout";
import { MetricOverview, ProductListSection, SimpleInfoSection } from "../../components/admin/roleSections";
import { useAdminResources } from "../../hooks/useAdminResources";

export default function GraphicsDashboard({ role, token, user }) {
  const { products, loading, error } = useAdminResources(token, { products: true });

  const cards = useMemo(() => [
    { label: "Catalog Assets", value: String((products || []).length), subtitle: "Products available for content use", change: 0, icon: <StatIcon type="media" /> },
    { label: "Branded Images", value: String((products || []).filter((product) => Boolean(product.image)).length), subtitle: "Products with image coverage", change: 0, icon: <StatIcon type="shield" /> },
    { label: "Content Queue", value: String((products || []).filter((product) => !product.image).length), subtitle: "Products still needing media support", change: 0, icon: <StatIcon type="orders" /> },
  ], [products]);

  const sections = {
    Dashboard: <MetricOverview cards={cards} />,
    "Media / Content": <ProductListSection products={products} />,
    DashboardInfo: <SimpleInfoSection title="Creative Workspace" description="Graphics and media access is intentionally focused." body="This dashboard is designed for image coverage, catalog readiness, and content preparation without exposing orders, revenue, or customer communications." iconType="media" />,
  };

  return (
    <RoleDashboardLayout
      role={role}
      title="Graphics Dashboard"
      subtitle={`Welcome back, ${user?.name || "Graphics Team"}. This workspace is dedicated to media readiness and content support for the storefront.`}
      loading={loading}
      error={error}
      sections={sections}
      renderSection={(key, map) => map[key] || map["Media / Content"] || map.Dashboard}
    />
  );
}
