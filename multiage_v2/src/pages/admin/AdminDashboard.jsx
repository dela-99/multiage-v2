import { useEffect, useMemo, useState } from "react";
import ChangePasswordForm from "../../components/ChangePasswordForm";
import RoleDashboardLayout, { StatIcon } from "../../components/admin/RoleDashboardLayout";
import {
  InventorySection,
  MessagesSection,
  MetricOverview,
  OrdersSection,
  ProductManagerSection,
  SettingsSection,
  SimpleInfoSection,
} from "../../components/admin/roleSections";
import { comparePeriods, inRange } from "../../components/admin/dashboardUtils";
import { useAdminResources } from "../../hooks/useAdminResources";
import { api } from "../../lib/api";
import { getSidebarItems } from "../../config/adminSidebar";

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
  const { products, orders, messages, loading, error } = useAdminResources(token, { products: true, orders: true, messages: true });
  const [productList, setProductList] = useState([]);

  // RBAC logic for UI visibility
  const isFullAdmin = ["ceo", "cyber_it", "administrator"].includes(role?.toLowerCase());
  const isGraphicsMedia = role?.toLowerCase() === "graphics" || role?.toLowerCase() === "graphics_media";
  const canManageOrders = isFullAdmin || ["secretary", "finance"].includes(role?.toLowerCase());
  const canManageMessages = role?.toLowerCase() === "administrator" || role?.toLowerCase() === "secretary";

  useEffect(() => {
    setProductList(products || []);
  }, [products]);

  const filteredOrders = useMemo(() => (orders ?? []).filter((order) => inRange(order.createdAt, rangeDays)), [orders, rangeDays]);
  const unreadCount = useMemo(() => (messages ?? []).filter((message) => message.status === "unread").length, [messages]);
  const sidebarItems = useMemo(() => {
    return getSidebarItems(role).map((item) => (
      item.key === "Communications" ? { ...item, unreadCount } : item
    ));
  }, [role, unreadCount]);

  const cards = useMemo(() => {
    const baseCards = [
      { label: "Catalog Size", value: String(productList.length), subtitle: "Live backend products", change: 0, icon: <StatIcon type="shield" /> },
    ];

    // Only show operational/financial stats to full admins or secretaries/finance
    if (!isGraphicsMedia) {
      baseCards.push(
        { label: "Active Orders", value: String(filteredOrders.length), subtitle: `Last ${rangeDays} days`, change: comparePeriods(orders, () => 1, rangeDays), icon: <StatIcon type="orders" /> },
        { label: "Inventory Lines", value: String(productList.filter((item) => Number(item.stock || 0) > 0).length), subtitle: "Items in stock", change: 0, icon: <StatIcon type="balance" /> }
      );
    }

    return baseCards;
  }, [productList, filteredOrders, orders, rangeDays, isGraphicsMedia]);

  const sections = {
    Dashboard: <MetricOverview cards={cards} />,
  };

  if (isFullAdmin || isGraphicsMedia) {
    sections.Products = (
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
    );
  }

  if (isFullAdmin) {
    sections.Inventory = <InventorySection products={productList} />;
    sections.Users = <SimpleInfoSection title="Users" description="Administrative access visibility." body="This area is reserved for controlled user and role governance. Backend RBAC remains the source of truth even when the frontend workspace evolves." />;
  }

  if (canManageOrders) {
    sections.Orders = <OrdersSection orders={filteredOrders} title="Managed Orders" description="Orders currently visible to the administrative operations team." />;
  }

  if (canManageMessages) {
    sections.Communications = <MessagesSection messages={messages} token={token} loading={loading} unreadCount={unreadCount} />;
  }

  sections.Settings = <SettingsSection token={token} ChangePasswordForm={ChangePasswordForm} />;

  const dashboardTitle = isGraphicsMedia ? "Graphics & Media Workspace" : "Administrator Dashboard";

  return (
    <RoleDashboardLayout
      role={role}
      title={dashboardTitle}
      subtitle={`Welcome back, ${user?.name || "Member"}. Your workspace is tailored to your role's specific responsibilities.`}
      loading={loading}
      error={error}
      sections={sections}
      sidebarItems={sidebarItems}
      renderSection={(key, map) => map[key] || map.Dashboard}
    />
  );
}
