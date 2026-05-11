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
import { api } from "../../lib/api";

export default function CEODashboard({ role, token, user }) {
  const [rangeDays, setRangeDays] = useState(30);
  const { products, orders, loading, error } = useAdminResources(token, { products: true, orders: true });

  const filteredOrders = useMemo(() => orders.filter((order) => inRange(order.createdAt, rangeDays)), [orders, rangeDays]);
  const revenue = filteredOrders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
  const expenses = revenue * 0.35;
  const income = revenue - expenses;
  const balance = income;
  const topProducts = useMemo(() => buildTopProducts(filteredOrders, products), [filteredOrders, products]);

  const cards = [
    { label: "Total Revenue", value: `GHS ${revenue.toLocaleString()}`, subtitle: `Last ${rangeDays} days`, change: comparePeriods(orders, (order) => Number(order.totalPrice || 0), rangeDays), icon: <StatIcon type="revenue" /> },
    { label: "Total Orders", value: String(filteredOrders.length), subtitle: `Last ${rangeDays} days`, change: comparePeriods(orders, () => 1, rangeDays), icon: <StatIcon type="orders" /> },
    { label: "Income", value: `GHS ${income.toLocaleString()}`, subtitle: `Last ${rangeDays} days`, change: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.65, rangeDays), icon: <StatIcon type="income" /> },
    { label: "Balance", value: `GHS ${balance.toLocaleString()}`, subtitle: `Last ${rangeDays} days`, change: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.65, rangeDays), icon: <StatIcon type="balance" /> },
  ];

  const sections = {
    Dashboard: (
      <MetricOverview
        cards={cards}
        analytics={{
          rangeDays,
          onRangeChange: setRangeDays,
          income,
          expenses,
          balance,
          changes: {
            income: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.65, rangeDays),
            expenses: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.35, rangeDays),
            balance: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.65, rangeDays),
          },
          hasChartData: filteredOrders.length > 0,
        }}
        topProducts={topProducts}
      />
    ),
    Products: <ProductListSection products={products} />,
    Inventory: <InventorySection products={products} />,
    Orders: <OrdersSection orders={filteredOrders} />,
    Sales: (
      <MetricOverview
        cards={cards}
        analytics={{
          rangeDays,
          onRangeChange: setRangeDays,
          income,
          expenses,
          balance,
          changes: {
            income: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.65, rangeDays),
            expenses: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.35, rangeDays),
            balance: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.65, rangeDays),
          },
          hasChartData: filteredOrders.length > 0,
        }}
        topProducts={topProducts}
      />
    ),
    Users: <SimpleInfoSection title="Users" description="Executive visibility only." body="User governance remains backend-protected. This CEO workspace is reserved for high-level user administration and audit decisions." />,
    "Media / Content": <SimpleInfoSection title="Media / Content" description="Brand and campaign oversight." body="Use this workspace to review content direction and approve media priorities. Dedicated publishing tools can plug in here without changing the dashboard switch logic." iconType="media" />,
    Settings: <SettingsSection token={token} ChangePasswordForm={ChangePasswordForm} />,
  };

  return (
    <RoleDashboardLayout
      role={role}
      title="CEO Dashboard"
      subtitle={`Welcome back, ${user?.name || "CEO"}. This executive workspace surfaces commercial performance, oversight, and strategic visibility.`}
      loading={loading}
      error={error}
      sections={sections}
      renderSection={(key, map) => map[key] || map.Dashboard}
    />
  );
}
