import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import PageLayout from "../components/PageLayout";
import { BtnPrimary, PageHeroHeading, SectionLabel } from "../components/ui";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { useNavigate, useParams } from "../router";

function placeholderStyle(theme) {
  return {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    color: theme.textMuted,
    display: "grid",
    placeItems: "center",
  };
}

const FALLBACK_IMAGE = "https://res.cloudinary.com/delaridge/image/upload/v1776476116/vhgqjkjeclcvfrsrnhwl.png";

export default function ProductDetails() {
  const { t } = useTheme();
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const sliderRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
        const data = await api.getProduct(id);
        if (!active) {
          return;
        }

        setProduct(data);
        const productImages = Array.isArray(data.images) && data.images.length > 0
          ? data.images
          : data.image
            ? [data.image]
            : [];
        setSelectedImage(productImages[0] || "");
        setError("");
      } catch (err) {
        if (active) {
          setError(err.message || "Failed to load product");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProduct();
    return () => { active = false; };
  }, [id]);

  const images = useMemo(() => {
    if (!product) {
      return [];
    }
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    const single = product.image ? [product.image] : [];
    return single.length > 0 ? single : [FALLBACK_IMAGE];
  }, [product]);

  const handleScroll = useCallback(() => {
    if (!sliderRef.current || images.length === 0) {
      return;
    }

    const index = Math.round(sliderRef.current.scrollLeft / sliderRef.current.offsetWidth);
    setSelectedImage(images[index] || FALLBACK_IMAGE);
  }, [images]);

  const scrollToImage = useCallback((index) => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: index * sliderRef.current.offsetWidth, behavior: "smooth" });
    }
    setSelectedImage(images[index] || FALLBACK_IMAGE);
  }, [images]);

  const specsEntries = useMemo(() => {
    if (!product?.specs || typeof product.specs !== "object" || Array.isArray(product.specs)) {
      return [];
    }
    return Object.entries(product.specs).filter(([, value]) => value !== "" && value !== null && value !== undefined);
  }, [product]);

  const handleBuyNow = async () => {
    if (!product) {
      return;
    }

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const order = await api.createOrder({
        items: [{ product: product._id, quantity: 1 }],
        note: `Quick order for ${product.name}`,
      }, token);

      const payment = await api.initializePayment({ orderId: order._id }, token);

      localStorage.setItem("multiage_last_order", JSON.stringify(order));
      localStorage.setItem("multiage_pending_order", JSON.stringify(order));

      if (!payment.authorization_url) {
        throw new Error("Payment link was not returned");
      }

      window.location.href = payment.authorization_url;
    } catch (err) {
      setError(err.message || "Failed to create order");
    }
  };

  return (
    <PageLayout>
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "82px 24px 100px" }}>
        <SectionLabel>Product Details</SectionLabel>

        {loading ? (
          <div style={{ color: t.textMuted, padding: "60px 0" }}>Loading product...</div>
        ) : error && !product ? (
          <div style={{
            padding: "16px 18px",
            borderRadius: 16,
            background: "rgba(192,57,43,0.12)",
            color: "#c0392b",
            border: "1px solid rgba(192,57,43,0.24)",
          }}>
            {error}
          </div>
        ) : product ? (
          <>
            {error && (
              <div style={{
                marginBottom: 18,
                padding: "14px 16px",
                borderRadius: 16,
                background: "rgba(192,57,43,0.12)",
                color: "#c0392b",
                border: "1px solid rgba(192,57,43,0.24)",
              }}>
                {error}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.05fr) minmax(0,0.95fr)", gap: 28 }} className="grid-responsive">
              <div style={{ display: "grid", gap: 16 }}>
                {/* Main Swipeable Slider */}
                <div style={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  borderRadius: 26,
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  display: "flex",
                  overflow: "hidden",
                  scrollSnapType: "x mandatory",
                  scrollbarWidth: "none", // Firefox
                  msOverflowStyle: "none", // IE/Edge
                }}>
                  <style>{`.slider-container::-webkit-scrollbar { display: none; }`}</style>
                  
                  {images.length > 0 ? (
                    <div 
                      ref={sliderRef}
                      onScroll={handleScroll}
                      className="slider-container"
                      style={{ display: "flex", width: "100%", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                      {images.map((img, idx) => (
                        <div key={idx} style={{ minWidth: "100%", height: "100%", scrollSnapAlign: "start" }}>
                          <img src={img} alt={`${product.name} ${idx}`} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "10px" }} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ ...placeholderStyle(t), width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>No image available</span>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 10 }}>
                    {images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        onClick={() => scrollToImage(index)}
                        style={{
                          width: 80,
                          height: 80,
                          flexShrink: 0,
                          borderRadius: 16,
                          overflow: "hidden",
                          border: selectedImage === image ? "2px solid #C5620B" : `1px solid ${t.border}`,
                          padding: 0,
                          background: t.surface,
                          cursor: "pointer",
                        }}
                      >
                        <img src={image} alt={`${product.name} thumbnail`} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gap: 22, alignContent: "start" }}>
                <div>
                  <PageHeroHeading style={{ marginBottom: 12 }}>
                    {product.name}
                  </PageHeroHeading>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#C5620B", marginBottom: 14 }}>
                    GHS {Number(product.price || 0).toLocaleString()}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    <Badge>{product.category}</Badge>
                    <Badge>{product.type === "used" ? product.condition || "Used" : "New"}</Badge>
                    {product.brand && <Badge>{product.brand}</Badge>}
                  </div>
                </div>

                <Panel title="Description">
                  <p style={{ margin: 0, color: t.textSecondary, lineHeight: 1.8 }}>
                    {product.description || "No description available yet."}
                  </p>
                </Panel>

                {specsEntries.length > 0 && (
                  <Panel title="Specifications">
                    <div style={{ display: "grid", gap: 12 }}>
                      {specsEntries.map(([key, value]) => (
                        <div key={key} style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 18,
                          paddingBottom: 10,
                          borderBottom: `1px solid ${t.border}`,
                          flexWrap: "wrap",
                        }}>
                          <span style={{ color: t.textMuted, textTransform: "capitalize" }}>{key}</span>
                          <span style={{ color: t.textPrimary, fontWeight: 600 }}>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </Panel>
                )}

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <BtnPrimary onClick={handleBuyNow}>Buy Now</BtnPrimary>
                  <BtnPrimary href="/store">Back to Store</BtnPrimary>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </PageLayout>
  );
}

function Panel({ title, children }) {
  const { t } = useTheme();
  return (
    <section style={{
      padding: "22px 24px",
      borderRadius: 22,
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      backdropFilter: "blur(14px)",
    }}>
      <h2 style={{ marginTop: 0, marginBottom: 14, color: t.textPrimary, fontSize: 18, fontWeight: 800 }}>{title}</h2>
      {children}
    </section>
  );
}

function Badge({ children }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "7px 12px",
      borderRadius: 999,
      background: "rgba(197,98,11,0.12)",
      border: "1px solid rgba(197,98,11,0.20)",
      color: "#C5620B",
      fontSize: 12,
      fontWeight: 700,
    }}>
      {children}
    </span>
  );
}
