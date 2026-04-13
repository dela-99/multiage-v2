import { useEffect, useMemo, useState } from "react";
import PageLayout from "../components/PageLayout";
import { BtnPrimary, SectionLabel } from "../components/ui";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const SECTIONS = ["Dashboard", "Product", "Office", "Inventory", "Orders", "Sales", "Customer", "Newsletter", "Settings"];

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

  const filteredOrders = useMemo(
    () => orders.filter((order) => inRange(order.createdAt, rangeDays)),
    [orders, rangeDays]
  );

  const filteredMessages = useMemo(
    () => messages.filter((message) => inRange(message.createdAt, rangeDays)),
    [messages, rangeDays]
  );

  const revenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const expenses = revenue * 0.35;
  const income = revenue - expenses;
  const balance = income;

  const scorecards = [
    { label: "Total Revenue", value: `GHS ${revenue.toLocaleString()}`, change: comparePeriods(orders, (order) => order.totalPrice, rangeDays) },
    { label: "Total Orders", value: String(filteredOrders.length), change: comparePeriods(orders, () => 1, rangeDays) },
    { label: "Income", value: `GHS ${income.toLocaleString()}`, change: comparePeriods(orders, (order) => order.totalPrice * 0.65, rangeDays) },
    { label: "Expenses", value: `GHS ${expenses.toLocaleString()}`, change: comparePeriods(orders, (order) => order.totalPrice * 0.35, rangeDays) },
    { label: "Balance", value: `GHS ${balance.toLocaleString()}`, change: comparePeriods(orders, (order) => order.totalPrice * 0.65, rangeDays) },
  ];

  const salesSeries = useMemo(() => {
    const bucket = new Map();
    filteredOrders.forEach((order) => {
      const key = new Date(order.createdAt).toLocaleDateString("en-GB", { month: "short", day: "numeric" });
      bucket.set(key, (bucket.get(key) || 0) + order.totalPrice);
    });

    return [...bucket.entries()].map(([label, total]) => ({ label, total })).slice(-7);
  }, [filteredOrders]);

  const topProducts = useMemo(() => {
    const counts = new Map();
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        counts.set(item.name, (counts.get(item.name) || 0) + item.quantity);
      });
    });
    return [...counts.entries()].map(([name, quantity]) => ({ name, quantity })).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  }, [filteredOrders]);

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

  return (
    <PageLayout>
      <section style={{ maxWidth: 1320, margin: "0 auto", padding: "84px 24px 96px" }}>
        <SectionLabel>Admin Console</SectionLabel>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 26 }}>
          <div>
            <h1 style={{ fontSize: 34, fontWeight: 800, color: t.textPrimary, marginBottom: 8 }}>
              Welcome back, {user?.name || "Admin"}
            </h1>
            <p style={{ color: t.textSecondary, maxWidth: 620 }}>
              Track revenue, manage inventory, review customer leads, and add both new and used products without changing the public store layout.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <label style={{ color: t.textMuted, fontSize: 13 }}>Date Range</label>
            <select value={rangeDays} onChange={(event) => setRangeDays(Number(event.target.value))} style={fieldStyle(t)}>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>

        {error && (
          <div style={{
            marginBottom: 18,
            padding: "12px 14px",
            borderRadius: 12,
            background: "rgba(192,57,43,0.12)",
            color: "#c0392b",
            border: "1px solid rgba(192,57,43,0.24)",
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 22 }} className="grid-responsive">
          <aside style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 24, padding: 18, alignSelf: "start" }}>
            {SECTIONS.map((item) => (
              <button
                key={item}
                onClick={() => setSection(item)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: "none",
                  cursor: "pointer",
                  marginBottom: 8,
                  background: section === item ? "linear-gradient(135deg,#C5620B,#6A2B09)" : "transparent",
                  color: section === item ? "#fff" : t.textSecondary,
                  fontWeight: 600,
                }}
              >
                {item}
              </button>
            ))}
          </aside>

          <div style={{ display: "grid", gap: 22 }}>
            {loading ? (
              <div style={{ padding: "80px 0", textAlign: "center", color: t.textMuted }}>Loading admin data...</div>
            ) : (
              <>
                {(section === "Dashboard" || section === "Sales") && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 16 }}>
                      {scorecards.map((card) => (
                        <div key={card.label} style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 20, padding: 22 }}>
                          <div style={{ color: t.textMuted, fontSize: 13, marginBottom: 10 }}>{card.label}</div>
                          <div style={{ color: t.textPrimary, fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{card.value}</div>
                          <div style={{ color: card.change >= 0 ? "#27ae60" : "#c0392b", fontSize: 13, fontWeight: 600 }}>
                            {card.change >= 0 ? "+" : ""}{card.change.toFixed(1)}% vs previous period
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 20 }} className="grid-responsive">
                      <Panel title="Sales Graph">
                        <div style={{ display: "flex", alignItems: "end", gap: 14, height: 220 }}>
                          {salesSeries.length === 0 ? (
                            <p style={{ color: t.textMuted }}>No sales data in the selected range yet.</p>
                          ) : salesSeries.map((entry) => {
                            const max = Math.max(...salesSeries.map((item) => item.total), 1);
                            const height = (entry.total / max) * 170;
                            return (
                              <div key={entry.label} style={{ flex: 1, textAlign: "center" }}>
                                <div style={{ height, borderRadius: 14, background: "linear-gradient(180deg,#e8892e,#6A2B09)", marginBottom: 10 }} />
                                <div style={{ fontSize: 12, color: t.textMuted }}>{entry.label}</div>
                              </div>
                            );
                          })}
                        </div>
                      </Panel>

                      <Panel title="Top-selling Products">
                        {topProducts.length === 0 ? (
                          <p style={{ color: t.textMuted }}>No order volume yet.</p>
                        ) : topProducts.map((item) => (
                          <div key={item.name} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${t.border}` }}>
                            <span style={{ color: t.textPrimary }}>{item.name}</span>
                            <span style={{ color: "#C5620B", fontWeight: 700 }}>{item.quantity} sold</span>
                          </div>
                        ))}
                      </Panel>
                    </div>
                  </>
                )}

                {section === "Product" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="grid-responsive">
                    <Panel title="Add Product">
                      <form onSubmit={createProduct} style={{ display: "grid", gap: 12 }}>
                        <input placeholder="Name" value={form.name} onChange={handleField("name")} style={fieldStyle(t)} required />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          <input type="number" min="0" placeholder="Price" value={form.price} onChange={handleField("price")} style={fieldStyle(t)} required />
                          <input type="number" min="0" placeholder="Stock" value={form.stock} onChange={handleField("stock")} style={fieldStyle(t)} required />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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
                        <BtnPrimary type="submit" style={{ justifyContent: "center", opacity: creating ? 0.75 : 1 }}>
                          {creating ? "Saving..." : "Save Product"}
                        </BtnPrimary>
                      </form>
                    </Panel>

                    <Panel title="Inventory Snapshot">
                      <div style={{ display: "grid", gap: 12, maxHeight: 580, overflowY: "auto" }}>
                        {products.map((product) => (
                          <div key={product._id} style={{ display: "flex", justifyContent: "space-between", gap: 14, paddingBottom: 12, borderBottom: `1px solid ${t.border}` }}>
                            <div>
                              <div style={{ color: t.textPrimary, fontWeight: 700 }}>{product.name}</div>
                              <div style={{ color: t.textMuted, fontSize: 13 }}>
                                {product.category} · {product.type}{product.condition ? ` · ${product.condition}` : ""}
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ color: "#C5620B", fontWeight: 700 }}>GHS {Number(product.price).toLocaleString()}</div>
                              <div style={{ color: t.textMuted, fontSize: 13 }}>Stock {product.stock}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Panel>
                  </div>
                )}

                {section === "Orders" && (
                  <Panel title="Orders">
                    {filteredOrders.map((order) => (
                      <Row key={order._id}>
                        <div>
                          <div style={{ color: t.textPrimary, fontWeight: 700 }}>{order.user?.name || "Customer"}</div>
                          <div style={{ color: t.textMuted, fontSize: 13 }}>{new Date(order.createdAt).toLocaleString()}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ color: "#C5620B", fontWeight: 700 }}>GHS {Number(order.totalPrice).toLocaleString()}</div>
                          <div style={{ color: t.textMuted, fontSize: 13 }}>{order.status}</div>
                        </div>
                      </Row>
                    ))}
                    {filteredOrders.length === 0 && <p style={{ color: t.textMuted }}>No orders in the selected range.</p>}
                  </Panel>
                )}

                {(section === "Customer" || section === "Sales") && (
                  <Panel title="Customer Inquiries & Sales Leads">
                    {filteredMessages.map((message) => (
                      <Row key={message._id}>
                        <div>
                          <div style={{ color: t.textPrimary, fontWeight: 700 }}>{message.name}</div>
                          <div style={{ color: t.textMuted, fontSize: 13 }}>
                            {message.kind === "used-device-inquiry" ? "Used device lead" : "General contact"} · {message.email}
                          </div>
                          {message.deviceRequested && (
                            <div style={{ color: t.textMuted, fontSize: 13 }}>Requested: {message.deviceRequested}</div>
                          )}
                        </div>
                        <div style={{ color: t.textSecondary, fontSize: 13, maxWidth: 280 }}>{message.message}</div>
                      </Row>
                    ))}
                    {filteredMessages.length === 0 && <p style={{ color: t.textMuted }}>No customer records in the selected range.</p>}
                  </Panel>
                )}

                {["Office", "Inventory", "Newsletter", "Settings"].includes(section) && (
                  <Panel title={section}>
                    <p style={{ color: t.textSecondary }}>
                      This section is routed and protected for admin-only access. It is ready for the next feature pass without breaking the public experience.
                    </p>
                  </Panel>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

function fieldStyle(theme) {
  return {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: `1px solid ${theme.inputBorder}`,
    background: theme.inputBg,
    color: theme.textPrimary,
    boxSizing: "border-box",
  };
}

function Panel({ title, children }) {
  const { t } = useTheme();
  return (
    <div style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 24, padding: 24 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: t.textPrimary, marginBottom: 18 }}>{title}</h2>
      {children}
    </div>
  );
}

function Row({ children }) {
  const { t } = useTheme();
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "14px 0", borderBottom: `1px solid ${t.border}` }}>
      {children}
    </div>
  );
}
