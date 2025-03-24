// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const authController = require('../controllers/authController');

module.exports = (User) => {
  // POST route to signup
  router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const passwordRegex = /^(?=.[A-Z])(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, contain at least one uppercase letter and one special character.',
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        emailid: email,
        password: hashedPassword,
      });
      await newUser.save();
      res.json({ success: true, message: 'Signup successful!' });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      console.error('Error saving user:', error);
      res.status(500).json({ message: 'Error saving user', error: error.message });
    }
  });

  // POST route to login
  router.post('/login', authController.login(User));

  return router;
};