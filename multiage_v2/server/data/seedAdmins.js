const User = require("../models/User");

function loadSeedAdminsConfig() {
  const rawAdmins = process.env.SEED_ADMINS_JSON;
  const defaultPassword = process.env.DEFAULT_TEMP_PASSWORD;

  if (!rawAdmins) {
    throw new Error("SEED_ADMINS_JSON is required to seed admin accounts");
  }

  if (!defaultPassword) {
    throw new Error("DEFAULT_TEMP_PASSWORD is required to seed admin accounts");
  }

  let admins;
  try {
    admins = JSON.parse(rawAdmins);
  } catch {
    throw new Error("SEED_ADMINS_JSON must be valid JSON");
  }

  if (!Array.isArray(admins) || admins.length === 0) {
    throw new Error("SEED_ADMINS_JSON must be a non-empty array");
  }

  return { admins, defaultPassword };
}

const seedAdmins = async () => {
  console.log("🚀 Starting Admin Seeding...");
  const { admins, defaultPassword } = loadSeedAdminsConfig();

  for (const adminData of admins) {
    const name = String(adminData.name || "").trim();
    const email = String(adminData.email || "").trim().toLowerCase();
    const role = String(adminData.role || "").trim().toLowerCase();
    const password = String(adminData.password || defaultPassword || "").trim();

    if (!name || !email || !role || !password) {
      throw new Error("Each admin entry must include name, email, role, and password");
    }

    const exists = await User.findOne({ email });
    if (!exists) {
      await User.create({
        name,
        email,
        role,
        password,
        mustChangePassword: true,
      });
      console.log(`✅ Created Admin: ${name} (${role})`);
    } else {
      console.log(`ℹ️ Admin already exists: ${email}`);
    }
  }
};

module.exports = seedAdmins;