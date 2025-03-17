// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db'); // Import database connection

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Set up Socket.IO

const PORT = process.env.PORT || 3000; // Use environment variable for flexibility

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', require('./routes/authRoutes')); // Mount auth routes at /auth

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});