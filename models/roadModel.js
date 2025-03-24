// models/roadModel.js
const mongoose = require("mongoose");

const roadSchema = new mongoose.Schema({
  road_name: String,
  speed_limit: { type: String, enum: ["0-20", "30-60", "70-90"] },
  restrictions: String,
});

module.exports = (connection) => connection.model("RoadSpeed", roadSchema, "zonespeed_values");