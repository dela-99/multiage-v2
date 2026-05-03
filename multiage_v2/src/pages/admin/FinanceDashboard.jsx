import { useMemo, useState } from "react";
import RoleDashboardLayout, { StatIcon } from "../../components/admin/RoleDashboardLayout";
import { InventorySection, MetricOverview, OrdersSection, SimpleInfoSection } from "../../components/admin/roleSections";
import { comparePeriods, inRange } from "../../components/admin/dashboardUtils";
import { useAdminResources } from "../../hooks/useAdminResources";

export default function FinanceDashboard({ role, token, user }) {
  const [rangeDays, setRangeDays] = useState(30);
  const { products, orders, loading, error } = useAdminResources(token, { products: true, orders: true });
  const filteredOrders = useMemo(() => orders.filter((order) => inRange(order.createdAt, rangeDays)), [orders, rangeDays]);
  const revenue = filteredOrders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
  const expenses = revenue * 0.35;
  const income = revenue - expenses;
  const balance = income;

  const cards = [
    { label: "Revenue", value: `GHS ${revenue.toLocaleString()}`, subtitle: `Last ${rangeDays} days`, change: comparePeriods(orders, (order) => Number(order.totalPrice || 0), rangeDays), icon: <StatIcon type="revenue" /> },
    { label: "Expenses", value: `GHS ${expenses.toLocaleString()}`, subtitle: `Last ${rangeDays} days`, change: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.35, rangeDays), icon: <StatIcon type="expenses" /> },
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
      />
    ),
    Inventory: <InventorySection products={products} />,
    Orders: <OrdersSection orders={filteredOrders} title="Financial Orders" description="Orders that contribute to revenue tracking and payout visibility." />,
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
      />
    ),
    Settings: <SimpleInfoSection title="Settings" description="Finance workspace settings." body="This dashboard keeps the finance view focused on order values, reconciliation visibility, and trend monitoring. Sensitive identity and content tools stay outside this role." />,
  };

  return (
    <RoleDashboardLayout
      role={role}
      title="Finance Dashboard"
      subtitle={`Welcome back, ${user?.name || "Finance"}. This workspace is focused on revenue, expenses, and order value visibility.`}
      loading={loading}
      error={error}
      sections={sections}
      renderSection={(key, map) => map[key] || map.Dashboard}
    />
  );
}
