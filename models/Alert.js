// backend/models/Alert.js
const mongoose = require('mongoose');

// Define the alert schema
const alertSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['warning', 'error'], required: true },
    time: { type: Date, default: Date.now }
});

// Create the Alert model based on the schema
const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
