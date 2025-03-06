// seedRoutes.js
const mongoose = require('mongoose');
const Route = require('./models/Route');

mongoose.connect('mongodb://localhost:27017/traffic_management', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        seedRoutes();
    })
    .catch((err) => console.error('Failed to connect to MongoDB', err));

async function seedRoutes() {
    const routes = [
        { start: 'Main St.', end: 'Route 22', description: 'Clear roads, no incidents.' },
        { start: 'Oak Rd.', end: 'Highway 5', description: 'Expect delays due to road work.' },
        { start: 'Broadway Ave.', end: 'Route 8', description: 'Accident-free route.' }
    ];

    for (const route of routes) {
        const newRoute = new Route(route);
        await newRoute.save();
    }

    console.log('Sample routes inserted');
    process.exit();
}