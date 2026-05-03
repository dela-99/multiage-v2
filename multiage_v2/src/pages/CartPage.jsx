import PageLayout from "../components/PageLayout";
import { BtnPrimary, BtnGhost, PageHeroHeading, SectionLabel } from "../components/ui";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";

function QuantityButton({ onClick, children, disabled, theme }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 34,
        height: 34,
        borderRadius: 10,
        border: `1px solid ${theme.border}`,
        background: theme.surface,
        color: theme.textPrimary,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        fontWeight: 700,
      }}
    >
      {children}
    </button>
  );
}

export default function CartPage() {
  const { t } = useTheme();
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  return (
    <PageLayout>
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "82px 24px 100px" }}>
        <SectionLabel>Your cart</SectionLabel>
        <PageHeroHeading style={{ marginBottom: 12 }}>
          Shopping cart
        </PageHeroHeading>
        <p style={{ fontSize: 15, color: t.textSecondary, marginBottom: 28, lineHeight: 1.6 }}>
          Review your selected items, adjust quantities, and keep your order ready.
        </p>

        {items.length === 0 ? (
          <div style={{
            padding: "34px 26px",
            borderRadius: 22,
            background: t.cardBg,
            border: `1px solid ${t.cardBorder}`,
            textAlign: "center",
          }}>
            <p style={{ color: t.textSecondary, marginBottom: 20 }}>
              Your cart is empty right now.
            </p>
            <BtnPrimary href="/store">Browse the store</BtnPrimary>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 24 }} className="cart-grid">
            <div style={{ display: "grid", gap: 16 }}>
              {items.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px minmax(0,1fr)",
                    gap: 16,
                    padding: "18px",
                    borderRadius: 20,
                    background: t.cardBg,
                    border: `1px solid ${t.cardBorder}`,
                    alignItems: "center",
                  }}
                >
                  <div style={{
                    width: 100,
                    height: 100,
                    borderRadius: 18,
                    overflow: "hidden",
                    background: t.surface,
                    border: `1px solid ${t.border}`,
                    display: "grid",
                    placeItems: "center",
                  }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ color: t.textMuted, fontSize: 12 }}>No image</span>
                    )}
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: t.textPrimary }}>{item.name}</div>
                        <div style={{ fontSize: 13, color: t.textMuted }}>
                          {item.brand || "Multiage"}{item.category ? ` · ${item.category}` : ""}
                        </div>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#C5620B" }}>
                        GHS {(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                        <QuantityButton
                          onClick={() => updateQuantity(item._id, Number(item.quantity || 0) - 1)}
                          disabled={Number(item.quantity || 0) <= 1}
                          theme={t}
                        >
                          -
                        </QuantityButton>
                        <span style={{ minWidth: 20, textAlign: "center", color: t.textPrimary, fontWeight: 700 }}>
                          {item.quantity}
                        </span>
                        <QuantityButton
                          onClick={() => updateQuantity(item._id, Number(item.quantity || 0) + 1)}
                          theme={t}
                        >
                          +
                        </QuantityButton>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item._id)}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#c0392b",
                          cursor: "pointer",
                          fontWeight: 700,
                          padding: 0,
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside style={{
              padding: "22px 20px",
              borderRadius: 22,
              background: t.cardBg,
              border: `1px solid ${t.cardBorder}`,
              height: "fit-content",
              display: "grid",
              gap: 16,
            }}>
              <h2 style={{ margin: 0, color: t.textPrimary, fontSize: 20, fontWeight: 800 }}>Summary</h2>
              <div style={{ display: "flex", justifyContent: "space-between", color: t.textSecondary, fontSize: 14 }}>
                <span>Items</span>
                <span>{totalItems}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: t.textPrimary, fontSize: 18, fontWeight: 800 }}>
                <span>Total</span>
                <span style={{ color: "#C5620B" }}>GHS {Number(totalPrice || 0).toLocaleString()}</span>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                <BtnPrimary href="/store">Continue shopping</BtnPrimary>
                <BtnGhost onClick={clearCart}>Clear cart</BtnGhost>
              </div>
            </aside>
          </div>
        )}

        <style>{`
          @media (max-width: 920px) {
            .cart-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>
    </PageLayout>
  );
}
