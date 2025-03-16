require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt'); // Using bcrypt instead of bcryptjs for consistency
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Import models from first code (assuming they exist in ./models)
const Alert = require('./models/Alert');
const Route = require('./models/Route');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/traffic_management';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("Missing required environment variable: JWT_SECRET");
    process.exit(1);
}

// Middleware
const corsOptions = {
    origin: '*', // Update this in production
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database Connections
// Main connection (traffic_management)
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to traffic_management MongoDB'))
.catch(err => console.error('Traffic MongoDB connection error:', err));

// Admin connection
const adminConnection = mongoose.createConnection('mongodb://localhost:27017/admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
adminConnection.on('connected', () => console.log('Connected to admin MongoDB'));
adminConnection.on('error', (err) => console.error('Admin MongoDB connection error:', err));

// Booking connection
const bookingConnection = mongoose.createConnection('mongodb://localhost:27017/bookingDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
bookingConnection.on('connected', () => console.log('Connected to booking MongoDB'));
bookingConnection.on('error', (err) => console.error('Booking MongoDB connection error:', err));

// Models
// Violation (admin DB)
const ViolationSchema = new mongoose.Schema({
    car_registration_number: String,
    speed: Number,
    road_type: String,
    penalty_amount: Number
});
const Violation = adminConnection.model('Violation', ViolationSchema);

// User (booking DB)
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: String,
    fullName: String
});
const User = bookingConnection.model('User', UserSchema);

// Booking (booking DB)
const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    emailid: String,
    pickup: String,
    dropoff: String,
    transportType: String,
    address: String,
    type: String,
    price: String,
    date: String,
    startTime: String,
    endTime: String,
    paymentMethod: String,
    status: { type: String, default: "active" },
    imageUrl: { type: String, default: "https://example.com/default-parking.jpg" }
});
const Booking = bookingConnection.model('Booking', BookingSchema);

// JWT Middleware
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });
    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

// Routes
// Signup
app.post('/signup', async (req, res) => {
    const { username, email, password, phone, fullName } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long, contain at least one uppercase letter and one special character.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, phone, fullName });
        await newUser.save();
        res.status(201).json({ success: true, message: 'Signup successful!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving user', error: error.message });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, message: 'Login successful!', token, email: user.email });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
});

// Booking
app.post('/bookings', verifyToken, async (req, res) => {
    const { name, emailid, pickup, dropoff, transportType, address, type, price, date, startTime, endTime, paymentMethod, imageUrl } = req.body;
    if (!pickup || !dropoff || !transportType) {
        return res.status(400).json({ message: 'Pickup, dropoff, and transportType are required' });
    }
    try {
        const newBooking = new Booking({
            user: req.userId,
            name,
            emailid,
            pickup,
            dropoff,
            transportType,
            address,
            type,
            price,
            date,
            startTime,
            endTime,
            paymentMethod,
            imageUrl: imageUrl || "https://example.com/default-parking.jpg"
        });
        await newBooking.save();
        res.status(201).json({ success: true, message: 'Booking confirmed!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving booking', error: error.message });
    }
});

app.get('/bookings', verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.userId, status: "active" });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

app.delete('/bookings/:id', verifyToken, async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, user: req.userId });
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Booking cancelled" });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// Violations
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

// Socket.IO
io.on('connection', (socket) => {
    console.log('A user connected');
    setInterval(async () => {
        try {
            const alerts = await Alert.find().sort({ time: -1 }).limit(5);
            const routes = await Route.find().limit(5);
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

    socket.on('disconnect', () => console.log('A user disconnected'));
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});