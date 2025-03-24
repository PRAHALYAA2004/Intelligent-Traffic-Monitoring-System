// models/penaltyModel.js
const mongoose = require("mongoose");

const publicDataSchema = new mongoose.Schema(
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
);

const violationDataSchema = new mongoose.Schema({
  vehicle_number: String,
  car_owner_name: String,
  speed: Number,
  road_type: String,
  penalty_amount: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = (connection) => ({
  PublicData: connection.model("PublicData", publicDataSchema, "public_data"),
  ViolationData: connection.model("ViolationData", violationDataSchema, "violation_data"),
});