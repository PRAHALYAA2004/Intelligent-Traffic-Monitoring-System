// server.js (in ITMS root)
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Import models
const Alert = require('./models/Alert');
const Route = require('./models/Route');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Set up Socket.IO

const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes (existing ITMS routes)
app.use('/auth', require('./routes/authRoutes'));

// Connect to ITMS MongoDB (already defined in ITMS, adjust if in config/db.js)
mongoose.connect('mongodb://localhost:27017/traffic_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Socket.IO connection for real-time alerts
io.on('connection', (socket) => {
  console.log('A user connected');

  // Emit real-time alerts and routes every 10 seconds
  setInterval(async () => {
    try {
      const alerts = await Alert.find().sort({ time: -1 }).limit(5);
      const routes = await Route.find().limit(5);
      console.log("Sending route suggestions:", routes);
      console.log("Sending alerts:", alerts);

      socket.emit('route-suggestions', routes);

      alerts.forEach(alert => {
        socket.emit('new-alert', {
          title: alert.title,
          type: alert.type,
          time: alert.time.toLocaleTimeString()
        });
      });
    } catch (err) {
      console.error('Error fetching alerts or routes:', err);
    }
  }, 10000);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});