import { useMemo, useState } from "react";
import ChangePasswordForm from "../../components/ChangePasswordForm";
import RoleDashboardLayout, { StatIcon } from "../../components/admin/RoleDashboardLayout";
import { MessagesSection, MetricOverview, OrdersSection, SettingsSection } from "../../components/admin/roleSections";
import { comparePeriods, inRange } from "../../components/admin/dashboardUtils";
import { useAdminResources } from "../../hooks/useAdminResources";
import { getSidebarItems } from "../../config/adminSidebar";

export default function SecretaryDashboard({ role, token, user }) {
  const [rangeDays, setRangeDays] = useState(30);
  const { orders, messages, loading, error } = useAdminResources(token, { orders: true, messages: true });
  const filteredOrders = useMemo(() => orders.filter((order) => inRange(order.createdAt, rangeDays)), [orders, rangeDays]);
  const filteredMessages = useMemo(() => messages.filter((message) => inRange(message.createdAt, rangeDays)), [messages, rangeDays]);
  const unreadCount = useMemo(() => (messages || []).filter((message) => message.status === "unread").length, [messages]);
  const sidebarItems = useMemo(() => {
    return getSidebarItems(role).map((item) => (
      item.key === "Communications" ? { ...item, unreadCount } : item
    ));
  }, [role, unreadCount]);

  const cards = [
    { label: "Open Orders", value: String(filteredOrders.length), subtitle: `Last ${rangeDays} days`, change: comparePeriods(orders, () => 1, rangeDays), icon: <StatIcon type="orders" /> },
    { label: "Communications", value: String(filteredMessages.length), subtitle: `Last ${rangeDays} days`, change: comparePeriods(messages, () => 1, rangeDays), icon: <StatIcon type="media" /> },
    { label: "Unread Messages", value: String(filteredMessages.filter((message) => message.status === "unread").length), subtitle: "Current message load", change: 0, icon: <StatIcon type="shield" /> },
  ];

  const sections = {
    Dashboard: <MetricOverview cards={cards} />,
    Orders: <OrdersSection orders={filteredOrders} title="Order Coordination" description="The secretary workspace keeps order follow-up visible without exposing broader admin tooling." />,
    Communications: <MessagesSection messages={filteredMessages} token={token} loading={loading} title="Communications" description="Customer contacts, inquiries, and message follow-ups." />,
    Settings: <SettingsSection token={token} ChangePasswordForm={ChangePasswordForm} />,
  };

  return (
    <RoleDashboardLayout
      role={role}
      title="Secretary Dashboard"
      subtitle={`Welcome back, ${user?.name || "Secretary"}. This workspace centers on communications, coordination, and customer-facing follow-up.`}
      loading={loading}
      error={error}
      sections={sections}
      sidebarItems={sidebarItems}
      renderSection={(key, map) => map[key] || map.Dashboard}
    />
  );
}
