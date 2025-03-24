// controllers/authController.js
const bcrypt = require("bcrypt");

const login = (User) => async (req, res) => {
  const { username, password } = req.body;
  console.log("Login request received:", username, password);
  try {
    const user = await User.findOne({ username: username });
    console.log("User found:", user);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const redirectUrl =
        user.role === "admin"
          ? "/admin-dashboard/admin-dashboard.html"
          : "/user-dashboard/user-dashboard.html";
      res.json({ success: true, redirectUrl });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { login };