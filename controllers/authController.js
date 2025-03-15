const User = require('../models/userModel');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      // Redirect URL based on user role
      const dashboardUrl = user.role === 'admin' ? 'public/admin-dashboard/admin-dashboard.html' : 'public/user-dashboard/user-dashboard.html';
      res.json({ success: true, role: user.role, redirectTo: dashboardUrl });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
