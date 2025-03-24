// models/busModel.js
const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  vehicleNo: String,
  pickup: String,
  drop: String,
  time: String,
});

module.exports = (connection) => connection.model("Bus", busSchema, "bus");