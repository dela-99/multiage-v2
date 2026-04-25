const User = require("../models/User");

const admins = [
  {
    name: "Japhet Mensah",
    email: "mrmensah121@gmail.com",
    role: "CEO",
  },
  {
    name: "Samuel Arthur",
    email: "samratarthur@gmail.com",
    role: "ADMINISTRATOR",
  },
  {
    name: "Rutherford Tetteh",
    email: "ruthertett303@gmail.com",
    role: "FINANCE",
  },
  {
    name: "Renders Nketia",
    email: "nketialudorenders@gmail.com",
    role: "MEDIA",
  },
  {
    name: "Ridge Dela Torjagbo",
    email: "ridgedela444@gmail.com",
    role: "CYBER_IT",
  },
  {
    name: "Willentina Edem (Tina)",
    email: "edemwellingtina@gmail.com",
    role: "GRAPHICS",
  },
];

const seedAdmins = async () => {
  console.log("🚀 Starting Admin Seeding...");
  const defaultPassword = "Multiage@2026";

  for (const adminData of admins) {
    const exists = await User.findOne({ email: adminData.email.toLowerCase() });
    if (!exists) {
      await User.create({
        ...adminData,
        password: defaultPassword,
        mustChangePassword: true,
      });
      console.log(`✅ Created Admin: ${adminData.name} (${adminData.role})`);
    } else {
      console.log(`ℹ️ Admin already exists: ${adminData.email}`);
    }
  }
};

module.exports = seedAdmins;