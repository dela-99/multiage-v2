import 'dotenv/config';
import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import cors from 'cors';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const orderRoutes = require('./server/routes/orderRoutes');
const paymentRoutes = require('./server/routes/paymentRoutes');

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;
let users; // Global variable to hold the collection
let products; // Global variable for products

const initialProducts = [
  { name: "Apple iPhone 11", brand: "Apple", category: "Smartphones", description: "6.1-inch Liquid Retina HD display, dual-camera system, A13 Bionic chip.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.1-inch Liquid Retina HD (1792x828)", processor: "A13 Bionic", camera: "12MP dual (wide + ultrawide)", battery: "Up to 17 hours video playback", storage: "64GB / 128GB / 256GB", other: "Face ID, iOS 18+ support" } },
  { name: "Apple iPhone 11 Pro", brand: "Apple", category: "Smartphones", description: "5.8-inch Super Retina XDR display, triple-camera system.", price: 0, image: "", stock: 100, type: "new", specs: { display: "5.8-inch Super Retina XDR OLED", processor: "A13 Bionic", camera: "12MP triple", battery: "Up to 18 hours video playback", storage: "64GB / 256GB / 512GB", other: "Face ID, stainless steel" } },
  { name: "Apple iPhone 11 Pro Max", brand: "Apple", category: "Smartphones", description: "6.5-inch Super Retina XDR display, triple-camera system.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.5-inch Super Retina XDR OLED", processor: "A13 Bionic", camera: "12MP triple", battery: "Up to 20 hours video playback", storage: "64GB / 256GB / 512GB", other: "Face ID" } },
  { name: "Apple iPhone 12", brand: "Apple", category: "Smartphones", description: "6.1-inch Super Retina XDR, 5G capable.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.1-inch Super Retina XDR OLED", processor: "A14 Bionic", camera: "12MP dual", battery: "Up to 17 hours video playback", storage: "64GB / 128GB / 256GB", other: "MagSafe, Ceramic Shield" } },
  { name: "Apple iPhone 12 mini", brand: "Apple", category: "Smartphones", description: "Compact 5.4-inch Super Retina XDR.", price: 0, image: "", stock: 100, type: "new", specs: { display: "5.4-inch Super Retina XDR OLED", processor: "A14 Bionic", camera: "12MP dual", battery: "Up to 15 hours video playback", storage: "64GB / 128GB / 256GB", other: "MagSafe" } },
  { name: "Apple iPhone 12 Pro", brand: "Apple", category: "Smartphones", description: "6.1-inch Super Retina XDR, triple camera with LiDAR.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.1-inch Super Retina XDR OLED", processor: "A14 Bionic", camera: "12MP triple + LiDAR", battery: "Up to 17 hours video playback", storage: "128GB / 256GB / 512GB", other: "MagSafe" } },
  { name: "Apple iPhone 12 Pro Max", brand: "Apple", category: "Smartphones", description: "6.7-inch Super Retina XDR, advanced triple camera.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.7-inch Super Retina XDR OLED", processor: "A14 Bionic", camera: "12MP triple + LiDAR", battery: "Up to 20 hours video playback", storage: "128GB / 256GB / 512GB", other: "MagSafe" } },
  { name: "Apple iPhone 13", brand: "Apple", category: "Smartphones", description: "6.1-inch Super Retina XDR, improved battery.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.1-inch Super Retina XDR OLED", processor: "A15 Bionic", camera: "12MP dual with Cinematic mode", battery: "Up to 19 hours video playback", storage: "128GB / 256GB / 512GB", other: "Ceramic Shield" } },
  { name: "Apple iPhone 13 mini", brand: "Apple", category: "Smartphones", description: "Compact 5.4-inch Super Retina XDR.", price: 0, image: "", stock: 100, type: "new", specs: { display: "5.4-inch Super Retina XDR OLED", processor: "A15 Bionic", camera: "12MP dual", battery: "Up to 17 hours video playback", storage: "128GB / 256GB / 512GB", other: "Ceramic Shield" } },
  { name: "Apple iPhone 13 Pro", brand: "Apple", category: "Smartphones", description: "6.1-inch Super Retina XDR, triple camera.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.1-inch Super Retina XDR OLED (120Hz)", processor: "A15 Bionic", camera: "12MP triple", battery: "Up to 22 hours video playback", storage: "128GB / 256GB / 512GB / 1TB", other: "ProMotion" } },
  { name: "Apple iPhone 13 Pro Max", brand: "Apple", category: "Smartphones", description: "6.7-inch Super Retina XDR, best battery in series.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.7-inch Super Retina XDR OLED (120Hz)", processor: "A15 Bionic", camera: "12MP triple", battery: "Up to 28 hours video playback", storage: "128GB / 256GB / 512GB / 1TB", other: "ProMotion" } },
  { name: "Apple iPhone SE (3rd Generation)", brand: "Apple", category: "Smartphones", description: "Compact 4.7-inch with A15 Bionic.", price: 0, image: "", stock: 100, type: "new", specs: { display: "4.7-inch Retina HD", processor: "A15 Bionic", camera: "12MP single", battery: "Up to 15 hours video playback", storage: "64GB / 128GB / 256GB", other: "Touch ID" } },
  { name: "Apple iPhone 14", brand: "Apple", category: "Smartphones", description: "6.1-inch Super Retina XDR, Crash Detection.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.1-inch Super Retina XDR OLED", processor: "A15 Bionic", camera: "12MP dual", battery: "Up to 20 hours video playback", storage: "128GB / 256GB / 512GB", other: "Satellite SOS" } },
  { name: "Apple iPhone 14 Plus", brand: "Apple", category: "Smartphones", description: "6.7-inch Super Retina XDR.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.7-inch Super Retina XDR OLED", processor: "A15 Bionic", camera: "12MP dual", battery: "Up to 26 hours video playback", storage: "128GB / 256GB / 512GB", other: "Satellite SOS" } },
  { name: "Apple iPhone 14 Pro", brand: "Apple", category: "Smartphones", description: "6.1-inch Super Retina XDR, Dynamic Island.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.1-inch Super Retina XDR OLED (120Hz)", processor: "A16 Bionic", camera: "48MP main + dual", battery: "Up to 23 hours video playback", storage: "128GB / 256GB / 512GB / 1TB", other: "Dynamic Island" } },
  { name: "Apple iPhone 14 Pro Max", brand: "Apple", category: "Smartphones", description: "6.7-inch Super Retina XDR, longest battery.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.7-inch Super Retina XDR OLED (120Hz)", processor: "A16 Bionic", camera: "48MP main + dual", battery: "Up to 29 hours video playback", storage: "128GB / 256GB / 512GB / 1TB", other: "Dynamic Island" } },
  { name: "Apple iPhone 15", brand: "Apple", category: "Smartphones", description: "6.1-inch Super Retina XDR, USB-C, Dynamic Island.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.1-inch Super Retina XDR OLED", processor: "A16 Bionic", camera: "48MP main + ultrawide", battery: "Up to 20 hours video playback", storage: "128GB / 256GB / 512GB", other: "USB-C" } },
  { name: "Apple iPhone 15 Plus", brand: "Apple", category: "Smartphones", description: "6.7-inch Super Retina XDR.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.7-inch Super Retina XDR OLED", processor: "A16 Bionic", camera: "48MP main + ultrawide", battery: "Up to 26 hours video playback", storage: "128GB / 256GB / 512GB", other: "USB-C" } },
  { name: "Apple iPhone 15 Pro", brand: "Apple", category: "Smartphones", description: "6.1-inch Super Retina XDR, titanium frame.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.1-inch Super Retina XDR OLED (120Hz)", processor: "A17 Pro", camera: "48MP main + triple", battery: "Up to 23 hours video playback", storage: "128GB / 256GB / 512GB / 1TB", other: "Titanium, USB-C" } },
  { name: "Apple iPhone 15 Pro Max", brand: "Apple", category: "Smartphones", description: "6.7-inch Super Retina XDR, 5x telephoto.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.7-inch Super Retina XDR OLED (120Hz)", processor: "A17 Pro", camera: "48MP main + triple (5x)", battery: "Up to 29 hours video playback", storage: "256GB / 512GB / 1TB", other: "Titanium" } },
  { name: "Apple iPhone 16", brand: "Apple", category: "Smartphones", description: "6.1-inch Super Retina XDR, Apple Intelligence.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.1-inch Super Retina XDR OLED", processor: "A18", camera: "48MP Fusion + ultrawide", battery: "Up to 22 hours video playback", storage: "128GB / 256GB / 512GB", other: "Camera Control" } },
  { name: "Apple iPhone 16 Plus", brand: "Apple", category: "Smartphones", description: "6.7-inch Super Retina XDR.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.7-inch Super Retina XDR OLED", processor: "A18", camera: "48MP Fusion + ultrawide", battery: "Up to 27 hours video playback", storage: "128GB / 256GB / 512GB", other: "Camera Control" } },
  { name: "Apple iPhone 16 Pro", brand: "Apple", category: "Smartphones", description: "6.3-inch Super Retina XDR, Pro camera system.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.3-inch Super Retina XDR OLED (120Hz)", processor: "A18 Pro", camera: "48MP Fusion + ultrawide + telephoto", battery: "Up to 27 hours video playback", storage: "128GB / 256GB / 512GB / 1TB", other: "Titanium" } },
  { name: "Apple iPhone 16 Pro Max", brand: "Apple", category: "Smartphones", description: "6.9-inch Super Retina XDR, largest Pro.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.9-inch Super Retina XDR OLED (120Hz)", processor: "A18 Pro", camera: "48MP Fusion + ultrawide + 5x telephoto", battery: "Up to 33 hours video playback", storage: "256GB / 512GB / 1TB", other: "Titanium" } },
  { name: "Apple iPhone 17", brand: "Apple", category: "Smartphones", description: "2025 base model with 120Hz display.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.3-inch Super Retina XDR OLED (1-120Hz)", processor: "A19", camera: "48MP wide + 48MP ultrawide", battery: "Up to 30 hours video playback", storage: "256GB / 512GB", other: "Apple Intelligence" } },
  { name: "Apple iPhone 17e", brand: "Apple", category: "Smartphones", description: "Affordable 2026 entry-level model.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.1-inch OLED (60Hz)", processor: "A18", camera: "48MP main", battery: "Up to 27 hours video playback", storage: "128GB / 256GB / 512GB", other: "Budget Apple Intelligence" } },
  { name: "Apple iPhone Air", brand: "Apple", category: "Smartphones", description: "Ultra-thin 2025 iPhone Air.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.5-inch Super Retina XDR OLED (120Hz)", processor: "A19 Pro", camera: "48MP wide", battery: "Up to 27 hours video playback", storage: "256GB / 512GB / 1TB", other: "Thinnest iPhone" } },
  { name: "Apple iPhone 17 Pro", brand: "Apple", category: "Smartphones", description: "2025 Pro with advanced cameras.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.3-inch Super Retina XDR OLED (120Hz)", processor: "A19 Pro", camera: "48MP wide + 48MP ultrawide + 48MP telephoto", battery: "Up to 30 hours video playback", storage: "256GB / 512GB / 1TB", other: "Titanium" } },
  { name: "Apple iPhone 17 Pro Max", brand: "Apple", category: "Smartphones", description: "2025 flagship Pro Max.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.9-inch Super Retina XDR OLED (120Hz)", processor: "A19 Pro", camera: "48MP wide + 48MP ultrawide + 48MP telephoto", battery: "Up to 30 hours video playback", storage: "256GB / 512GB / 1TB / 2TB", other: "Titanium" } },
  { name: "Samsung Galaxy S21", brand: "Samsung", category: "Smartphones", description: "Flagship with 120Hz display and triple cameras.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.2-inch Dynamic AMOLED 2X (120Hz)", processor: "Exynos 2100 / Snapdragon 888", camera: "12MP triple", battery: "4000mAh", storage: "128GB / 256GB", other: "IP68" } },
  { name: "Samsung Galaxy S21+", brand: "Samsung", category: "Smartphones", description: "Larger S21 variant.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.7-inch Dynamic AMOLED 2X (120Hz)", processor: "Exynos 2100 / Snapdragon 888", camera: "12MP triple", battery: "4800mAh", storage: "128GB / 256GB", other: "IP68" } },
  { name: "Samsung Galaxy S21 Ultra", brand: "Samsung", category: "Smartphones", description: "Premium S21 with S Pen support.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.8-inch Dynamic AMOLED 2X (120Hz)", processor: "Exynos 2100 / Snapdragon 888", camera: "108MP main + triple", battery: "5000mAh", storage: "128GB / 256GB / 512GB", other: "S Pen compatible" } },
  { name: "Samsung Galaxy S22", brand: "Samsung", category: "Smartphones", description: "Compact 2022 flagship.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.1-inch Dynamic AMOLED 2X (120Hz)", processor: "Snapdragon 8 Gen 1", camera: "50MP main + triple", battery: "3700mAh", storage: "128GB / 256GB", other: "IP68" } },
  { name: "Samsung Galaxy S22+", brand: "Samsung", category: "Smartphones", description: "Mid-size S22.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.6-inch Dynamic AMOLED 2X (120Hz)", processor: "Snapdragon 8 Gen 1", camera: "50MP main + triple", battery: "4500mAh", storage: "128GB / 256GB", other: "IP68" } },
  { name: "Samsung Galaxy S22 Ultra", brand: "Samsung", category: "Smartphones", description: "S22 Ultra with built-in S Pen.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.8-inch Dynamic AMOLED 2X (120Hz)", processor: "Snapdragon 8 Gen 1", camera: "108MP main + triple", battery: "5000mAh", storage: "128GB / 256GB / 512GB / 1TB", other: "S Pen" } },
  { name: "Samsung Galaxy S23", brand: "Samsung", category: "Smartphones", description: "Compact 2023 flagship.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.1-inch Dynamic AMOLED 2X (120Hz)", processor: "Snapdragon 8 Gen 2", camera: "50MP main + triple", battery: "3900mAh", storage: "128GB / 256GB / 512GB", other: "7 years updates" } },
  { name: "Samsung Galaxy S23+", brand: "Samsung", category: "Smartphones", description: "Mid-size S23.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.6-inch Dynamic AMOLED 2X (120Hz)", processor: "Snapdragon 8 Gen 2", camera: "50MP main + triple", battery: "4700mAh", storage: "256GB / 512GB", other: "7 years updates" } },
  { name: "Samsung Galaxy S23 Ultra", brand: "Samsung", category: "Smartphones", description: "Premium 2023 Ultra with S Pen.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.8-inch Dynamic AMOLED 2X (120Hz)", processor: "Snapdragon 8 Gen 2", camera: "200MP main + triple", battery: "5000mAh", storage: "256GB / 512GB / 1TB", other: "S Pen" } },
  { name: "Samsung Galaxy S24", brand: "Samsung", category: "Smartphones", description: "Galaxy AI flagship.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.2-inch Dynamic AMOLED 2X (1-120Hz)", processor: "Snapdragon 8 Gen 3", camera: "50MP main + triple", battery: "4000mAh", storage: "128GB / 256GB / 512GB", other: "Galaxy AI" } },
  { name: "Samsung Galaxy S24+", brand: "Samsung", category: "Smartphones", description: "Larger S24.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.7-inch Dynamic AMOLED 2X (1-120Hz)", processor: "Snapdragon 8 Gen 3", camera: "50MP main + triple", battery: "4900mAh", storage: "256GB / 512GB", other: "Galaxy AI" } },
  { name: "Samsung Galaxy S24 Ultra", brand: "Samsung", category: "Smartphones", description: "Titanium Ultra with S Pen.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.8-inch Dynamic AMOLED 2X (120Hz)", processor: "Snapdragon 8 Gen 3", camera: "200MP main + triple", battery: "5000mAh", storage: "256GB / 512GB / 1TB", other: "Titanium, S Pen" } },
  { name: "Samsung Galaxy S25", brand: "Samsung", category: "Smartphones", description: "2025 flagship with Snapdragon 8 Elite.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.2-inch Dynamic AMOLED 2X (120Hz)", processor: "Snapdragon 8 Elite", camera: "50MP main + triple", battery: "4000mAh", storage: "128GB / 256GB / 512GB", other: "7 years updates" } },
  { name: "Samsung Galaxy S25+", brand: "Samsung", category: "Smartphones", description: "Mid-size 2025 S25.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.7-inch Dynamic AMOLED 2X (120Hz)", processor: "Snapdragon 8 Elite", camera: "50MP main + triple", battery: "4900mAh", storage: "256GB / 512GB", other: "7 years updates" } },
  { name: "Samsung Galaxy S25 Ultra", brand: "Samsung", category: "Smartphones", description: "2025 Ultra flagship.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.8-inch Dynamic AMOLED 2X (120Hz)", processor: "Snapdragon 8 Elite", camera: "200MP main + triple", battery: "5000mAh", storage: "256GB / 512GB / 1TB", other: "S Pen" } },
  { name: "Samsung Galaxy S26", brand: "Samsung", category: "Smartphones", description: "Latest 2026 S-series base model.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.3-inch Dynamic AMOLED 2X (1-120Hz)", processor: "Snapdragon 8 Elite Gen 5", camera: "50MP main + triple", battery: "4300mAh", storage: "256GB / 512GB", other: "IP68" } },
  { name: "Samsung Galaxy S26+", brand: "Samsung", category: "Smartphones", description: "Larger 2026 S26.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.8-inch Dynamic AMOLED 2X (120Hz)", processor: "Snapdragon 8 Elite Gen 5", camera: "50MP main + triple", battery: "5000mAh", storage: "256GB / 512GB", other: "IP68" } },
  { name: "Samsung Galaxy S26 Ultra", brand: "Samsung", category: "Smartphones", description: "2026 flagship Ultra with S Pen.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.9-inch Dynamic AMOLED 2X (120Hz)", processor: "Snapdragon 8 Elite Gen 5", camera: "200MP main + triple", battery: "5000mAh", storage: "256GB / 512GB / 1TB", other: "Titanium, S Pen" } },
  { name: "Samsung Galaxy A14", brand: "Samsung", category: "Smartphones", description: "Affordable entry-level A-series.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.6-inch FHD+ PLS LCD", processor: "MediaTek / Exynos", camera: "50MP main + dual", battery: "5000mAh", storage: "64GB / 128GB (expandable)", other: "Long support" } },
  { name: "Samsung Galaxy A16", brand: "Samsung", category: "Smartphones", description: "Mid-range A-series 2025.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.7-inch Super AMOLED (90Hz)", processor: "MediaTek Dimensity", camera: "50MP triple", battery: "5000mAh", storage: "128GB (expandable)", other: "IP67" } },
  { name: "Samsung Galaxy A26", brand: "Samsung", category: "Smartphones", description: "2026 A-series mid-range.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.7-inch Super AMOLED (120Hz)", processor: "Exynos 1380", camera: "50MP main + ultrawide", battery: "5000mAh", storage: "128GB / 256GB", other: "6 years updates" } },
  { name: "Samsung Galaxy A36", brand: "Samsung", category: "Smartphones", description: "Mid-tier 2026 A-series.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.7-inch AMOLED (120Hz)", processor: "Exynos 1580", camera: "50MP triple", battery: "5000mAh", storage: "128GB / 256GB", other: "Galaxy AI" } },
  { name: "Samsung Galaxy A56", brand: "Samsung", category: "Smartphones", description: "Higher-end 2026 A-series.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.7-inch Super AMOLED (120Hz)", processor: "Exynos 1580", camera: "50MP main + advanced", battery: "5000mAh", storage: "256GB", other: "IP67" } },
  { name: "Samsung Galaxy A57", brand: "Samsung", category: "Smartphones", description: "Latest 2026 premium A-series.", price: 0, image: "", stock: 100, type: "new", specs: { display: "6.7-inch Super AMOLED+", processor: "Exynos", camera: "50MP triple", battery: "5000mAh", storage: "128GB / 256GB", other: "IP68, AI features" } },
  { name: "MacBook Air 13-inch (M1, 2020)", brand: "Apple", category: "Laptops", description: "Revolutionary thin MacBook with M1 chip.", price: 0, image: "", stock: 100, type: "new", specs: { display: "13.3-inch Retina", processor: "Apple M1", ram: "8GB / 16GB unified", storage: "256GB / 512GB / 1TB / 2TB SSD", battery: "Up to 18 hours", other: "Fanless" } },
  { name: "MacBook Air 13-inch (M2, 2022)", brand: "Apple", category: "Laptops", description: "M2-powered thin and light Air.", price: 0, image: "", stock: 100, type: "new", specs: { display: "13.6-inch Liquid Retina", processor: "Apple M2", ram: "8GB / 16GB / 24GB unified", storage: "256GB / 512GB / 1TB / 2TB SSD", battery: "Up to 18 hours", other: "Fanless" } },
  { name: "MacBook Air 15-inch (M2, 2023)", brand: "Apple", category: "Laptops", description: "Larger M2 Air.", price: 0, image: "", stock: 100, type: "new", specs: { display: "15.3-inch Liquid Retina", processor: "Apple M2", ram: "8GB / 16GB / 24GB unified", storage: "256GB / 512GB / 1TB / 2TB SSD", battery: "Up to 18 hours", other: "Fanless" } },
  { name: "MacBook Pro 14-inch (M1 Pro, 2021)", brand: "Apple", category: "Laptops", description: "First M-series Pro 14-inch.", price: 0, image: "", stock: 100, type: "new", specs: { display: "14.2-inch Liquid Retina XDR", processor: "Apple M1 Pro", ram: "16GB / 32GB unified", storage: "512GB / 1TB / 2TB / 4TB / 8TB SSD", battery: "Up to 17 hours", other: "Mini-LED" } },
  { name: "MacBook Pro 14-inch (M3, 2023)", brand: "Apple", category: "Laptops", description: "M3 Pro laptop.", price: 0, image: "", stock: 100, type: "new", specs: { display: "14.2-inch Liquid Retina XDR", processor: "Apple M3", ram: "8GB / 16GB / 24GB unified", storage: "512GB / 1TB / 2TB SSD", battery: "Up to 22 hours", other: "Ports" } },
  { name: "MacBook Pro 16-inch (M3 Pro, 2023)", brand: "Apple", category: "Laptops", description: "High-performance 16-inch.", price: 0, image: "", stock: 100, type: "new", specs: { display: "16.2-inch Liquid Retina XDR", processor: "Apple M3 Pro", ram: "18GB / 36GB unified", storage: "512GB / 1TB / 2TB SSD", battery: "Up to 22 hours", other: "ProMotion" } },
  { name: "MacBook Air 13-inch (M4, 2025)", brand: "Apple", category: "Laptops", description: "2025 Air with M4.", price: 0, image: "", stock: 100, type: "new", specs: { display: "13.6-inch Liquid Retina", processor: "Apple M4", ram: "16GB / 24GB / 32GB unified", storage: "512GB / 1TB / 2TB SSD", battery: "Up to 18 hours", other: "Base 16GB RAM" } },
  { name: "MacBook Pro 14-inch (M4, 2025)", brand: "Apple", category: "Laptops", description: "Entry Pro with M4.", price: 0, image: "", stock: 100, type: "new", specs: { display: "14.2-inch Liquid Retina XDR", processor: "Apple M4", ram: "16GB / 24GB unified", storage: "512GB / 1TB SSD", battery: "Up to 24 hours", other: "Thunderbolt 5" } },
  { name: "MacBook Air 13-inch (M5, 2026)", brand: "Apple", category: "Laptops", description: "Latest ultrathin Air.", price: 0, image: "", stock: 100, type: "new", specs: { display: "13.6-inch Liquid Retina", processor: "Apple M5", ram: "16GB / 24GB / 32GB unified", storage: "512GB / 1TB / 2TB SSD", battery: "Up to 18 hours", other: "Fanless" } },
  { name: "MacBook Air 15-inch (M5, 2026)", brand: "Apple", category: "Laptops", description: "Larger M5 Air.", price: 0, image: "", stock: 100, type: "new", specs: { display: "15.3-inch Liquid Retina", processor: "Apple M5", ram: "16GB / 24GB / 32GB unified", storage: "512GB / 1TB SSD", battery: "Up to 18 hours", other: "All-day battery" } },
  { name: "MacBook Pro 14-inch (M5 Pro, 2026)", brand: "Apple", category: "Laptops", description: "Pro with M5 Pro chip.", price: 0, image: "", stock: 100, type: "new", specs: { display: "14.2-inch Liquid Retina XDR", processor: "Apple M5 Pro", ram: "24GB / 36GB unified", storage: "1TB / 2TB SSD", battery: "Up to 22 hours", other: "Advanced thermal" } },
  { name: "MacBook Pro 16-inch (M5 Max, 2026)", brand: "Apple", category: "Laptops", description: "Ultimate workstation.", price: 0, image: "", stock: 100, type: "new", specs: { display: "16.2-inch Liquid Retina XDR", processor: "Apple M5 Max", ram: "36GB / 64GB / 128GB unified", storage: "1TB to 8TB SSD", battery: "Up to 24 hours", other: "High-end ports" } },
  { name: "MacBook Neo 13-inch (A18 Pro, 2026)", brand: "Apple", category: "Laptops", description: "Budget MacBook Neo.", price: 0, image: "", stock: 100, type: "new", specs: { display: "13-inch Retina", processor: "Apple A18 Pro", ram: "8GB unified", storage: "256GB / 512GB SSD", battery: "Up to 15 hours", other: "Entry-level" } },
  { name: "Dell XPS 14 (2026)", brand: "Dell", category: "Laptops", description: "Premium ultraportable XPS.", price: 0, image: "", stock: 100, type: "new", specs: { display: "14-inch OLED (up to 3K)", processor: "Intel Core Ultra Series 2", ram: "16GB / 32GB / 64GB", storage: "Up to 2TB SSD", battery: "Up to 16.5 hours", other: "Premium build" } },
  { name: "Dell XPS 16 (2026)", brand: "Dell", category: "Laptops", description: "High-end creator XPS.", price: 0, image: "", stock: 100, type: "new", specs: { display: "16-inch OLED (up to 4K)", processor: "Intel Core Ultra 9", ram: "32GB / 64GB", storage: "Up to 4TB SSD", battery: "Up to 12 hours", other: "NVIDIA RTX" } },
  { name: "Dell Alienware m16 R2", brand: "Dell", category: "Laptops", description: "Gaming m16.", price: 0, image: "", stock: 100, type: "new", specs: { display: "16-inch QHD+ (165Hz)", processor: "Intel Core Ultra", ram: "16GB / 32GB", storage: "1TB / 2TB SSD", battery: "Up to 8 hours", other: "RTX 40/50 series" } },
  { name: "Dell 14 Premium Laptop", brand: "Dell", category: "Laptops", description: "Ultraportable Dell 14 Premium.", price: 0, image: "", stock: 100, type: "new", specs: { display: "14-inch OLED", processor: "Intel Core Ultra X7", ram: "16GB / 32GB", storage: "512GB / 1TB SSD", battery: "Up to 14 hours", other: "Lightweight" } },
  { name: "Dell Alienware x16", brand: "Dell", category: "Laptops", description: "Slim gaming x16.", price: 0, image: "", stock: 100, type: "new", specs: { display: "16-inch QHD+ 240Hz", processor: "Intel Core Ultra 9", ram: "32GB / 64GB", storage: "1TB / 2TB SSD", battery: "Up to 6 hours", other: "Advanced cooling" } },
  { name: "Dell Latitude 14 Pro", brand: "Dell", category: "Laptops", description: "Business Dell Pro 14.", price: 0, image: "", stock: 100, type: "new", specs: { display: "14-inch FHD+", processor: "Intel Core Ultra", ram: "16GB / 32GB", storage: "512GB SSD", battery: "Up to 15 hours", other: "Enterprise" } },
  { name: "Dell Precision 5690", brand: "Dell", category: "Laptops", description: "Mobile workstation.", price: 0, image: "", stock: 100, type: "new", specs: { display: "16-inch 4K OLED", processor: "Intel Core Ultra", ram: "32GB / 64GB", storage: "1TB / 2TB SSD", battery: "Up to 10 hours", other: "ISV certified" } },
  { name: "Dell G15 Gaming Laptop", brand: "Dell", category: "Laptops", description: "Affordable gaming.", price: 0, image: "", stock: 100, type: "new", specs: { display: "15.6-inch FHD 165Hz", processor: "Intel Core i7 / AMD", ram: "16GB", storage: "512GB / 1TB SSD", battery: "Up to 7 hours", other: "RTX" } },
  { name: "Dell 16 Premium Laptop", brand: "Dell", category: "Laptops", description: "Large premium productivity.", price: 0, image: "", stock: 100, type: "new", specs: { display: "16-inch 2.5K", processor: "Intel Core Ultra 9", ram: "32GB", storage: "1TB SSD", battery: "Up to 12 hours", other: "Creator focused" } },
  { name: "Dell Inspiron 16 Plus", brand: "Dell", category: "Laptops", description: "Large everyday with 2-in-1 option.", price: 0, image: "", stock: 100, type: "new", specs: { display: "16-inch 2.5K touch", processor: "Intel Core Ultra", ram: "16GB / 32GB", storage: "1TB SSD", battery: "Up to 12 hours", other: "Convertible" } },
  { name: "Dell Pro 16 Plus", brand: "Dell", category: "Laptops", description: "Enhanced business Pro.", price: 0, image: "", stock: 100, type: "new", specs: { display: "16-inch", processor: "Intel Core Ultra", ram: "32GB", storage: "1TB SSD", battery: "Up to 14 hours", other: "Enterprise" } },
  { name: "Dell Alienware 16 Aurora", brand: "Dell", category: "Laptops", description: "High-end 2026 gaming.", price: 0, image: "", stock: 100, type: "new", specs: { display: "16-inch QHD+", processor: "Intel Core Ultra 9", ram: "32GB / 64GB", storage: "2TB SSD", battery: "Up to 5 hours", other: "RTX 50-series" } },
  { name: "Dell 14 Laptop", brand: "Dell", category: "Laptops", description: "Everyday Dell 14.", price: 0, image: "", stock: 100, type: "new", specs: { display: "14-inch FHD+", processor: "Intel Core Ultra", ram: "8GB / 16GB", storage: "512GB SSD", battery: "Up to 12 hours", other: "Reliable" } },
  { name: "Dell Pro 14 Premium Laptop", brand: "Dell", category: "Laptops", description: "Compact business premium.", price: 0, image: "", stock: 100, type: "new", specs: { display: "14-inch", processor: "Intel Core Ultra", ram: "16GB / 32GB", storage: "512GB SSD", battery: "Up to 14 hours", other: "Enterprise security" } },
  { name: "Dell Precision 5690 Workstation", brand: "Dell", category: "Laptops", description: "Professional workstation.", price: 0, image: "", stock: 100, type: "new", specs: { display: "16-inch", processor: "Intel Core Ultra", ram: "32GB / 64GB", storage: "1TB SSD", battery: "Up to 10 hours", other: "ISV" } },
  { name: "Dell Inspiron 14 Laptop", brand: "Dell", category: "Laptops", description: "Versatile daily laptop.", price: 0, image: "", stock: 100, type: "new", specs: { display: "14-inch FHD+", processor: "Intel / AMD", ram: "8GB / 16GB", storage: "512GB SSD", battery: "Up to 12 hours", other: "Affordable" } },
  { name: "Dell XPS 13 (2026)", brand: "Dell", category: "Laptops", description: "Thinnest XPS ever.", price: 0, image: "", stock: 100, type: "new", specs: { display: "13-inch OLED", processor: "Intel Core Ultra", ram: "16GB / 32GB", storage: "512GB SSD", battery: "Up to 18 hours", other: "Ultra portable" } },
  { name: "HP OmniBook 5 14", brand: "HP", category: "Laptops", description: "Efficient everyday OmniBook.", price: 0, image: "", stock: 100, type: "new", specs: { display: "14-inch FHD", processor: "Intel Core Ultra", ram: "16GB", storage: "512GB SSD", battery: "Up to 18 hours", other: "AI ready" } },
  { name: "HP OmniBook Ultra Flip 14", brand: "HP", category: "Laptops", description: "Versatile 2-in-1.", price: 0, image: "", stock: 100, type: "new", specs: { display: "14-inch OLED touch", processor: "Intel Core Ultra", ram: "16GB / 32GB", storage: "1TB SSD", battery: "Up to 14 hours", other: "360 hinge" } },
  { name: "HP Spectre x360 14 (now OmniBook)", brand: "HP", category: "Laptops", description: "Premium convertible.", price: 0, image: "", stock: 100, type: "new", specs: { display: "14-inch OLED touch", processor: "Intel Core Ultra", ram: "16GB / 32GB", storage: "512GB / 1TB SSD", battery: "Up to 15 hours", other: "Gem-cut" } },
  { name: "HP EliteBook Ultra G1i", brand: "HP", category: "Laptops", description: "Business flagship.", price: 0, image: "", stock: 100, type: "new", specs: { display: "14-inch", processor: "Intel Core Ultra", ram: "16GB / 32GB", storage: "512GB SSD", battery: "Up to 16 hours", other: "Enterprise" } },
  { name: "HP OMEN Transcend 14", brand: "HP", category: "Laptops", description: "Slim gaming/creator.", price: 0, image: "", stock: 100, type: "new", specs: { display: "14-inch 2.8K OLED", processor: "Intel Core Ultra", ram: "32GB", storage: "1TB SSD", battery: "Up to 10 hours", other: "RTX" } },
  { name: "HP Omen Max 16", brand: "HP", category: "Laptops", description: "High-performance gaming.", price: 0, image: "", stock: 100, type: "new", specs: { display: "16-inch QHD+ 240Hz", processor: "Intel Core i9 / AMD Ryzen 9", ram: "32GB / 64GB", storage: "1TB / 2TB SSD", battery: "Up to 6 hours", other: "Advanced cooling" } },
  { name: "HP ZBook Power G11", brand: "HP", category: "Laptops", description: "Mobile workstation.", price: 0, image: "", stock: 100, type: "new", specs: { display: "16-inch", processor: "Intel Core Ultra", ram: "32GB / 64GB", storage: "1TB SSD", battery: "Up to 12 hours", other: "ISV" } },
  { name: "HP Victus 16", brand: "HP", category: "Laptops", description: "Value gaming.", price: 0, image: "", stock: 100, type: "new", specs: { display: "16.1-inch FHD 144Hz", processor: "Intel Core i7 / AMD", ram: "16GB", storage: "512GB SSD", battery: "Up to 8 hours", other: "RTX entry" } },
  { name: "HP OmniBook X Flip 14", brand: "HP", category: "Laptops", description: "Stylish convertible.", price: 0, image: "", stock: 100, type: "new", specs: { display: "14-inch OLED", processor: "Intel Core Ultra", ram: "16GB / 32GB", storage: "1TB SSD", battery: "Up to 14 hours", other: "AI enhanced" } },
  { name: "HP Elite x360 1040", brand: "HP", category: "Laptops", description: "Premium business 2-in-1.", price: 0, image: "", stock: 100, type: "new", specs: { display: "14-inch", processor: "Intel Core Ultra", ram: "16GB / 32GB", storage: "512GB SSD", battery: "Up to 15 hours", other: "Enterprise" } },
  { name: "HP ZBook Studio 16 G11", brand: "HP", category: "Laptops", description: "Creative workstation.", price: 0, image: "", stock: 100, type: "new", specs: { display: "16-inch", processor: "Intel Core Ultra", ram: "32GB / 64GB", storage: "1TB SSD", battery: "Up to 12 hours", other: "ISV" } },
  { name: "Samsung Galaxy Watch 8", brand: "Samsung", category: "Smartwatches", description: "Latest Galaxy Watch with advanced health tracking.", price: 0, image: "", stock: 100, type: "new", specs: { display: "Super AMOLED", processor: "Exynos W1000", battery: "Up to 2 days", features: "Health tracking, Wear OS", other: "IP68, MIL-STD" } },
  { name: "Samsung Galaxy Watch 8 Classic", brand: "Samsung", category: "Smartwatches", description: "Classic with rotating bezel.", price: 0, image: "", stock: 100, type: "new", specs: { display: "Super AMOLED Sapphire", processor: "Exynos W1000", battery: "Up to 2 days", features: "Rotating bezel, health", other: "46mm" } },
  { name: "Samsung Galaxy Watch Ultra", brand: "Samsung", category: "Smartwatches", description: "Rugged outdoor Ultra.", price: 0, image: "", stock: 100, type: "new", specs: { display: "Super AMOLED", processor: "Exynos W1000", battery: "Up to 3 days", features: "Rugged design, health", other: "Titanium" } },
  { name: "Samsung Galaxy Watch 7", brand: "Samsung", category: "Smartwatches", description: "AI features Watch 7.", price: 0, image: "", stock: 100, type: "new", specs: { display: "Super AMOLED", processor: "Exynos W930", battery: "Up to 2 days", features: "Galaxy AI", other: "40/44mm" } },
  { name: "Samsung Galaxy Watch 6", brand: "Samsung", category: "Smartwatches", description: "Improved battery Watch 6.", price: 0, image: "", stock: 100, type: "new", specs: { display: "Super AMOLED", processor: "Exynos W930", battery: "Up to 40 hours", features: "Health tracking", other: "Classic option" } },
  { name: "Samsung Galaxy Watch 5 Pro", brand: "Samsung", category: "Smartwatches", description: "Durable Pro model.", price: 0, image: "", stock: 100, type: "new", specs: { display: "Super AMOLED", processor: "Exynos W920", battery: "Up to 80 hours", features: "Rugged", other: "Titanium" } },
  { name: "Samsung Galaxy Watch FE", brand: "Samsung", category: "Smartwatches", description: "Fan Edition affordable watch.", price: 0, image: "", stock: 100, type: "new", specs: { display: "Super AMOLED", processor: "Exynos", battery: "Up to 2 days", features: "Fitness focused", other: "Value model" } },
  { name: "Samsung Galaxy Watch 4 Classic", brand: "Samsung", category: "Smartwatches", description: "Classic rotating bezel model.", price: 0, image: "", stock: 100, type: "new", specs: { display: "Super AMOLED", processor: "Exynos W920", battery: "Up to 40 hours", features: "Rotating bezel", other: "46mm" } },
  { name: "AirPods 4", brand: "Apple", category: "Earbuds", description: "Open-fit AirPods with improved sound.", price: 0, image: "", stock: 100, type: "new", specs: { driver: "Custom high-excursion", features: "Personalized Spatial Audio", battery: "Up to 5 hours (30 with case)", connectivity: "Bluetooth 5.3, H2 chip", other: "IP54" } },
  { name: "AirPods 4 with Active Noise Cancellation", brand: "Apple", category: "Earbuds", description: "ANC version of AirPods 4.", price: 0, image: "", stock: 100, type: "new", specs: { driver: "Custom high-excursion", features: "ANC, Transparency", battery: "Up to 5 hours (30 with case)", connectivity: "Bluetooth 5.3, H2", other: "Adaptive EQ" } },
  { name: "AirPods Pro 3", brand: "Apple", category: "Earbuds", description: "Premium Pro with advanced ANC.", price: 0, image: "", stock: 100, type: "new", specs: { driver: "Custom Apple", features: "Advanced ANC, Adaptive Audio", battery: "Up to 6 hours (30 with case)", connectivity: "Bluetooth 5.3, H2", other: "Hearing health" } },
  { name: "AirPods Pro 2", brand: "Apple", category: "Earbuds", description: "H2 chip Pro model.", price: 0, image: "", stock: 100, type: "new", specs: { driver: "Custom", features: "ANC, Transparency", battery: "Up to 6 hours (30 with case)", connectivity: "Bluetooth 5.3", other: "IP54" } },
  { name: "AirPods Max 2", brand: "Apple", category: "Headphones", description: "Over-ear Max with spatial audio.", price: 0, image: "", stock: 100, type: "new", specs: { driver: "40mm dynamic", features: "ANC, Spatial Audio", battery: "Up to 20 hours", connectivity: "Bluetooth 5.3", other: "Premium materials" } },
  { name: "AirPods Max (USB-C)", brand: "Apple", category: "Headphones", description: "Updated AirPods Max with USB-C charging.", price: 0, image: "", stock: 100, type: "new", specs: { driver: "40mm dynamic", features: "ANC, Spatial Audio with head tracking", battery: "Up to 20 hours", connectivity: "Bluetooth 5.3, USB-C", other: "Digital Crown control" } },
  { name: "AirPods (3rd generation)", brand: "Apple", category: "Earbuds", description: "Classic AirPods with spatial audio.", price: 0, image: "", stock: 100, type: "new", specs: { driver: "Custom Apple", features: "Spatial Audio", battery: "Up to 6 hours (30 with case)", connectivity: "Bluetooth 5.0", other: "Sweat resistant" } },
  { name: "Apple EarPods (USB-C)", brand: "Apple", category: "Earbuds", description: "Wired EarPods with USB-C connector.", price: 0, image: "", stock: 100, type: "new", specs: { driver: "Custom", features: "Inline remote and mic", battery: "N/A (wired)", connectivity: "USB-C", other: "Comfortable open-ear design" } },
  { name: "Samsung Galaxy Buds4 Pro", brand: "Samsung", category: "Earbuds", description: "2026 flagship Galaxy Buds with Hi-Res Audio and Adaptive ANC 2.0.", price: 0, image: "", stock: 100, type: "new", specs: { driver: "2-way speakers with dual amplifiers", features: "Hi-Res Audio, Adaptive ANC 2.0, AI features, Live Translation", battery: "Up to 6-8 hours (30+ with case)", connectivity: "Bluetooth 5.3, Seamless Galaxy integration", other: "IP57 dust/water resistant, canal-fit design" } },
  { name: "Samsung Galaxy Buds4", brand: "Samsung", category: "Earbuds", description: "2026 open-fit Galaxy Buds with Adaptive ANC.", price: 0, image: "", stock: 100, type: "new", specs: { driver: "Custom dynamic", features: "Adaptive ANC 1.0, Ambient Aware, Galaxy AI", battery: "Up to 5-7 hours (28+ with case)", connectivity: "Bluetooth 5.3", other: "IP54, open-type design for awareness" } },
  { name: "Samsung Galaxy Buds3 Pro", brand: "Samsung", category: "Earbuds", description: "Premium stem-style Galaxy Buds with advanced ANC.", price: 0, image: "", stock: 100, type: "new", specs: { driver: "2-way speakers", features: "ANC, 360 Audio, Auto sound optimization", battery: "Up to 6 hours (30 with case)", connectivity: "Bluetooth 5.3", other: "IPX7 sweat resistant, redesigned stem" } },
  { name: "Samsung Galaxy Buds3", brand: "Samsung", category: "Earbuds", description: "Mid-tier 2024/2025 Galaxy Buds with stem design.", price: 0, image: "", stock: 100, type: "new", specs: { driver: "Single driver", features: "ANC, Ambient Sound", battery: "Up to 6 hours (26 with case)", connectivity: "Bluetooth 5.3", other: "Lightweight, Galaxy ecosystem" } },
  { name: "Samsung Galaxy Buds2 Pro", brand: "Samsung", category: "Earbuds", description: "Compact high-performance Galaxy Buds with 360 Audio.", price: 0, image: "", stock: 100, type: "new", specs: { driver: "2-way (woofer + tweeter)", features: "Intelligent ANC, 360 Audio", battery: "Up to 5-8 hours (29 with case)", connectivity: "Bluetooth 5.3", other: "IPX7, comfortable fit" } },
  { name: "Samsung Galaxy Buds2", brand: "Samsung", category: "Earbuds", description: "Balanced everyday Galaxy Buds.", price: 0, image: "", stock: 100, type: "new", specs: { driver: "2-way dynamic", features: "Active Noise Cancellation", battery: "Up to 5-7.5 hours (29 with case)", connectivity: "Bluetooth 5.2", other: "IPX2, multiple colors" } },
  { name: "Samsung Galaxy Buds FE", brand: "Samsung", category: "Earbuds", description: "Fan Edition affordable Galaxy Buds.", price: 0, image: "", stock: 100, type: "new", specs: { driver: "Custom", features: "ANC, Ambient mode", battery: "Up to 8.5 hours (30 with case)", connectivity: "Bluetooth 5.2", other: "Value-oriented with good bass" } },
  { name: "Samsung Galaxy Buds Live", brand: "Samsung", category: "Earbuds", description: "Iconic bean-shaped Galaxy Buds Live.", price: 0, image: "", stock: 100, type: "new", specs: { driver: "12mm driver", features: "Active Noise Cancellation", battery: "Up to 5.5-8 hours (28 with case)", connectivity: "Bluetooth 5.0", other: "Open fit, unique design" } },
  { name: "Samsung Galaxy Buds Pro", brand: "Samsung", category: "Earbuds", description: "Early premium Galaxy Buds Pro with intelligent ANC.", price: 0, image: "", stock: 100, type: "new", specs: { driver: "2-way (11mm woofer + 6.5mm tweeter)", features: "Intelligent ANC, 360 Audio", battery: "Up to 5-8 hours (28 with case)", connectivity: "Bluetooth 5.0", other: "IPX7 water resistant" } }
];

app.use(cors());
app.use(express.json());

// Serve static files from the dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// --- Order & Payment Routes ---
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ ERROR: MONGODB_URI is not defined in the environment.");
  console.error("Please ensure that the .env file exists in the root directory and contains a valid MONGODB_URI variable.");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Health Check / Base Route
app.get('/', (req, res) => {
  res.send({ status: "Server is running", database: users ? "Connected" : "Not Ready" });
});

// --- Product Endpoints ---

// Get Products (Used by StorePage.jsx)
app.get('/api/products', async (req, res) => {
  if (!products) return res.status(503).json({ success: false, message: "Database not ready" });
  try {
    const { category, search, type } = req.query;
    const filter = {};

    if (category && category !== "All") {
      if (category === "Phones") filter.category = "Smartphones";
      else if (category === "Watches") filter.category = "Smartwatches";
      else if (category === "Audio") filter.category = { $in: ["Earbuds", "Headphones"] };
      else filter.category = category;
    }

    if (type) filter.type = String(type).toLowerCase();
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const items = await products.find(filter).sort({ createdAt: -1 }).toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Seed Route - Supports both /api/seed and /api/seed-products
app.all(['/api/seed', '/api/seed-products'], async (req, res) => {
  if (!products) return res.status(503).json({ success: false, message: "Database not ready" });
  try {
    await products.deleteMany({}); 
    await products.insertMany(initialProducts.map(p => ({ ...p, createdAt: new Date() })));
    res.json({ success: true, message: `Successfully seeded ${initialProducts.length} products.` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Seeding failed" });
  }
});

// Create Product (Used by AdminDashboard.jsx)
app.post('/api/products', async (req, res) => {
  if (!products) return res.status(503).json({ success: false, message: "Database not ready" });
  
  try {
    const payload = {
      ...req.body,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      createdAt: new Date()
    };
    
    const result = await products.insertOne(payload);
    res.status(201).json({ 
      ...payload, 
      _id: result.insertedId 
    });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ success: false, message: "Error creating product" });
  }
});

// 1. Register routes immediately so they are NEVER "Not Found"
// Registration Endpoint
app.post('/api/register', async (req, res) => {
  if (!users) return res.status(503).json({ success: false, message: "Database not ready" });
  const { email, password, role } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });
    const exists = await users.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "User already exists" });

    await users.insertOne({ email, password, role: role || "user" });
    res.status(201).json({ success: true, message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating user" });
  }
});

// Authentication Endpoint
app.post('/api/login', async (req, res) => {
  if (!users) return res.status(503).json({ success: false, message: "Database not ready" });
  const { email, password, role } = req.body;
  try {
    const user = await users.findOne({ email, password, role });
    if (user) {
      res.status(200).json({ success: true, message: "Login successful", user: { email: user.email, role: user.role } });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// SPA fallback route - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 2. Start the server immediately
app.listen(port, () => {
  console.log(`🚀 Backend server is live at http://localhost:${port}`);
  connectToDB();
});

// 3. Connect to the database in the background
async function connectToDB() {
  try {
    console.log("⏳ Attempting to connect to MongoDB Atlas...");
    await client.connect();
    const db = client.db("multiage_db"); // Explicitly naming the DB
    users = db.collection("users");
    products = db.collection("products");

    // --- SEEDING DATA ---
    // If your products collection is empty, this will add your JSON data.
    const productCount = await products.countDocuments();
    console.log(`📊 Current database product count: ${productCount}`);

    if (productCount === 0) {
      console.log("ℹ️ Product collection is empty. Seeding initial data...");
      await products.insertMany(initialProducts.map(p => ({ ...p, createdAt: new Date() })));
      console.log(`✅ Successfully seeded ${initialProducts.length} products into the database.`);
    }

    console.log("✅ Successfully connected to MongoDB and initialized collections!");
  } catch (err) {
    console.error("❌ MongoDB connection error! Database routes will return 503.");
    console.error("Please check your network connection and ensure your IP address is whitelisted in MongoDB Atlas.");
    console.error("Error details:", err.message);
  }
}
