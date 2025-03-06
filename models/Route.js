// backend/models/Route.js
const mongoose = require('mongoose');

// Define the route schema
const routeSchema = new mongoose.Schema({
    start: { type: String, required: true },
    end: { type: String, required: true },
    description: { type: String, required: true }
});

// Create the Route model based on the schema
const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
