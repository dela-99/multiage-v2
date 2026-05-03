import { useEffect, useMemo, useState } from "react";
import ChangePasswordForm from "../../components/ChangePasswordForm";
import RoleDashboardLayout, { StatIcon } from "../../components/admin/RoleDashboardLayout";
import {
  InventorySection,
  MetricOverview,
  OrdersSection,
  ProductManagerSection,
  SettingsSection,
  SimpleInfoSection,
} from "../../components/admin/roleSections";
import { comparePeriods, inRange } from "../../components/admin/dashboardUtils";
import { useAdminResources } from "../../hooks/useAdminResources";
import { api } from "../../lib/api";

function useWindowSize() {
  const [width, setWidth] = useState(() => 
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return width;
}

export default function AdministratorDashboard({ role, token, user }) {
  const [rangeDays, setRangeDays] = useState(30);
  const [creating, setCreating] = useState(false);
  const viewportWidth = useWindowSize();
  const { products, orders, loading, error } = useAdminResources(token, { products: true, orders: true });
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    setProductList(products || []);
  }, [products]);

  const filteredOrders = useMemo(() => (orders ?? []).filter((order) => inRange(order.createdAt, rangeDays)), [orders, rangeDays]);

  const cards = [
    { label: "Catalog Size", value: String(productList.length), subtitle: "Live backend products", change: 0, icon: <StatIcon type="shield" /> },
    { label: "Active Orders", value: String(filteredOrders.length), subtitle: `Last ${rangeDays} days`, change: comparePeriods(orders, () => 1, rangeDays), icon: <StatIcon type="orders" /> },
    { label: "Inventory Lines", value: String(productList.filter((item) => Number(item.stock || 0) > 0).length), subtitle: "Items in stock", change: 0, icon: <StatIcon type="balance" /> },
  ];

  const sections = {
    Dashboard: <MetricOverview cards={cards} />,
    Products: (
      <ProductManagerSection
        products={productList}
        token={token}
        creating={creating}
        viewportWidth={viewportWidth}
        onCreateProduct={async (payload) => {
          try {
            setCreating(true);
            const created = await api.createProduct(payload, token);
            setProductList((current) => [created, ...current]);
            return created;
          } catch (err) {
            console.error("Error creating product:", err);
            alert("Failed to create product. Please try again.");
            throw err;
          } finally {
            setCreating(false);
          }
        }}
      />
    ),
    Inventory: <InventorySection products={productList} />,
    Orders: <OrdersSection orders={filteredOrders} title="Managed Orders" description="Orders currently visible to the administrative operations team." />,
    Users: <SimpleInfoSection title="Users" description="Administrative access visibility." body="This area is reserved for controlled user and role governance. Backend RBAC remains the source of truth even when the frontend workspace evolves." />,
    Settings: <SettingsSection token={token} ChangePasswordForm={ChangePasswordForm} />,
  };

  return (
    <RoleDashboardLayout
      role={role}
      title="Administrator Dashboard"
      subtitle={`Welcome back, ${user?.name || "Administrator"}. This workspace focuses on catalog operations, stock, and order coordination.`}
      loading={loading}
      error={error}
      sections={sections}
      renderSection={(key, map) => map[key] || map.Dashboard}
    />
  );
}
