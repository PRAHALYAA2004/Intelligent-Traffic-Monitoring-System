const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('../Intelligent-Traffic-Monitoring-System/models/userModel');

// Import models


const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Set up Socket.IO

const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes (existing ITMS routes)
app.use('/auth', require('./routes/authRoutes'));

// Connect to ITMS MongoDB
// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
      const dbName = process.env.DB_NAME || 'traffic_management';
      const connectionString = process.env.MONGO_URI || `mongodb://localhost:27017/${dbName}`;
      await mongoose.connect(connectionString);
      console.log(`Connected to ${dbName}`);
  } catch (err) {
      console.error('MongoDB connection error:', err);
  }
};

// Call the connection function
connectDB();

// Create a separate connection to the admin database
const adminConnection = mongoose.createConnection('mongodb://localhost:27017/admin');
adminConnection.on('connected', () => console.log('Connected to admin MongoDB'));
adminConnection.on('error', (err) => console.error('admin MongoDB connection error:', err));

// Create a separate connection to the booking database
const bookingConnection = mongoose.createConnection('mongodb://localhost:27017/bookingDB');
bookingConnection.on('connected', () => console.log('Connected to booking MongoDB'));
bookingConnection.on('error', (err) => console.error('booking MongoDB connection error:', err));

// Define the Violation model using the admin connection
const ViolationSchema = new mongoose.Schema({
  car_registration_number: String,
  speed: Number,
  road_type: String,
  penalty_amount: Number
});
const Violation = adminConnection.model('Violation', ViolationSchema);

// Define the booking schema using the booking connection
const bookingSchema = new mongoose.Schema({
  name: String,
  emailid: String,
  pickup: String,
  dropoff: String,
  transportType: String // Add transport type field
});
const Booking = bookingConnection.model('Booking', bookingSchema);

// POST route to signup
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate the request body
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  // Check if the password meets the criteria
  const passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long, contain at least one uppercase letter and one special character.',
    });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      username,
      emailid: email, // Map 'email' from req.body to 'emailid' in the model
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();
    res.json({ success: true, message: 'Signup successful!' });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error (e.g., emailid already exists)
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Error saving user', error: error.message });
  }
});

// POST route to save booking
app.post('/booking', async (req, res) => {
  const { name, emailid, pickup, dropoff, transportType } = req.body;

  // Validate the request body
  if (!name || !emailid || !pickup || !dropoff || !transportType) {
    return res.status(400).json({ message: 'Name, emailid, pickup, dropoff, and transportType are required' });
  }

  // Create a new booking instance
  const newBooking = new Booking({ name, emailid, pickup, dropoff, transportType });

  try {
    // Save the booking to the database
    await newBooking.save();
    console.log('Booking saved:', newBooking);
    res.json({ message: 'Booking confirmed!' });
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ message: 'Error saving booking', error: error.message });
  }
});

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

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
console.log("Login request received:", username, password);
  try {
      // Query the 'users' collection using the Mongoose model
      const user = await User.findOne({ username: username });
      console.log('User found:', user);

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
          // Determine redirect URL based on role
          const redirectUrl = user.role === 'admin' 
              ? '/admin-dashboard/admin-dashboard.html' 
              : '/user-dashboard/user-dashboard.html';
          res.json({ success: true, redirectUrl });
      } else {
          res.json({ success: false });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
