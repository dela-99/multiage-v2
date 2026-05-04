import { useEffect, useMemo, useRef, useState } from "react";
import PageLayout from "../components/PageLayout";
import { useTheme } from "../context/ThemeContext";
import { Icon, SectionLabel, PageHeroHeading, BtnPrimary, GlowBlob } from "../components/ui";
import { icons } from "../constants";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "../router";

const STORE_CATS = ["All", "Phones", "Laptops", "Tablets", "Accessories", "Watches", "Audio"];

const STORE_ACTIVE = false;

const FALLBACK_PRODUCTS = [
  { _id: "fallback-1", category: "Phones", name: "iPhone 15 Pro", price: 9999, type: "new", brand: "Apple", description: "Titanium design, 48MP camera, A17 Pro chip", image: "" },
  { _id: "fallback-2", category: "Phones", name: "Samsung Galaxy S24 Ultra", price: 9499, type: "new", brand: "Samsung", description: "AI-powered, 200MP, integrated S Pen", image: "" },
  { _id: "fallback-3", category: "Laptops", name: "MacBook Air M3", price: 14499, type: "new", brand: "Apple", description: "All-day battery, fanless, ultra-thin", image: "" },
  { _id: "fallback-4", category: "Accessories", name: "AirPods Pro 2", price: 3299, type: "new", brand: "Apple", description: "ANC, Adaptive Audio, USB-C charging", image: "" },
];

const normalizePhone = (phone) => {
  let cleaned = phone.replace(/\s+/g, "").replace(/-/g, "");

  if (cleaned.startsWith("0")) {
    return "233" + cleaned.slice(1);
  }

  if (cleaned.startsWith("+233")) {
    return cleaned.replace("+", "");
  }

  if (cleaned.startsWith("233")) {
    return cleaned;
  }

  return cleaned;
};

const EMOJI_BY_CATEGORY = {
  Phones: "📱",
  Laptops: "💻",
  Tablets: "📲",
  Accessories: "🔌",
  Watches: "⌚",
  Audio: "🎧",
  Other: "📦",
};

function bannerInput(theme) {
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

function ProductCard({ product, onBuyNow, onAddToCart, onOpenDetails, loadingId }) {
  const { t } = useTheme();
  const [hov, setHov] = useState(false);
  const emoji = EMOJI_BY_CATEGORY[product.category] || "📦";

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpenDetails(product)}
      style={{
      borderRadius: 20,
      overflow: "hidden",
      background: hov ? t.surfaceHover : t.cardBg,
      border: `1px solid ${hov ? "rgba(197,98,11,0.35)" : t.cardBorder}`,
      backdropFilter: "blur(16px)",
      transform: hov ? "translateY(-5px)" : "none",
      transition: "all 0.3s",
      cursor: "pointer",
    }}>
      <div style={{
        height: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: hov ? "rgba(197,98,11,0.08)" : t.surface,
        padding: 12,
        overflow: "hidden"
      }}>
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        ) : (
          <span style={{
            fontSize: 72,
            filter: hov ? "drop-shadow(0 0 20px rgba(197,98,11,0.5))" : "none",
            transform: hov ? "scale(1.08)" : "scale(1)",
            transition: "all 0.3s",
          }}>{emoji}</span>
        )}
      </div>

      <div style={{ padding: "16px 18px 20px" }}>
        <div style={{ fontSize: 10, color: "#C5620B", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
          {product.brand || "Multiage"} · {product.category}
        </div>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: t.textPrimary, marginBottom: 6 }}>{product.name}</h4>
        <p style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.5, marginBottom: 12 }}>{product.description}</p>
        <div style={{ display: "grid", gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#C5620B" }}>
            GHS {Number(product.price || 0).toLocaleString()}
          </span>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              disabled={!STORE_ACTIVE}
              onClick={(event) => {
                event.stopPropagation();
                if (!STORE_ACTIVE) return;
                onAddToCart(product);
              }}
              style={{
                flex: 1,
                minWidth: 110,
                padding: "9px 14px",
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                color: t.textPrimary,
                cursor: STORE_ACTIVE ? "pointer" : "not-allowed",
                opacity: STORE_ACTIVE ? 1 : 0.6
              }}
            >
              {STORE_ACTIVE ? "Add to Cart" : "Coming Soon"}
            </button>
            <button
              disabled={!STORE_ACTIVE}
              onClick={(event) => {
                event.stopPropagation();
                if (!STORE_ACTIVE) return;
                onBuyNow(product);
              }}
              style={{
                flex: 1,
                minWidth: 110,
                padding: "9px 14px",
                background: "linear-gradient(135deg,#C5620B,#6A2B09)",
                border: "none",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
                cursor: STORE_ACTIVE ? "pointer" : "not-allowed",
                opacity: !STORE_ACTIVE ? 0.6 : (loadingId === product._id ? 0.75 : 1),
              }}
            >
              {STORE_ACTIVE ? (loadingId === product._id ? "Processing..." : "Buy Now") : "Coming Soon"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StorePage() {
  const { t } = useTheme();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { addItem, clearCart } = useCart();
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [buyingId, setBuyingId] = useState("");
  const [bannerOpen, setBannerOpen] = useState(false);
  const [inquiry, setInquiry] = useState({ name: "", email: "", phone: "", deviceRequested: "", message: "" });
  const [inquiryState, setInquiryState] = useState({ loading: false, success: "", error: "" });
  const [toast, setToast] = useState("");
  const toastTimerRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const data = await api.getProducts({
          type: "new",
          category: activeCat === "All" ? "" : activeCat,
          search,
          limit: 24,
        });

        if (!active) return;
        setProducts(data.items || []);
        setFallbackUsed(false);
      } catch (err) {
        if (!active) return;

        setProducts(FALLBACK_PRODUCTS.filter((product) => (
          (activeCat === "All" || product.category === activeCat) &&
          (!search || `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(search.toLowerCase()))
        )));
        setFallbackUsed(true);
        setError(err.message || "Failed to load live products");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();
    return () => { active = false; };
  }, [activeCat, search]);

  const visibleProducts = useMemo(
    () => products.filter((product) => product.type !== "used"),
    [products]
  );

  const handleBuyNow = async (product) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setBuyingId(product._id);
      addItem(product);
      const order = await api.createOrder({
        items: [{ product: product._id, quantity: 1 }],
        note: `Quick order for ${product.name}`,
      }, token);

      const payment = await api.initializePayment({ orderId: order._id }, token);

      localStorage.setItem("multiage_last_order", JSON.stringify(order));
      localStorage.setItem("multiage_pending_order", JSON.stringify(order));
      clearCart();

      if (!payment.authorization_url) {
        throw new Error("Payment link was not returned");
      }

      window.location.href = payment.authorization_url;
    } catch (err) {
      setError(err.message || "Failed to create order");
    } finally {
      setBuyingId("");
    }
  };

  const openDetails = (product) => {
    navigate(`/product/${product._id}`);
  };

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(""), 2200);
  };

  const handleAddToCart = (product) => {
    addItem(product);
    showToast("Item added to cart");
  };

  const updateInquiry = (field) => (event) => {
    setInquiry((current) => ({ ...current, [field]: event.target.value }));
  };

  const sendInquiry = async () => {
    if (!inquiry.name || !inquiry.email || !inquiry.deviceRequested) {
      setInquiryState({
        loading: false,
        success: "",
        error: "Name, email, and requested device are required.",
      });
      return;
    }

    try {
      setInquiryState({ loading: true, success: "", error: "" });
      await api.sendMessage({
        ...inquiry,
        phone: normalizePhone(inquiry.phone),
        service: "Used Device Inquiry",
        kind: "used-device-inquiry",
        source: "store-banner",
        message: inquiry.message || `Customer requested ${inquiry.deviceRequested}`,
      });
      setInquiry({ name: "", email: "", phone: "", deviceRequested: "", message: "" });
      setInquiryState({ loading: false, success: "Inquiry sent successfully.", error: "" });
    } catch (err) {
      setInquiryState({ loading: false, success: "", error: err.message || "Failed to send inquiry" });
    }
  };

  useEffect(() => () => window.clearTimeout(toastTimerRef.current), []);

  return (
    <PageLayout>
      <section style={{ padding: "80px 0 60px", position: "relative", overflow: "hidden" }}>
        <GlowBlob color="#C5620B" size={500} x="80%" y="50%" opacity={0.12} />
        <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
          <SectionLabel>Electronics Store</SectionLabel>
          <PageHeroHeading style={{ marginBottom: 16 }}>
            Premium devices.<br />
            <span style={{ background: "linear-gradient(135deg,#C5620B,#e8892e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Authentic prices.
            </span>
          </PageHeroHeading>
          <p style={{ fontSize: 17, color: t.textSecondary, maxWidth: 520, lineHeight: 1.7, marginBottom: 40 }}>
            Browse our full catalogue of genuine brand-new smartphones, laptops, tablets, and accessories available in Ghana.
          </p>

          <div style={{ position: "relative", maxWidth: 480 }}>
            <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: t.textMuted }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </div>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search devices, brands…"
              style={{
                width: "100%",
                padding: "14px 16px 14px 46px",
                background: t.inputBg,
                border: `1px solid ${t.inputBorder}`,
                borderRadius: 14,
                color: t.textPrimary,
                fontSize: 15,
                outline: "none",
              }}
            />
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px 24px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {STORE_CATS.map((cat) => (
            <button key={cat} onClick={() => setActiveCat(cat)} style={{
              padding: "9px 22px",
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              border: "none",
              background: activeCat === cat ? "linear-gradient(135deg,#C5620B,#6A2B09)" : t.surface,
              color: activeCat === cat ? "#fff" : t.textSecondary,
            }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px 18px" }}>
        <div style={{ padding: "18px 20px", borderRadius: 18, background: "rgba(197,98,11,0.10)", border: "1px solid rgba(197,98,11,0.22)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.textPrimary, marginBottom: 4 }}>
                Looking for used devices? Contact us directly for current stock and condition reports.
              </div>
              <div style={{ fontSize: 13, color: t.textSecondary }}>
                Used devices are managed internally and are not shown in the public store grid.
              </div>
            </div>
            <button
              onClick={() => setBannerOpen((current) => !current)}
              style={{ padding: "10px 18px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#C5620B,#6A2B09)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
            >
              {bannerOpen ? "Hide Request Form" : "Request Used Device"}
            </button>
          </div>

          {bannerOpen && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginTop: 18 }}>
              <input placeholder="Name" value={inquiry.name} onChange={updateInquiry("name")} style={bannerInput(t)} />
              <input placeholder="Email" value={inquiry.email} onChange={updateInquiry("email")} style={bannerInput(t)} />
              <input placeholder="Phone" value={inquiry.phone} onChange={updateInquiry("phone")} style={bannerInput(t)} />
              <input placeholder="Device requested" value={inquiry.deviceRequested} onChange={updateInquiry("deviceRequested")} style={bannerInput(t)} />
              <textarea placeholder="Tell us the model, spec, or condition you want" value={inquiry.message} onChange={updateInquiry("message")} rows={3} style={{ ...bannerInput(t), gridColumn: "1 / -1", resize: "vertical" }} />
              <div style={{ gridColumn: "1 / -1", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <button
                  onClick={sendInquiry}
                  disabled={inquiryState.loading}
                  style={{ padding: "10px 18px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#C5620B,#6A2B09)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
                >
                  {inquiryState.loading ? "Sending..." : "Send Request"}
                </button>
                {inquiryState.success && <span style={{ color: "#1e8449", fontSize: 13 }}>{inquiryState.success}</span>}
                {inquiryState.error && <span style={{ color: "#c0392b", fontSize: 13 }}>{inquiryState.error}</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1260, margin: "0 auto", padding: "0 24px 100px" }}>
        {!STORE_ACTIVE && (
          <div style={{
            marginBottom: 24,
            padding: "14px 20px",
            borderRadius: 14,
            background: "rgba(197,98,11,0.08)",
            border: "1px solid rgba(197,98,11,0.2)",
            color: "#C5620B",
            fontSize: 14,
            fontWeight: 600,
            textAlign: "center"
          }}>
            ⚠️ The store is currently under maintenance. Online purchases are temporarily disabled.
          </div>
        )}

        {error && (
          <div style={{ marginBottom: 18, color: fallbackUsed ? "#C5620B" : "#c0392b", fontSize: 14 }}>
            {fallbackUsed ? `Live API unavailable, showing safe fallback data. ${error}` : error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: t.textMuted }}>Loading products...</div>
        ) : visibleProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: t.textMuted }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 16 }}>No products found for "{search}"</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 22 }}>
            {visibleProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onBuyNow={handleBuyNow}
                onAddToCart={handleAddToCart}
                onOpenDetails={openDetails}
                loadingId={buyingId}
              />
            ))}
          </div>
        )}

        <div style={{ marginTop: 64, padding: "32px 36px", borderRadius: 20, background: "rgba(197,98,11,0.10)", border: "1px solid rgba(197,98,11,0.25)", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ fontSize: 36 }}>📦</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: t.textPrimary, marginBottom: 4 }}>Can't find what you're looking for?</h3>
            <p style={{ fontSize: 14, color: t.textSecondary }}>We can source any brand-new device on request. Contact us via WhatsApp or our contact form and we'll get it for you.</p>
          </div>
          <BtnPrimary href="/contact">Contact Us <Icon d={icons.arrow} size={15} /></BtnPrimary>
        </div>
      </div>

      {toast && (
        <div 
          role="status"
          aria-live="polite"
          aria-atomic="true"
          tabIndex="-1"
          style={{
            position: "fixed",
            right: 20,
            bottom: 20,
            zIndex: 2500,
            padding: "12px 16px",
            borderRadius: 14,
            background: "rgba(30,132,73,0.94)",
            color: "#fff",
            fontWeight: 700,
            boxShadow: "0 16px 40px rgba(0,0,0,0.24)",
          }}>
          {toast}
        </div>
      )}
    </PageLayout>
  );
}
