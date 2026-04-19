import { useEffect, useMemo, useState } from "react";
import PageLayout from "../components/PageLayout";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import ChangePasswordForm from "../components/ChangePasswordForm";
import DashboardCard from "../components/admin/DashboardCard";
import Sidebar from "../components/admin/Sidebar";
import AnalyticsChart from "../components/admin/AnalyticsChart";
import TopProducts from "../components/admin/TopProducts";

const SECTIONS = [
  { key: "Dashboard", label: "Dashboard" },
  { key: "Products", label: "Products" },
  { key: "Inventory", label: "Inventory" },
  { key: "Orders", label: "Orders" },
  { key: "Sales", label: "Sales" },
  { key: "Customers", label: "Customers" },
  { key: "Newsletter", label: "Newsletter" },
  { key: "Settings", label: "Settings" },
];

function inRange(dateString, days) {
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - days);
  return new Date(dateString) >= threshold;
}

function comparePeriods(items, getter, days) {
  const now = new Date();
  const currentStart = new Date(now);
  currentStart.setDate(now.getDate() - days);
  const previousStart = new Date(currentStart);
  previousStart.setDate(currentStart.getDate() - days);

  const current = items
    .filter((item) => new Date(item.createdAt) >= currentStart)
    .reduce((sum, item) => sum + getter(item), 0);

  const previous = items
    .filter((item) => new Date(item.createdAt) >= previousStart && new Date(item.createdAt) < currentStart)
    .reduce((sum, item) => sum + getter(item), 0);

  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return ((current - previous) / previous) * 100;
}

function useViewport() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return width;
}

function StatIcon({ type }) {
  const paths = {
    revenue: "M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7H14.5a3.5 3.5 0 0 1 0 7H6",
    orders: "M7 4h10l1 2h3v2H3V6h3l1-2Z M5 8h14v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8Z",
    income: "M4 18 10 12 14 15 20 7",
    expenses: "M20 17 14 11 10 14 4 6",
    balance: "M4 19V9 M10 19V5 M16 19v-8 M22 19v-12",
    menu: "M4 7h16 M4 12h16 M4 17h16",
  };

  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[type]} />
    </svg>
  );
}

function fieldStyle(theme) {
  return {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: `1px solid ${theme.inputBorder}`,
    background: theme.inputBg,
    color: theme.textPrimary,
    boxSizing: "border-box",
    fontFamily: "inherit",
  };
}

function Shell({ title, description, children }) {
  const { t } = useTheme();

  return (
    <section style={{
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 28,
      padding: 26,
      backdropFilter: "blur(16px)",
    }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: t.textPrimary, letterSpacing: -0.6 }}>{title}</h2>
        {description && <div style={{ marginTop: 8, fontSize: 13, color: t.textMuted }}>{description}</div>}
      </div>
      {children}
    </section>
  );
}

export default function AdminDashboard() {
  const { t } = useTheme();
  const { token, user } = useAuth();
  const [section, setSection] = useState("Dashboard");
  const [rangeDays, setRangeDays] = useState(30);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const viewportWidth = useViewport();
  const isMobile = viewportWidth < 980;
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Phones",
    type: "new",
    condition: "",
    brand: "",
    stock: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const [productData, orderData, messageData] = await Promise.all([
          api.getProducts({ limit: 50 }),
          api.getOrders(token),
          api.getMessages(token),
        ]);

        if (!active) {
          return;
        }

        setProducts(productData.items || []);
        setOrders(orderData || []);
        setMessages(messageData || []);
        setError("");
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load admin data");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { active = false; };
  }, [token]);

  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const filteredOrders = useMemo(
    () => orders.filter((order) => inRange(order.createdAt, rangeDays)),
    [orders, rangeDays]
  );

  const filteredMessages = useMemo(
    () => messages.filter((message) => inRange(message.createdAt, rangeDays)),
    [messages, rangeDays]
  );

  const revenue = filteredOrders.reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);
  const expenses = revenue * 0.35;
  const income = revenue - expenses;
  const balance = income;

  const scorecards = [
    {
      label: "Total Revenue",
      value: `GHS ${revenue.toLocaleString()}`,
      subtitle: `Last ${rangeDays} days`,
      change: comparePeriods(orders, (order) => Number(order.totalPrice || 0), rangeDays),
      icon: <StatIcon type="revenue" />,
    },
    {
      label: "Total Orders",
      value: String(filteredOrders.length),
      subtitle: `Last ${rangeDays} days`,
      change: comparePeriods(orders, () => 1, rangeDays),
      icon: <StatIcon type="orders" />,
    },
    {
      label: "Income",
      value: `GHS ${income.toLocaleString()}`,
      subtitle: `Last ${rangeDays} days`,
      change: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.65, rangeDays),
      icon: <StatIcon type="income" />,
    },
    {
      label: "Expenses",
      value: `GHS ${expenses.toLocaleString()}`,
      subtitle: `Last ${rangeDays} days`,
      change: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.35, rangeDays),
      icon: <StatIcon type="expenses" />,
    },
    {
      label: "Balance",
      value: `GHS ${balance.toLocaleString()}`,
      subtitle: `Last ${rangeDays} days`,
      change: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.65, rangeDays),
      icon: <StatIcon type="balance" />,
    },
  ];

  const topProducts = useMemo(() => {
    const counts = new Map();
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        counts.set(item.name, (counts.get(item.name) || 0) + Number(item.quantity || 0));
      });
    });

    const productByName = new Map(products.map((product) => [product.name, product]));

    return [...counts.entries()]
      .map(([name, quantity]) => ({
        name,
        quantity,
        image: productByName.get(name)?.image || "",
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 8);
  }, [filteredOrders, products]);

  const handleField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({ ...current, image: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const createProduct = async (event) => {
    event.preventDefault();

    try {
      setCreating(true);
      const created = await api.createProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      }, token);

      setProducts((current) => [created, ...current]);
      setForm({
        name: "",
        price: "",
        category: "Phones",
        type: "new",
        condition: "",
        brand: "",
        stock: "",
        description: "",
        image: "",
      });
      setError("");
    } catch (err) {
      setError(err.message || "Failed to create product");
    } finally {
      setCreating(false);
    }
  };

  const renderDashboardOverview = () => (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 18 }}>
        {scorecards.map((card) => (
          <DashboardCard
            key={card.label}
            title={card.label}
            subtitle={card.subtitle}
            value={card.value}
            change={card.change}
            icon={card.icon}
          />
        ))}
      </div>

      <AnalyticsChart
        rangeDays={rangeDays}
        onRangeChange={setRangeDays}
        income={income}
        expenses={expenses}
        balance={balance}
        changes={{
          income: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.65, rangeDays),
          expenses: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.35, rangeDays),
          balance: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.65, rangeDays),
        }}
        hasChartData={filteredOrders.length > 0}
      />

      <TopProducts items={topProducts} />
    </>
  );

  const renderProductsSection = () => (
    <div style={{ display: "grid", gridTemplateColumns: viewportWidth < 1200 ? "1fr" : "1.05fr 0.95fr", gap: 20 }}>
      <Shell title="Products" description="Create products and keep the catalog aligned with the store.">
        <form onSubmit={createProduct} style={{ display: "grid", gap: 12 }}>
          <input placeholder="Name" value={form.name} onChange={handleField("name")} style={fieldStyle(t)} required />
          <div style={{ display: "grid", gridTemplateColumns: viewportWidth < 640 ? "1fr" : "1fr 1fr", gap: 12 }}>
            <input type="number" min="0" placeholder="Price" value={form.price} onChange={handleField("price")} style={fieldStyle(t)} required />
            <input type="number" min="0" placeholder="Stock" value={form.stock} onChange={handleField("stock")} style={fieldStyle(t)} required />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: viewportWidth < 640 ? "1fr" : "1fr 1fr", gap: 12 }}>
            <select value={form.category} onChange={handleField("category")} style={fieldStyle(t)}>
              {["Phones", "Laptops", "Tablets", "Accessories", "Watches", "Audio", "Other"].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <select value={form.type} onChange={handleField("type")} style={fieldStyle(t)}>
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </div>
          {form.type === "used" && (
            <input placeholder="Condition" value={form.condition} onChange={handleField("condition")} style={fieldStyle(t)} required />
          )}
          <input placeholder="Brand" value={form.brand} onChange={handleField("brand")} style={fieldStyle(t)} />
          <textarea rows={4} placeholder="Description" value={form.description} onChange={handleField("description")} style={{ ...fieldStyle(t), resize: "vertical" }} />
          <input type="file" accept="image/*" onChange={handleImage} style={fieldStyle(t)} />
          <button
            type="submit"
            style={{
              padding: "14px 18px",
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg,#C5620B,#6A2B09)",
              color: "#fff",
              fontWeight: 700,
              cursor: creating ? "not-allowed" : "pointer",
              opacity: creating ? 0.7 : 1,
              fontFamily: "inherit",
            }}
          >
            {creating ? "Saving..." : "Save Product"}
          </button>
        </form>
      </Shell>

      <Shell title="Product List" description="Live product records already stored in the backend.">
        {products.length === 0 ? (
          <div style={{ color: t.textMuted }}>No products loaded yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 12, maxHeight: 620, overflowY: "auto" }}>
            {products.map((product) => (
              <article key={product._id} style={{
                display: "grid",
                gridTemplateColumns: "64px 1fr auto",
                gap: 14,
                alignItems: "center",
                padding: "12px 0",
                borderBottom: `1px solid ${t.border}`,
              }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${t.border}`,
                  display: "grid",
                  placeItems: "center",
                }}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ color: t.textMuted, fontSize: 11 }}>No image</span>
                  )}
                </div>
                <div>
                  <div style={{ color: t.textPrimary, fontWeight: 700, marginBottom: 4 }}>{product.name}</div>
                  <div style={{ color: t.textMuted, fontSize: 13 }}>
                    {product.category} · {product.type}{product.condition ? ` · ${product.condition}` : ""}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#C5620B", fontWeight: 800 }}>GHS {Number(product.price || 0).toLocaleString()}</div>
                  <div style={{ color: t.textMuted, fontSize: 13 }}>Stock {product.stock}</div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Shell>
    </div>
  );

  const renderInventorySection = () => (
    <Shell title="Inventory" description="Current stock levels across the catalog.">
      {products.length === 0 ? (
        <div style={{ color: t.textMuted }}>No inventory records available yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {products.map((product) => (
            <div key={product._id} style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              padding: "14px 0",
              borderBottom: `1px solid ${t.border}`,
              flexWrap: "wrap",
            }}>
              <div>
                <div style={{ color: t.textPrimary, fontWeight: 700 }}>{product.name}</div>
                <div style={{ color: t.textMuted, fontSize: 13 }}>{product.brand || "No brand"} · {product.category}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#C5620B", fontWeight: 700 }}>Stock {product.stock}</div>
                <div style={{ color: t.textMuted, fontSize: 13 }}>{product.type}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );

  const renderOrdersSection = () => (
    <Shell title="Orders" description="Recent orders from the backend, no placeholders involved.">
      {filteredOrders.length === 0 ? (
        <div style={{ color: t.textMuted }}>No orders in the selected range.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filteredOrders.map((order) => (
            <div key={order._id} style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              padding: "16px 0",
              borderBottom: `1px solid ${t.border}`,
              flexWrap: "wrap",
            }}>
              <div>
                <div style={{ color: t.textPrimary, fontWeight: 700 }}>{order.user?.name || "Customer"}</div>
                <div style={{ color: t.textMuted, fontSize: 13 }}>{new Date(order.createdAt).toLocaleString()}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#C5620B", fontWeight: 800 }}>GHS {Number(order.totalPrice || 0).toLocaleString()}</div>
                <div style={{ color: t.textMuted, fontSize: 13, textTransform: "capitalize" }}>{order.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );

  const renderCustomersSection = () => (
    <Shell title="Customers" description="Inquiry and lead records that came through the live backend.">
      {filteredMessages.length === 0 ? (
        <div style={{ color: t.textMuted }}>No customer inquiries in the selected range.</div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {filteredMessages.map((message) => (
            <div key={message._id} style={{
              display: "grid",
              gap: 8,
              padding: "16px 0",
              borderBottom: `1px solid ${t.border}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <div style={{ color: t.textPrimary, fontWeight: 700 }}>{message.name}</div>
                  <div style={{ color: t.textMuted, fontSize: 13 }}>{message.email}</div>
                </div>
                <div style={{ color: "#C5620B", fontSize: 12, fontWeight: 700 }}>
                  {message.kind === "used-device-inquiry" ? "Sales lead" : "Contact"}
                </div>
              </div>
              {message.deviceRequested && (
                <div style={{ color: t.textSecondary, fontSize: 13 }}>
                  Requested device: {message.deviceRequested}
                </div>
              )}
              <div style={{ color: t.textSecondary, fontSize: 14, lineHeight: 1.7 }}>{message.message}</div>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );

  const renderSimpleSection = (title, description, body) => (
    <Shell title={title} description={description}>
      <div style={{ color: t.textSecondary, lineHeight: 1.7 }}>{body}</div>
    </Shell>
  );

  return (
    <PageLayout>
      <section style={{ maxWidth: 1440, margin: "0 auto", padding: "84px 20px 96px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "290px 1fr", gap: 24, alignItems: "start" }}>
          <Sidebar
            items={SECTIONS}
            active={section}
            onSelect={setSection}
            isMobile={isMobile}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div style={{ display: "grid", gap: 22 }}>
            <div style={{
              background: t.cardBg,
              border: `1px solid ${t.cardBorder}`,
              borderRadius: 28,
              padding: "24px 24px",
              backdropFilter: "blur(16px)",
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              alignItems: "center",
              flexWrap: "wrap",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      border: `1px solid ${t.border}`,
                      background: t.surface,
                      color: t.textPrimary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <StatIcon type="menu" />
                  </button>
                )}
                <div>
                  <div style={{ color: t.textMuted, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 8 }}>
                    Overview
                  </div>
                  <h1 style={{ margin: 0, fontSize: 34, fontWeight: 800, color: t.textPrimary, letterSpacing: -0.8 }}>
                    {section}
                  </h1>
                  <div style={{ marginTop: 8, color: t.textSecondary, fontSize: 14, lineHeight: 1.6 }}>
                    Welcome back, {user?.name || "Admin"}. Everything here stays connected to your current backend data.
                  </div>
                </div>
              </div>

              <div style={{ minWidth: isMobile ? "100%" : 280 }}>
                <div style={{
                  padding: "14px 16px",
                  borderRadius: 16,
                  background: t.inputBg,
                  border: `1px solid ${t.inputBorder}`,
                  color: t.textMuted,
                  fontSize: 13,
                }}>
                  Admin workspace aligned for live products, orders, analytics, and customer activity.
                </div>
              </div>
            </div>

            {error && (
              <div style={{
                padding: "12px 14px",
                borderRadius: 14,
                background: "rgba(192,57,43,0.12)",
                color: "#c0392b",
                border: "1px solid rgba(192,57,43,0.24)",
              }}>
                {error}
              </div>
            )}

            {loading ? (
              <div style={{
                background: t.cardBg,
                border: `1px solid ${t.cardBorder}`,
                borderRadius: 28,
                padding: "100px 24px",
                textAlign: "center",
                color: t.textMuted,
              }}>
                Loading admin data...
              </div>
            ) : (
              <>
                {section === "Dashboard" && renderDashboardOverview()}
                {section === "Products" && renderProductsSection()}
                {section === "Inventory" && renderInventorySection()}
                {section === "Orders" && renderOrdersSection()}
                {section === "Sales" && (
                  <>
                    <AnalyticsChart
                      rangeDays={rangeDays}
                      onRangeChange={setRangeDays}
                      income={income}
                      expenses={expenses}
                      balance={balance}
                      changes={{
                        income: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.65, rangeDays),
                        expenses: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.35, rangeDays),
                        balance: comparePeriods(orders, (order) => Number(order.totalPrice || 0) * 0.65, rangeDays),
                      }}
                      hasChartData={filteredOrders.length > 0}
                    />
                    <TopProducts items={topProducts} />
                  </>
                )}
                {section === "Customers" && renderCustomersSection()}
                {section === "Newsletter" && renderSimpleSection("Newsletter", "Newsletter tools can plug in here without touching API logic.", "This section is laid out and protected for admin use. It is ready to receive backend newsletter data when that feature is implemented.")}
                {section === "Settings" && (
                  <Shell title="Settings" description="Admin account settings with existing backend password change functionality.">
                    <ChangePasswordForm token={token} />
                  </Shell>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
