const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const User = require("../models/User");

const ROLE_ASSIGNMENTS = [
  { name: "Japhet", adminRole: "CEO" },
  { name: "Ridge", adminRole: "CYBER_IT" },
  { name: "Rutherford", adminRole: "FINANCE" },
  { name: "Samuel", adminRole: "ADMINISTRATOR" },
  { name: "Renders", adminRole: "SECRETARY" },
  { name: "Wellingtina", adminRole: "GRAPHICS/MEDIA" },
];

async function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function updateUserRole({ name, adminRole }) {
  const user = await User.findOne({ 
    name: new RegExp(`^${escapeRegex(name)}$`, "i") 
  });

  if (!user) {
    console.warn(`No user found for "${name}"`);
    return;
  }

  user.adminRole = adminRole;
  await user.save();
  console.log(`Updated ${user.name} (${user.email}) -> ${adminRole}`);
}

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  for (const assignment of ROLE_ASSIGNMENTS) {
    await updateUserRole(assignment);
  }
}

main()
  .then(async () => {
    await mongoose.disconnect();
    console.log("Role update complete");
  })
  .catch(async (error) => {
    console.error("Failed to update admin roles:", error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });
