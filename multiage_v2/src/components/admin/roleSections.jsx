import { useState } from "react";
import DashboardCard from "./DashboardCard";
import AnalyticsChart from "./AnalyticsChart";
import TopProducts from "./TopProducts";
import { SectionShell, fieldStyle, StatIcon } from "./RoleDashboardLayout";
import { useTheme } from "../../context/ThemeContext";

export function MetricOverview({ cards, analytics, topProducts }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 18 }}>
        {cards.map((card) => (
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

      {analytics && (
        <AnalyticsChart
          rangeDays={analytics.rangeDays}
          onRangeChange={analytics.onRangeChange}
          income={analytics.income}
          expenses={analytics.expenses}
          balance={analytics.balance}
          changes={analytics.changes}
          hasChartData={analytics.hasChartData}
        />
      )}

      {topProducts && <TopProducts items={topProducts} />}
    </>
  );
}

export function ProductManagerSection({ products, token, onCreateProduct, creating, viewportWidth }) {
  const { t } = useTheme();
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const created = await onCreateProduct({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    }, token);

    if (created) {
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
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: viewportWidth < 1200 ? "1fr" : "1.05fr 0.95fr", gap: 20 }}>
      <SectionShell title="Products" description="Create products and keep the catalog aligned with the store.">
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
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
      </SectionShell>

      <ProductListSection products={products} />
    </div>
  );
}

export function ProductListSection({ products }) {
  const { t } = useTheme();

  return (
    <SectionShell title="Product List" description="Live product records already stored in the backend.">
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
    </SectionShell>
  );
}

export function InventorySection({ products }) {
  const { t } = useTheme();

  return (
    <SectionShell title="Inventory" description="Current stock levels across the catalog.">
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
    </SectionShell>
  );
}

export function OrdersSection({ orders, title = "Orders", description = "Recent orders from the backend, no placeholders involved." }) {
  const { t } = useTheme();

  return (
    <SectionShell title={title} description={description}>
      {orders.length === 0 ? (
        <div style={{ color: t.textMuted }}>No orders in the selected range.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {orders.map((order) => (
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
    </SectionShell>
  );
}

export function MessagesSection({ messages, title = "Communications", description = "Live customer and service communication records." }) {
  const { t } = useTheme();

  return (
    <SectionShell title={title} description={description}>
      {messages.length === 0 ? (
        <div style={{ color: t.textMuted }}>No communication records in the selected range.</div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {messages.map((message) => (
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
    </SectionShell>
  );
}

export function SettingsSection({ token, ChangePasswordForm }) {
  return (
    <SectionShell title="Settings" description="Admin account settings with the existing password change flow.">
      <ChangePasswordForm token={token} />
    </SectionShell>
  );
}

export function SimpleInfoSection({ title, description, body, iconType = "shield" }) {
  const { t } = useTheme();

  return (
    <SectionShell title={title} description={description}>
      <div style={{ display: "grid", gap: 18, color: t.textSecondary, lineHeight: 1.7 }}>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(197,98,11,0.12)",
          color: "#C5620B",
          border: "1px solid rgba(197,98,11,0.2)",
        }}>
          <StatIcon type={iconType} />
        </div>
        <div>{body}</div>
      </div>
    </SectionShell>
  );
}
