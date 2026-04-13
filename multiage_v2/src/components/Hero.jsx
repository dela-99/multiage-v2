import { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { useDeviceColor } from "../context/DeviceColorContext";
import { GlowBlob, Icon, BtnPrimary, BtnGhost } from "./ui";
import { icons } from "../constants";

/* ══════════════════════════════════════════════════════════════════
   SLIDE DATA
   — 5 headphones (original) + 3 iPhones + 3 Apple Watches
   + 3 Samsung phones + 3 Laptops  =  17 slides total
   Images: high-quality transparent PNGs from official/CDN sources
   ══════════════════════════════════════════════════════════════════ */
const SLIDES = [
  /* ── Headphones (original 5) ───────────────────────────────────── */
  {
    category: "Audio",
    name: "AirPods Max",
    variant: "Green",
    desc: "Active Noise Cancelling · Spatial Audio · Digital Crown",
    price: "GHS 4,999",
    image: "https://www.yudiz.com/codepen/headphone-slider/green.png",
    bg: "radial-gradient(50% 50% at 50% 50%, #C7F6D0 0%, #7CB686 92%)",
    accent: "#7CB686",
  },
  {
    category: "Audio",
    name: "AirPods Max",
    variant: "Blue",
    desc: "Active Noise Cancelling · Transparency Mode · Bluetooth",
    price: "GHS 4,999",
    image: "https://www.yudiz.com/codepen/headphone-slider/blue.png",
    bg: "radial-gradient(50% 50% at 50% 50%, #D1E4F6 0%, #5F9CCF 100%)",
    accent: "#5F9CCF",
  },
  {
    category: "Audio",
    name: "AirPods Max",
    variant: "Red",
    desc: "Premium audio · Adaptive EQ · H1 chip in each ear cup",
    price: "GHS 4,999",
    image: "https://www.yudiz.com/codepen/headphone-slider/red.png",
    bg: "radial-gradient(50% 50% at 50% 50%, #FFB7B2 0%, #ED746E 100%)",
    accent: "#ED746E",
  },
  {
    category: "Audio",
    name: "AirPods Max",
    variant: "Silver",
    desc: "20-hour battery · Mesh headband · Lightning charging",
    price: "GHS 4,999",
    image: "https://www.yudiz.com/codepen/headphone-slider/white.png",
    bg: "radial-gradient(50% 50% at 50% 50%, #D7D7D7 0%, #979797 100%)",
    accent: "#979797",
  },
  {
    category: "Audio",
    name: "AirPods Max",
    variant: "Space Grey",
    desc: "Immersive sound · Custom acoustic design · iOS integration",
    price: "GHS 4,999",
    image: "https://www.yudiz.com/codepen/headphone-slider/black.png",
    bg: "radial-gradient(50% 50% at 50% 50%, #6B6B6B 0%, #292929 100%)",
    accent: "#555",
  },

  /* ── iPhones ────────────────────────────────────────────────────── */
  {
    category: "iPhone",
    name: "iPhone 15",
    variant: "Pink",
    desc: "48MP camera · Dynamic Island · USB-C · A16 Bionic",
    price: "GHS 7,499",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone15-pink-select-202309?wid=470&hei=556&fmt=png-alpha&.v=1692923777972",
    bg: "radial-gradient(50% 50% at 50% 50%, #FFD6E0 0%, #F4A7B9 100%)",
    accent: "#F4A7B9",
  },
  {
    category: "iPhone",
    name: "iPhone 16",
    variant: "Teal",
    desc: "A18 chip · Camera Control · 48MP Fusion camera · iOS 18",
    price: "GHS 8,999",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone16-teal-select-202409?wid=470&hei=556&fmt=png-alpha&.v=1723577398706",
    bg: "radial-gradient(50% 50% at 50% 50%, #C8EDE8 0%, #6BBCB0 100%)",
    accent: "#6BBCB0",
  },
  {
    category: "iPhone",
    name: "iPhone 16 Pro",
    variant: "Desert Titanium",
    desc: "A18 Pro · 5× Optical Zoom · ProRes Video · 4K 120fps",
    price: "GHS 12,999",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone16pro-deserttitanium-select-202409?wid=470&hei=556&fmt=png-alpha&.v=1723578525664",
    bg: "radial-gradient(50% 50% at 50% 50%, #F0E0C8 0%, #C8A87A 100%)",
    accent: "#C8A87A",
  },

  /* ── Apple Watches ──────────────────────────────────────────────── */
  {
    category: "Apple Watch",
    name: "Apple Watch SE",
    variant: "Midnight",
    desc: "Crash Detection · Heart Rate · GPS · swimproof design",
    price: "GHS 2,999",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQKQ3ref_VW_34FR+watch-case-40-aluminum-midnight-nc-se_VW_34FR+watch-face-40-aluminum-midnight-se_VW_34FR?wid=572&hei=572&trim=1&fmt=png-alpha&.v=1693501802701",
    bg: "radial-gradient(50% 50% at 50% 50%, #4A4A5A 0%, #1C1C2E 100%)",
    accent: "#4A4A5A",
  },
  {
    category: "Apple Watch",
    name: "Apple Watch Series 9",
    variant: "Starlight",
    desc: "Double Tap gesture · S9 chip · Always-On Retina display",
    price: "GHS 4,299",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MR963ref_VW_34FR+watch-case-41-aluminum-starlight-nc-9s_VW_34FR+watch-face-41-aluminum-starlight-9s_VW_34FR?wid=572&hei=572&trim=1&fmt=png-alpha&.v=1694507514284",
    bg: "radial-gradient(50% 50% at 50% 50%, #F0EDE4 0%, #C8C1AE 100%)",
    accent: "#C8C1AE",
  },
  {
    category: "Apple Watch",
    name: "Apple Watch Ultra 2",
    variant: "Titanium",
    desc: "Precision GPS · 60-hour battery · 3000 nit display · 100m depth",
    price: "GHS 8,499",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQDY3ref_VW_34FR+watch-case-49-titanium-ultra2_VW_34FR+watch-face-49-titanium-ultra2_VW_34FR?wid=572&hei=572&trim=1&fmt=png-alpha&.v=1694014993911",
    bg: "radial-gradient(50% 50% at 50% 50%, #E8E0D0 0%, #A09070 100%)",
    accent: "#A09070",
  },

  /* ── Samsung Phones ─────────────────────────────────────────────── */
  {
    category: "Samsung",
    name: "Galaxy S24",
    variant: "Cobalt Violet",
    desc: "50MP OIS camera · Snapdragon 8 Gen 3 · AI features · 5G",
    price: "GHS 6,499",
    image: "https://images.samsung.com/is/image/samsung/p6pim/levant/2401/gallery/levant-galaxy-s24-s921-sm-s921bzvgmea-thumb-539573424?$344_344_PNG$",
    bg: "radial-gradient(50% 50% at 50% 50%, #D4C8E8 0%, #8B6BA8 100%)",
    accent: "#8B6BA8",
  },
  {
    category: "Samsung",
    name: "Galaxy S24+",
    variant: "Jade Green",
    desc: "50MP ProVisual Engine · 4900mAh · 45W fast charging · 5G",
    price: "GHS 7,999",
    image: "https://images.samsung.com/is/image/samsung/p6pim/levant/2401/gallery/levant-galaxy-s24-plus-s926-sm-s926bljgmea-thumb-539573414?$344_344_PNG$",
    bg: "radial-gradient(50% 50% at 50% 50%, #C0DDD0 0%, #5E9E85 100%)",
    accent: "#5E9E85",
  },
  {
    category: "Samsung",
    name: "Galaxy S24 Ultra",
    variant: "Titanium Grey",
    desc: "200MP camera · Integrated S Pen · 6.8\" QHD+ · Galaxy AI",
    price: "GHS 9,499",
    image: "https://images.samsung.com/is/image/samsung/p6pim/levant/2401/gallery/levant-galaxy-s24-ultra-s928-sm-s928bztgmea-thumb-539573378?$344_344_PNG$",
    bg: "radial-gradient(50% 50% at 50% 50%, #D0D0D0 0%, #707070 100%)",
    accent: "#707070",
  },

  /* ── Laptops ────────────────────────────────────────────────────── */
  {
    category: "Laptop",
    name: "MacBook Air M3",
    variant: "Midnight",
    desc: "M3 chip · 18-hour battery · 13.6\" Liquid Retina · fanless",
    price: "GHS 14,499",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=452&hei=420&fmt=png-alpha&.v=1664472230535",
    bg: "radial-gradient(50% 50% at 50% 50%, #4A5060 0%, #1A1E2A 100%)",
    accent: "#4A5060",
  },
  {
    category: "Laptop",
    name: "Dell XPS 15",
    variant: "Platinum Silver",
    desc: "Intel Core i7 · RTX 4060 · 15.6\" OLED touch · 32GB RAM",
    price: "GHS 13,999",
    image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/silver/notebook-xps-15-9530-t-silver-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&wid=4028&hei=3020&qlt=100,1&resMode=sharp2&size=4028,3020&chrss=full&imwidth=5000",
    bg: "radial-gradient(50% 50% at 50% 50%, #E8EAF0 0%, #A0A8BC 100%)",
    accent: "#A0A8BC",
  },
  {
    category: "Laptop",
    name: "HP Spectre x360",
    variant: "Nightfall Black",
    desc: "Intel Evo · 13.5\" 3K2K OLED touch · 360° hinge · 17hr battery",
    price: "GHS 11,499",
    image: "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/knowledgebase/c08474179.png",
    bg: "radial-gradient(50% 50% at 50% 50%, #2A2A3A 0%, #0A0A14 100%)",
    accent: "#3A3A5A",
  },
];

/* ══════════════════════════════════════════════════════════════════
   CSS — direct port of style.css, scoped with .hs- prefix
   ══════════════════════════════════════════════════════════════════ */
const SLIDER_CSS = `
  .hs-section {
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 900px;
    height: 420px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.22);
  }

  /* backgrounds */
  .hs-backgrounds {
    position: absolute;
    inset: 0;
    z-index: 0;
    border-radius: 24px;
    overflow: hidden;
  }
  .hs-bg {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 1s ease;
  }
  .hs-bg.active { opacity: 1; }

  /* content panel — left half */
  .hs-content-wrap {
    position: absolute;
    left: 0; top: 0;
    width: 48%; height: 100%;
    z-index: 2;
    display: flex;
    align-items: center;
    padding: 32px 24px 32px 32px;
  }
  .hs-content { width: 100%; }

  .hs-category {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: rgba(0,0,0,0.45);
    margin-bottom: 10px;
    display: block;
  }
  .hs-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(18px, 2.4vw, 26px);
    line-height: 1.25;
    font-weight: 800;
    margin-bottom: 4px;
    color: #1a0a00;
  }
  .hs-variant {
    font-size: 13px;
    font-weight: 600;
    color: rgba(0,0,0,0.5);
    margin-bottom: 12px;
    display: block;
  }
  .hs-desc {
    font-size: clamp(11px, 1.2vw, 13px);
    line-height: 1.6;
    color: rgba(0,0,0,0.6);
    margin-bottom: 16px;
  }
  .hs-price {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(18px, 2.2vw, 24px);
    font-weight: 900;
    color: #1a0a00;
    margin-bottom: 18px;
  }
  .hs-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    background: rgba(0,0,0,0.12);
    border: 1px solid rgba(0,0,0,0.18);
    border-radius: 100px;
    font-size: 12px;
    font-weight: 700;
    color: rgba(0,0,0,0.7);
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s;
    font-family: inherit;
  }
  .hs-cta:hover { background: rgba(0,0,0,0.2); }

  /* images — right half */
  .hs-images {
    position: absolute;
    right: 0; top: 0;
    width: 52%; height: 100%;
    z-index: 1;
  }
  .hs-img {
    position: absolute;
    top: 50%;
    left: 100%;
    filter: blur(25px);
    transform: translate(-50%, -50%) scale(0.3);
    transition: opacity 2s, filter 2s, transform 2s, left 2s, top 2s;
    object-fit: contain;
    max-width: 340px;
    max-height: 380px;
    height: 85%;
    min-height: 220px;
  }
  .hs-img.active {
    opacity: 1;
    filter: blur(0px);
    transform: translateY(-50%);
    left: 10%;
    top: 50%;
    z-index: 1;
    transition: 2s;
  }
  .hs-img.next {
    opacity: 1;
    filter: blur(35px);
    left: 100%;
    top: 10%;
    transform: translate(-50%, -50%) scale(0.3);
    transition: 2s;
  }
  .hs-img.previous {
    opacity: 1;
    filter: blur(25px);
    left: 95%;
    top: 90%;
    transition: 2s;
  }
  .hs-img.inactive {
    opacity: 0;
    filter: blur(35px);
    left: 100%;
    top: 100%;
    transform: translate(10%, 10%) scale(0.3);
    transition: 2s;
  }

  /* category tabs */
  .hs-tabs {
    display: flex;
    gap: 6px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 16px;
  }
  .hs-tab {
    padding: 5px 14px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.22s ease;
    font-family: inherit;
  }

  /* dots */
  .hs-dots {
    display: flex;
    gap: 5px;
    justify-content: center;
    margin-top: 10px;
    flex-wrap: wrap;
  }
  .hs-dot {
    height: 5px;
    border-radius: 100px;
    cursor: pointer;
    border: none;
    padding: 0;
    transition: width 0.3s ease, background 0.3s ease;
  }

  /* responsive */
  @media (max-width: 767px) {
    .hs-section {
      flex-direction: column;
      height: auto;
      min-height: 560px;
    }
    .hs-content-wrap {
      position: relative;
      width: 100%;
      height: auto;
      padding: 28px 24px 16px;
    }
    .hs-images {
      position: relative;
      width: 100%;
      height: 260px;
    }
    .hs-img { max-width: 200px; max-height: 230px; }
    .hs-img.active { left: 50%; top: 50%; transform: translate(-50%, -50%); }
  }

  @media (max-width: 480px) {
    .hs-section { min-height: 500px; border-radius: 18px; }
    .hs-images  { height: 200px; }
    .hs-img     { max-height: 180px; }
    .hs-name    { font-size: 18px; }
    .hs-price   { font-size: 18px; }
  }
`;

/* Category groups for the tab filter */
const CATEGORIES = ["All", "Audio", "iPhone", "Apple Watch", "Samsung", "Laptop"];

/* ══════════════════════════════════════════════════════════════════
   DEVICE SLIDER  — React conversion of the provided HTML/CSS/JS
   ══════════════════════════════════════════════════════════════════ */
function DeviceSlider() {
  const { t } = useTheme();
  const [activeCategory, setActiveCategory] = useState("All");
  const [index,  setIndex]  = useState(0);
  const timerRef = useRef(null);

  /* Filter slides by active category */
  const filtered = activeCategory === "All"
    ? SLIDES
    : SLIDES.filter(s => s.category === activeCategory);

  const count = filtered.length;

  /* Replicate main.js class logic */
  const getClass = (i) => {
    if (i === index % count)                          return "active";
    if (i === (index - 1 + count) % count)            return "previous";
    if (i === (index + 1) % count)                    return "next";
    return "inactive";
  };

  const advance = () => setIndex(prev => (prev + 1) % count);

  const goTo = (i) => {
    setIndex(i);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, 3000);
  };

  const switchCategory = (cat) => {
    setActiveCategory(cat);
    setIndex(0);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, 3000);
  };

  useEffect(() => {
    setIndex(0);
  }, [activeCategory]);

  useEffect(() => {
    timerRef.current = setInterval(advance, 3000);
    return () => clearInterval(timerRef.current);
  }, [count]);

  const slide = filtered[index % count];
  if (!slide) return null;

  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
      <style>{SLIDER_CSS}</style>

      {/* Category tabs */}
      <div className="hs-tabs" style={{ marginBottom: 14 }}>
        {CATEGORIES.map(cat => {
          const active = cat === activeCategory;
          return (
            <button
              key={cat}
              className="hs-tab"
              onClick={() => switchCategory(cat)}
              style={{
                background: active ? "rgba(197,98,11,0.90)" : t.surface,
                color:      active ? "#fff" : t.textSecondary,
                borderColor: active ? "transparent" : t.border,
                boxShadow:  active ? "0 4px 14px rgba(197,98,11,0.35)" : "none",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Slider card */}
      <div className="hs-section">

        {/* Backgrounds */}
        <div className="hs-backgrounds">
          {filtered.map((s, i) => (
            <div key={i} className={`hs-bg ${i === index % count ? "active" : ""}`}
              style={{ background: s.bg }} />
          ))}
        </div>

        {/* Images */}
        <div className="hs-images">
          {filtered.map((s, i) => (
            <img
              key={i}
              src={s.image}
              alt={`${s.name} ${s.variant}`}
              className={`hs-img ${getClass(i)}`}
              onError={e => {
                /* fallback emoji placeholder if image fails to load */
                e.currentTarget.style.display = "none";
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="hs-content-wrap">
          <div className="hs-content">
            <span className="hs-category">{slide.category}</span>
            <div className="hs-name">{slide.name}</div>
            <span className="hs-variant">{slide.variant}</span>
            <div className="hs-desc">{slide.desc}</div>
            <div className="hs-price">{slide.price}</div>
            <a href="/store" className="hs-cta"
              onClick={e => {
                e.preventDefault();
                window.history.pushState(null, "", "/store");
                window.dispatchEvent(new PopStateEvent("popstate"));
                window.scrollTo(0, 0);
              }}>
              View in Store →
            </a>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="hs-dots">
        {filtered.map((_, i) => (
          <button
            key={i}
            className="hs-dot"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width:      i === index % count ? 18 : 5,
              background: i === index % count ? slide.accent : t.border,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   HERO  — all original layout, CTAs and glows unchanged.
   Only the device carousel block replaced with DeviceSlider.
   ══════════════════════════════════════════════════════════════════ */
export default function Hero() {
  const { t }         = useTheme();
  const { glowColor } = useDeviceColor();

  return (
    <section id="home" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", position: "relative",
      overflow: "hidden", paddingTop: 68,
    }}>
      {/* Background glows — unchanged */}
      <GlowBlob color={glowColor} size={700} x="55%" y="45%" opacity={0.18} />
      <GlowBlob color="#C5620B"   size={500} x="20%" y="80%" opacity={0.12} />

      <div style={{
        maxWidth: 1260, margin: "0 auto", padding: "0 24px",
        textAlign: "center", position: "relative", zIndex: 2, width: "100%",
      }}>
        {/* Eyebrow badge — unchanged */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 18px", background: "rgba(197,98,11,0.15)",
          border: "1px solid rgba(197,98,11,0.35)", borderRadius: 100, marginBottom: 32,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C5620B", boxShadow: "0 0 6px #C5620B" }} />
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: "#C5620B", textTransform: "uppercase" }}>
            Integrated Technology Solutions
          </span>
        </div>

        {/* Headline — unchanged */}
        <h1 style={{
          fontFamily: "'Dans',Georgia,serif",
          fontSize: "clamp(30px,7vw,72px)", fontWeight: 800,
          lineHeight: 1.0, letterSpacing: -2, marginBottom: 24, color: t.textPrimary,
        }}>
          Integrated IT and <br />
          <span style={{ background: "linear-gradient(135deg,#C5620B,#e8892e,#C5620B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Electronics
          </span>{" "}Solutions
        </h1>

        <p style={{ fontSize: "clamp(15px,2vw,20px)", color: t.textSecondary, maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 }}>
          Premium devices, powerful digital solutions, and modern technology services built for individuals and businesses.
        </p>

        {/* CTA buttons — unchanged */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
          <BtnPrimary href="/store">
            Explore Devices <Icon d={icons.arrow} size={16} />
          </BtnPrimary>
          <BtnGhost href="/contact">Work With Us</BtnGhost>
        </div>

        {/* ── Device Slider — replaces old device carousel ── */}
        <DeviceSlider />

      </div>
    </section>
  );
}
