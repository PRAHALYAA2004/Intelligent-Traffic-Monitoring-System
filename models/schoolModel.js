// models/schoolModel.js
const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  school_name: String,
  number_of_violations: Number,
  school_zone_hours: String,
  violation_details: [
    {
      violation_time: String,
      speed_recorded: Number,
      vehicle_id: String,
      location_coordinates: String,
      violation_type: String,
      is_during_operational_hours: Boolean,
      fine_issued: Number,
    },
  ],
});

module.exports = (connection) => connection.model("SchoolZone", schoolSchema, "school_zone_values");