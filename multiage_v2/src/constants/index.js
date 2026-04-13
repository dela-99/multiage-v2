// ── Brand Themes ───────────────────────────────────────────────────────────────
export const THEMES = { DARK: "dark", LIGHT: "light" };

// ── SVG Icon Paths ─────────────────────────────────────────────────────────────
export const icons = {
  sun:       "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z",
  moon:      "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  menu:      "M3 12h18M3 6h18M3 18h18",
  close:     "M18 6 6 18M6 6l12 12",
  arrow:     "M5 12h14M12 5l7 7-7 7",
  chevron:   "M9 18l6-6-6-6",
  phone:     "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.07 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z",
  mail:      "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2-8 5-8-5",
  globe:     "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  monitor:   "M2 3h20v14H2zM8 21h8M12 17v4",
  watch:     "M12 9v4l2 2M12 2a7 7 0 1 0 0 14A7 7 0 0 0 12 2zM12 1v2M12 21v-2",
  headset:   "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z",
  network:   "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
  code:      "M16 18l6-6-6-6M8 6l-6 6 6 6",
  camera:    "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  whatsapp:  "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  send:      "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z",
  star:      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  zap:       "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
  users:     "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  tiktok:    "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z",
  instagram: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z",
  twitter:   "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z",
  facebook:  "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  youtube:   "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z",
  laptop:    "M2 20h20M4 4h16v12H4z",
  check:     "M20 6 9 17l-5-5",
};

// ── Device Colour → Background Glow Map ───────────────────────────────────────
// Extend this object when new device colour options are added.
export const DEVICE_COLORS = {
  midnight:  { label: "Midnight",    hex: "#1a1a2e", glow: "rgba(26,26,46,0.9)" },
  starlight: { label: "Starlight",   hex: "#f5f0e8", glow: "rgba(245,240,232,0.4)" },
  blue:      { label: "Blue",        hex: "#2c5f8a", glow: "rgba(44,95,138,0.7)" },
  red:       { label: "Product Red", hex: "#c0392b", glow: "rgba(192,57,43,0.7)" },
  purple:    { label: "Deep Purple", hex: "#6c3483", glow: "rgba(108,52,131,0.7)" },
  gold:      { label: "Gold",        hex: "#d4a800", glow: "rgba(212,168,0,0.6)" },
};

// ── Navigation ─────────────────────────────────────────────────────────────────
export const NAV_LINKS = ["Home", "Devices", "Services", "Studio", "Contact"];

// ── Device Category Filters ───────────────────────────────────────────────────
export const DEVICE_CATS = ["All", "iPhone", "Samsung", "Laptop", "Watch", "Headset"];

// ── Catalogue ─────────────────────────────────────────────────────────────────
// Replace `emoji` with an `image` path (e.g. "/assets/devices/iphone-15-pro.png")
// once real product photography is available.
// Set `price` to null to hide price until connected to a pricing API.
export const DEVICES = [
  { id: 1,  cat: "iPhone",  name: "iPhone 15 Pro",          price: "GHS 9,999",  badge: "New",  image: null, emoji: "📱" },
  { id: 2,  cat: "iPhone",  name: "iPhone 15",              price: "GHS 7,499",  badge: "",     image: null, emoji: "📱" },
  { id: 3,  cat: "Samsung", name: "Galaxy S24 Ultra",       price: "GHS 9,499",  badge: "Hot",  image: null, emoji: "📱" },
  { id: 4,  cat: "Samsung", name: "Galaxy S24+",            price: "GHS 7,299",  badge: "",     image: null, emoji: "📱" },
  { id: 5,  cat: "Laptop",  name: 'MacBook Pro 14"',        price: "GHS 18,999", badge: "Pro",  image: null, emoji: "💻" },
  { id: 6,  cat: "Laptop",  name: "MacBook Air M3",         price: "GHS 14,499", badge: "",     image: null, emoji: "💻" },
  { id: 7,  cat: "Laptop",  name: "Dell XPS 15",            price: "GHS 13,999", badge: "",     image: null, emoji: "💻" },
  { id: 8,  cat: "Watch",   name: "Apple Watch Series 9",   price: "GHS 4,299",  badge: "",     image: null, emoji: "⌚" },
  { id: 9,  cat: "Watch",   name: "Samsung Galaxy Watch 6", price: "GHS 3,499",  badge: "",     image: null, emoji: "⌚" },
  { id: 10, cat: "Headset", name: "AirPods Pro 2",          price: "GHS 3,299",  badge: "Sale", image: null, emoji: "🎧" },
  { id: 11, cat: "Headset", name: "Galaxy Buds2 Pro",       price: "GHS 2,499",  badge: "",     image: null, emoji: "🎧" },
];

// ── Services Grid Cards ────────────────────────────────────────────────────────
export const SERVICES_GRID = [
  { icon: "phone",   title: "Electronics Store",        desc: "Latest smartphones, laptops, and accessories from top global brands." },
  { icon: "code",    title: "Software Development",     desc: "Full-stack web and mobile applications built to scale." },
  { icon: "camera",  title: "Graphics & Video Editing", desc: "Visual identity, brand design and professional media production." },
  { icon: "network", title: "Networking",               desc: "Enterprise and home network infrastructure and managed IT." },
  { icon: "globe",   title: "Studio Services",          desc: "Recording, digital media production and creative content." },
];

// ── Auto-Scrolling Slider Cards ───────────────────────────────────────────────
// Duplicated set is intentional — the slider doubles the array to create a
// seamless infinite scroll effect. Add real cards here; duplication is handled
// inside the component.
export const SLIDER_CARDS = [
  { icon: "phone",   title: "Electronics Store",    sub: "Smartphones, laptops & accessories",  color: "#C5620B" },
  { icon: "code",    title: "Software Development", sub: "Web & mobile applications",           color: "#6A2B09" },
  { icon: "network", title: "Networking Solutions", sub: "Professional network infrastructure",  color: "#8B3A1A" },
  { icon: "camera",  title: "Creative Studio",      sub: "Media production & digital content",  color: "#C5620B" },
  { icon: "users",   title: "IT Consulting",        sub: "Technology strategy & support",       color: "#4A1E07" },
  { icon: "zap",     title: "Cloud Services",       sub: "Managed cloud & deployment",          color: "#D4750E" },
];

// ── Footer Social Links ────────────────────────────────────────────────────────
export const SOCIALS = [
  { icon: "whatsapp",  label: "WhatsApp",  color: "#25D366", href: "https://whatsapp.com/channel/0029VbBFSR7BFLgVK4WXDY3w" },
  { icon: "youtube",   label: "YouTube",   color: "#FF0000", href: "https://youtube.com/@multiage_studios_01?si=t6WYq4yswmoOfFka" },
  { icon: "tiktok",    label: "TikTok",    color: "#69C9D0", href: "https://www.tiktok.com/@multiage.technolog?_r=1&_t=ZS-94JF03BcXGD" },
  { icon: "instagram", label: "Instagram", color: "#E1306C", href: "https://www.instagram.com/multiage_technologies?igsh=MXVxeHJ0b2ZxNHg3ZA==" },
];

// ── Hero Device Carousel Items ────────────────────────────────────────────────
// Replace `emoji` with `image` once photography is available.
export const HERO_DEVICES = [
  { label: "iPhone 15 Pro",     emoji: "📱", sub: "Titanium · 48MP · A17 Pro",          image: null },
  { label: "Galaxy S24 Ultra",  emoji: "📱", sub: "AI-Powered · 200MP · S Pen",         image: null },
  { label: 'MacBook Pro 14"',   emoji: "💻", sub: "M3 Pro · 18-hour battery",           image: null },
  { label: "Apple Watch S9",    emoji: "⌚", sub: "Carbon Neutral · Health Suite",      image: null },
];
