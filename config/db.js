// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Traffic Management DB (for authentication and user data)
    const trafficDBName = process.env.DB_NAME || "traffic_management";
    const trafficConnectionString =
      process.env.MONGO_URI || `mongodb://localhost:27017/${trafficDBName}`;
    const trafficConn = await mongoose.createConnection(trafficConnectionString).asPromise();
    console.log(`Connected to ${trafficDBName}`);

    // ZoneSpeed DB (for road speed limits)
    const zoneSpeedConn = await mongoose.createConnection(
      "mongodb://localhost:27017/zonespeed"
    ).asPromise();
    console.log("Connected to zonespeed");

    // School Zone DB (for school zone data)
    const schoolZoneConn = await mongoose.createConnection(
      "mongodb://localhost:27017/school_zone"
    ).asPromise();
    console.log("Connected to school_zone");

    // Transport DB (for bus schedules)
    const transportConn = await mongoose.createConnection(
      "mongodb://localhost:27017/transport"
    ).asPromise();
    console.log("Connected to transport");

    // Penalty System Speed DB (for penalty system data)
    const penaltyConn = await mongoose.createConnection(
      "mongodb://localhost:27017/penalty_system_speed"
    ).asPromise();
    console.log("Connected to penalty_system_speed");

    // Traffic Watch DB (for traffic-signal.html reports)
    const trafficWatchConn = await mongoose.createConnection(
      "mongodb://localhost:27017/traffic_watch"
    ).asPromise();
    console.log("Connected to traffic_watch");

    // Test query for penalty_system_speed to verify data access
    const PublicData = penaltyConn.model(
      "PublicData",
      new mongoose.Schema(
        {
          car_owner_name: String,
          vehicle_number: String,
          phone_number: String,
          address: String,
          email: String,
          vehicle_type: String,
          vehicle_model: String,
          registration_year: Number,
          license_number: String,
          penalty_count: Number,
        },
        { strict: false }
      ),
      "public_data"
    );
    const testData = await PublicData.findOne({ vehicle_number: "AB123CD" });
    console.log("Test query result for AB123CD in penalty_system_speed:", testData);

    return {
      trafficConn,
      zoneSpeedConn,
      schoolZoneConn,
      transportConn,
      penaltyConn,
      trafficWatchConn, // Add the new connection
    };
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;