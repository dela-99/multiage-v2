import { useMemo, useState } from "react";
import ChangePasswordForm from "../../components/ChangePasswordForm";
import RoleDashboardLayout, { StatIcon } from "../../components/admin/RoleDashboardLayout";
import {
  InventorySection,
  MetricOverview,
  OrdersSection,
  ProductListSection,
  SettingsSection,
  SimpleInfoSection,
} from "../../components/admin/roleSections";
import { buildTopProducts, comparePeriods, inRange } from "../../components/admin/dashboardUtils";
import { useAdminResources } from "../../hooks/useAdminResources";

export default function CyberDashboard({ role, token, user }) {
  const [rangeDays, setRangeDays] = useState(30);
  const { products, orders, loading, error } = useAdminResources(token, { products: true, orders: true });
  const filteredOrders = useMemo(() => orders.filter((order) => inRange(order.createdAt, rangeDays)), [orders, rangeDays]);
  const topProducts = useMemo(() => buildTopProducts(filteredOrders, products), [filteredOrders, products]);

  const cards = [
    { label: "Tracked Orders", value: String(filteredOrders.length), subtitle: `Last ${rangeDays} days`, change: comparePeriods(orders, () => 1, rangeDays), icon: <StatIcon type="orders" /> },
    { label: "Catalog Items", value: String(products.length), subtitle: "Live store records", change: 0, icon: <StatIcon type="shield" /> },
    { label: "Systems Coverage", value: "Operational", subtitle: "Tech and catalog oversight", change: 0, icon: <StatIcon type="media" /> },
  ];

  const sections = {
    Dashboard: <MetricOverview cards={cards} topProducts={topProducts} />,
    Products: <ProductListSection products={products} />,
    Inventory: <InventorySection products={products} />,
    Orders: <OrdersSection orders={filteredOrders} title="Operational Orders" description="Order activity visible to the technology and operations team." />,
    Sales: <SimpleInfoSection title="Sales" description="Restricted commercial overview." body="Sales access for Cyber IT is intentionally limited to operational visibility. Sensitive financial breakdowns remain separated into the finance and executive dashboards." />,
    Users: <SimpleInfoSection title="Users" description="System access oversight." body="Use this space for role-aware access reviews, account readiness, and future identity tooling. Backend authorisation still remains the final authority." />,
    "Media / Content": <SimpleInfoSection title="Media / Content" description="Technical support for content systems." body="This dashboard can support media pipelines, upload integrations, and publishing workflows without exposing broader commercial data." iconType="media" />,
    Settings: <SettingsSection token={token} ChangePasswordForm={ChangePasswordForm} />,
  };

  return (
    <RoleDashboardLayout
      role={role}
      title="Cyber IT Dashboard"
      subtitle={`Welcome back, ${user?.name || "Cyber IT"}. This workspace focuses on operational visibility, systems support, and controlled access.`}
      loading={loading}
      error={error}
      sections={sections}
      renderSection={(key, map) => map[key] || map.Dashboard}
    />
  );
}
