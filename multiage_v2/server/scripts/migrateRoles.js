const connectDB = require('../config/db');
const User = require('../models/User');
require('dotenv').config();

const updates = [
  { name: 'Japhet', role: 'ceo' },
  { name: 'Ridge', role: 'cyber_it' },
  { name: 'Rutherford', role: 'finance' },
  { name: 'Samuel', role: 'administrator' },
  { name: 'Renders', role: 'secretary' },
  { name: 'Wellingtina', role: 'graphics' }
];

async function run() {
  try {
    await connectDB();
    console.log("Starting role migration...");
    
    for (const update of updates) {
      const res = await User.updateMany(
        { name: new RegExp(update.name, 'i') },
        { $set: { role: update.role } }
      );
      console.log(`Updated users matching "${update.name}" to role "${update.role}": ${res.modifiedCount} modified.`);
    }
    console.log("Migration complete.");
  } catch (err) { console.error(err); }
  process.exit();
}
run();