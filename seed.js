// seed.js
const mongoose = require('mongoose');
const Alert = require('./models/Alert');

mongoose.connect('mongodb://localhost:27017/traffic_management', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        seedDatabase();
    })
    .catch((err) => console.error('Failed to connect to MongoDB', err));

async function seedDatabase() {
    const alerts = [
        { title: 'Accident on Route 5', type: 'error' },
        { title: 'Weather delay on Route 22', type: 'warning' },
        { title: 'Road closure on Main St.', type: 'error' }
    ];

    for (const alert of alerts) {
        const newAlert = new Alert(alert);
        await newAlert.save();
    }

    console.log('Sample alerts inserted');
    process.exit();
}