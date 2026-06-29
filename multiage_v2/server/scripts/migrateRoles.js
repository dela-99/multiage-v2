const connectDB = require('../config/db');
const User = require('../models/User');
const mongoose = require('mongoose');
require('dotenv').config();

const updates = [
  { name: 'Japhet', role: 'CEO' },
  { name: 'Ridge', role: 'CYBER_IT' },
  { name: 'Rutherford', role: 'FINANCE' },
  { name: 'Samuel', role: 'ADMINISTRATOR' },
  { name: 'Renders', role: 'SECRETARY' },
  { name: 'Wellingtina', role: 'GRAPHICS' }
];

async function run() {  
  try {
    await connectDB();
    console.log("Starting role migration...");
    
    const promises = updates.map(update => {
      return User.updateMany(
        { name: update.name },
        { $set: { role: update.role } },
        { collation: { locale: 'en', strength: 2 } }
      ).then(res => {
        console.log(`Updated users matching "${update.name}" to role "${update.role}": ${res.modifiedCount} modified.`);
      });
    });

    await Promise.all(promises);

    console.log("Migration complete.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
    process.exit(0);
  }
}
run();