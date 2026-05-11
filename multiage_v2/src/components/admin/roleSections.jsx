import { useEffect, useMemo, useState } from "react";
import DashboardCard from "./DashboardCard";
import AnalyticsChart from "./AnalyticsChart";
import TopProducts from "./TopProducts";
import { SectionShell, fieldStyle, StatIcon } from "./RoleDashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import { api } from "../../lib/api";

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
    
    reader.onerror = () => {
      console.error("Failed to read image file");
      alert("Failed to load image. Please try again.");
    };
    
    reader.onabort = () => {
      console.warn("Image read was aborted");
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
            disabled={creating}
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

function normalizePhoneForActions(phone) {
  const raw = String(phone || "").trim();
  if (!raw) {
    return "";
  }

  if (raw.startsWith("+")) {
    return raw.replace(/[^\d]/g, "");
  }

  return raw.replace(/[^\d]/g, "");
}

export function MessagesSection({
  messages,
  token,
  loading = false,
  title = "Communications",
  description = "Live customer and service communication records.",
}) {
  const { t } = useTheme();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [localMessages, setLocalMessages] = useState(messages || []);
  const [detailLoadingId, setDetailLoadingId] = useState("");

  useEffect(() => {
    setLocalMessages(messages || []);
    setSelectedMessage((current) => {
      if (!current) {
        return null;
      }
      return (messages || []).find((message) => message._id === current._id) || current;
    });
  }, [messages]);

  const filteredMessages = useMemo(() => {
    return (localMessages || []).filter((message) => {
      const matchesSearch = !query || [message.name, message.email, message.phone, message.service]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query.toLowerCase()));
      const matchesFilter = filter === "all" ? true : message.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [filter, localMessages, query]);

  const openMessage = async (message) => {
    if (!token || !message?._id) {
      setSelectedMessage(message || null);
      return;
    }

    try {
      setDetailLoadingId(message._id);
      const fullMessage = await api.getMessage(message._id, token);
      setSelectedMessage(fullMessage);
      setLocalMessages((current) => current.map((item) => (
        item._id === fullMessage._id ? fullMessage : item
      )));
    } catch (error) {
      setSelectedMessage(message);
    } finally {
      setDetailLoadingId("");
    }
  };

  const copyValue = async (value) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      window.prompt("Copy this value:", value);
    }
  };

  const selectedPhone = normalizePhoneForActions(selectedMessage?.phone);

  return (
    <SectionShell title={title} description={description}>
      <div style={{ display: "grid", gap: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 12 }} className="messages-toolbar">
          <input
            placeholder="Search by name, email, or phone"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={fieldStyle(t)}
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
              { key: "read", label: "Read" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: filter === item.key ? "1px solid rgba(197,98,11,0.6)" : `1px solid ${t.border}`,
                  background: filter === item.key ? "rgba(197,98,11,0.14)" : t.surface,
                  color: filter === item.key ? "#C5620B" : t.textPrimary,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{
            padding: "32px 18px",
            borderRadius: 18,
            background: t.surface,
            border: `1px solid ${t.border}`,
            color: t.textMuted,
            textAlign: "center",
          }}>
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div style={{ color: t.textMuted, padding: "18px 4px" }}>No messages yet</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(320px,0.95fr)", gap: 18 }} className="messages-grid">
            <div style={{ display: "grid", gap: 12, maxHeight: 620, overflowY: "auto", paddingRight: 4 }}>
              {filteredMessages.map((message) => {
                const isActive = selectedMessage?._id === message._id;
                const isUnread = message.status === "unread";
                return (
                  <button
                    key={message._id}
                    type="button"
                    onClick={() => openMessage(message)}
                    style={{
                      display: "grid",
                      gap: 8,
                      textAlign: "left",
                      width: "100%",
                      padding: "16px 18px",
                      borderRadius: 18,
                      border: isActive ? "1px solid rgba(197,98,11,0.55)" : `1px solid ${t.border}`,
                      background: isActive ? "rgba(197,98,11,0.12)" : (isUnread ? "rgba(197,98,11,0.08)" : t.surface),
                      cursor: "pointer",
                      boxShadow: isUnread ? "inset 3px 0 0 #C5620B" : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ color: t.textPrimary, fontWeight: 800 }}>{message.name}</div>
                        <div style={{ color: t.textMuted, fontSize: 13 }}>{message.email}</div>
                      </div>
                      <span style={{
                        padding: "5px 10px",
                        borderRadius: 999,
                        background: isUnread ? "rgba(197,98,11,0.16)" : "rgba(30,132,73,0.14)",
                        color: isUnread ? "#C5620B" : "#1e8449",
                        fontWeight: 800,
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: 0.8,
                      }}>
                        {detailLoadingId === message._id ? "Opening..." : message.status}
                      </span>
                    </div>
                    <div style={{ color: t.textSecondary, fontSize: 13 }}>
                      {message.service || "General inquiry"}{message.phone ? ` · ${message.phone}` : ""}
                    </div>
                    <div style={{ color: t.textMuted, fontSize: 13, lineHeight: 1.6 }}>
                      {String(message.message || "").slice(0, 110)}{String(message.message || "").length > 110 ? "..." : ""}
                    </div>
                    <div style={{ color: t.textMuted, fontSize: 12 }}>
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{
              borderRadius: 22,
              border: `1px solid ${t.cardBorder}`,
              background: t.cardBg,
              padding: 22,
              minHeight: 360,
              display: "grid",
              gap: 16,
              alignContent: "start",
            }}>
              {selectedMessage ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "start", flexWrap: "wrap" }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 22, color: t.textPrimary, fontWeight: 800 }}>{selectedMessage.name}</h3>
                      <div style={{ color: t.textMuted, fontSize: 13, marginTop: 6 }}>
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <span style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: selectedMessage.status === "unread" ? "rgba(197,98,11,0.16)" : "rgba(30,132,73,0.14)",
                      color: selectedMessage.status === "unread" ? "#C5620B" : "#1e8449",
                      fontWeight: 800,
                      fontSize: 11,
                      textTransform: "uppercase",
                    }}>
                      {selectedMessage.status}
                    </span>
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    <DetailRow label="Email" value={selectedMessage.email} />
                    <DetailRow label="Phone" value={selectedMessage.phone || "N/A"} />
                    <DetailRow label="Service requested" value={selectedMessage.service || "General inquiry"} />
                  </div>

                  <div>
                    <div style={{ color: t.textMuted, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                      Message
                    </div>
                    <div style={{ color: t.textSecondary, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                      {selectedMessage.message}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <ActionButton label="Copy Email" onClick={() => copyValue(selectedMessage.email)} />
                    <ActionButton label="Copy Phone" onClick={() => copyValue(selectedMessage.phone)} />
                    <ActionButton label="Reply via Email" onClick={() => { window.location.href = `mailto:${selectedMessage.email}`; }} />
                    <ActionButton
                      label="Reply via WhatsApp"
                      onClick={() => {
                        if (selectedPhone) {
                          window.open(`https://wa.me/${selectedPhone}`, "_blank", "noopener,noreferrer");
                        }
                      }}
                      disabled={!selectedPhone}
                    />
                    <ActionButton
                      label="Reply via SMS"
                      onClick={() => {
                        if (selectedPhone) {
                          window.location.href = `sms:${selectedPhone}`;
                        }
                      }}
                      disabled={!selectedPhone}
                    />
                  </div>
                </>
              ) : (
                <div style={{ color: t.textMuted, lineHeight: 1.7 }}>
                  Select a message to view full details and quick reply actions.
                </div>
              )}
            </div>
          </div>
        )}

        <style>{`
          @media (max-width: 980px) {
            .messages-grid {
              grid-template-columns: 1fr !important;
            }

            .messages-toolbar {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </SectionShell>
  );
}

function DetailRow({ label, value }) {
  const { t } = useTheme();

  return (
    <div style={{ display: "grid", gap: 4 }}>
      <div style={{ color: t.textMuted, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
        {label}
      </div>
      <div style={{ color: t.textPrimary, fontWeight: 600, lineHeight: 1.6 }}>
        {value}
      </div>
    </div>
  );
}

function ActionButton({ label, onClick, disabled = false }) {
  const { t } = useTheme();

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 14px",
        borderRadius: 12,
        border: `1px solid ${t.border}`,
        background: disabled ? t.surface : "rgba(197,98,11,0.12)",
        color: disabled ? t.textMuted : t.textPrimary,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {label}
    </button>
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
