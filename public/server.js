require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// ✅ Fix CORS Issues
const corsOptions = {
    origin: '*', // Allow all origins (Change this to a specific domain in production)
    methods: ['POST', 'GET', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(express.json());

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URI || !JWT_SECRET) {
    console.error("Missing required environment variables: MONGO_URI, JWT_SECRET");
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// ✅ User Schema
const UserSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    phone: String
});
const User = mongoose.model('User', UserSchema);

// ✅ Booking Schema (Includes Image URL for Display)
const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    address: String,
    type: String,
    price: String,
    date: String,
    startTime: String,
    endTime: String,
    paymentMethod: String,
    status: { type: String, default: "active" },
    imageUrl: { type: String, default: "3.jpg" } // Default Image
});
const Booking = mongoose.model('Booking', BookingSchema);

// ✅ Middleware: Authenticate JWT Token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        req.userId = decoded.userId; // Store userId in request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

// ✅ Register User
app.post('/register', async (req, res) => {
    console.log("Received registration data:", req.body);
    const { fullName, email, password, phone } = req.body;
    if (!fullName || !email || !password || !phone) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, password: hashedPassword, phone });
        await newUser.save();
        console.log(" User registered successfully!");
        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ User Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, message: "Login successful", token });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Save Booking (Requires Authentication)
app.post('/bookings', verifyToken, async (req, res) => {
    try {
        const { address, type, price, date, startTime, endTime, paymentMethod, imageUrl } = req.body;
        const newBooking = new Booking({
            user: req.userId,
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
        res.status(201).json({ success: true, message: "Booking successful!" });
    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Get Active Bookings (Requires Authentication)
app.get('/bookings', verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.userId, status: "active" });
        res.json(bookings);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Cancel Booking (Requires Authentication)
app.delete('/bookings/:id', verifyToken, async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, user: req.userId });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Booking cancelled" });
    } catch (error) {
        console.error("Cancel Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
