// models/reportModel.js
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  date_of_incident: String,
  time_of_incident: String,
  location: String,
  vehicle_make: String,
  vehicle_model: String,
  vehicle_color: String,
  license_plate: String,
  violation_type: String,
  description: String,
  reporter_name: String,
  reporter_email: String,
  reporter_phone: String,
  report_id: String,
  status: { type: String, default: "in progress" },
  created_at: { type: Date, default: Date.now },
});

module.exports = (connection) => connection.model("Report", reportSchema, "details");