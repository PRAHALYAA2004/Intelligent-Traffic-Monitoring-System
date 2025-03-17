// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbName = process.env.DB_NAME || 'traffic_management';
    const connectionString = process.env.MONGO_URI || `mongodb://localhost:27017/${dbName}`;
    await mongoose.connect(connectionString);
    console.log(`Connected to ${dbName}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process on failure
  }
};

module.exports = connectDB;