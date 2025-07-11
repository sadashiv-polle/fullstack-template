const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Avoid exposing whether user exists or not, but this is fine for many apps
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords securely
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check that JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Generate JWT token with user data and expiration, including username
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respond with token and basic user info including username
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
