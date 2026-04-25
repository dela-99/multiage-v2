const mongoose = require("mongoose");
const dns = require("dns");

let dnsFallbackApplied = false;

const parseDnsServers = () => {
  const rawServers = process.env.MONGO_DNS_SERVERS || "1.1.1.1,8.8.8.8";
  return rawServers
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const maybeApplyDnsFallback = (error) => {
  const isSrvRefused =
    typeof error?.message === "string" && error.message.includes("querySrv ECONNREFUSED");
  const isSrvUri = typeof process.env.MONGO_URI === "string" && process.env.MONGO_URI.startsWith("mongodb+srv://");

  if (!isSrvRefused || !isSrvUri || dnsFallbackApplied) {
    return false;
  }

  const dnsServers = parseDnsServers();
  if (!dnsServers.length) {
    return false;
  }

  dns.setServers(dnsServers);
  dnsFallbackApplied = true;
  console.warn(`⚠️ Applied MongoDB DNS fallback: ${dnsServers.join(", ")}`);
  return true;
};

const maybeApplyDnsFallbackBeforeConnect = () => {
  const isSrvUri = typeof process.env.MONGO_URI === "string" && process.env.MONGO_URI.startsWith("mongodb+srv://");
  if (!isSrvUri || dnsFallbackApplied) {
    return;
  }

  const dnsServers = parseDnsServers();
  if (!dnsServers.length) {
    return;
  }

  dns.setServers(dnsServers);
  dnsFallbackApplied = true;
  console.log(`ℹ️ Using MongoDB DNS servers: ${dnsServers.join(", ")}`);
};

const connectDB = async (retryCount = 0) => {
  const MAX_RETRIES = 5;
  maybeApplyDnsFallbackBeforeConnect();
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
      socketTimeoutMS: 45000,        // Close sockets after 45s of inactivity
      family: 4,                     // Force IPv4 to resolve SRV record issues
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    if (maybeApplyDnsFallback(error)) {
      console.warn(`⚠️ MongoDB SRV DNS lookup failed once: ${error.message}`);
      console.log("🔄 Retrying MongoDB connection with DNS fallback...");
      return connectDB(retryCount);
    }

    console.error(`❌ MongoDB connection error: ${error.message}`);
    
    if (retryCount < MAX_RETRIES) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      console.log(`🔄 Retrying MongoDB connection in ${delay / 1000}s... (${retryCount + 1}/${MAX_RETRIES})`);
      setTimeout(() => connectDB(retryCount + 1), delay);
    } else {
      console.error("⚠️ Max connection retries reached. Database features will remain unavailable.");
    }
    return null;
  }
};

module.exports = connectDB;
