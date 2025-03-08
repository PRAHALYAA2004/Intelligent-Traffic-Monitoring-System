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

// Connect to ITMS MongoDB
mongoose.connect('mongodb://localhost:27017/traffic_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


// Create a separate connection to the admin database
const adminConnection = mongoose.createConnection('mongodb://localhost:27017/admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
adminConnection.on('connected', () => console.log('Connected to admin MongoDB'));
adminConnection.on('error', (err) => console.error('admin MongoDB connection error:', err));

// Define the Violation model using the admin connection
const ViolationSchema = new mongoose.Schema({
  car_registration_number: String,
  speed: Number,
  road_type: String,
  penalty_amount: Number
});
const Violation = adminConnection.model('Violation', ViolationSchema);



// Penalty System Routes
app.post('/violations', async (req, res) => {
    try {
        const { car_registration_number, speed, road_type, penalty_amount } = req.body;
        const violation = new Violation({ car_registration_number, speed, road_type, penalty_amount });
        await violation.save();
        res.status(201).json({ message: "Violation added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/violations', async (req, res) => {
    try {
        const violations = await Violation.find();
        res.json(violations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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