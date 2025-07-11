const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { login } = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");  // Correct middleware import

// Protect all /users routes with authentication middleware
router.use("/users", verifyToken);

// ✅ GET all users (excluding passwords)
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "role", "username", "updatedBy", "updatedAt"],
    });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ CREATE a new user
router.post("/users", verifyToken, async (req, res) => {
  const { email, password, role, username } = req.body;

  if (!email || !password || !role || !username) {
    return res.status(400).json({ message: "Email, password, role, and username are required." });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hashedPassword,
      role,
      username,
      updatedBy: req.user.email,  // Set updatedBy from token payload
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE a user's password
router.put("/users/:id/password", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [updated] = await User.update(
      { password: hashedPassword, updatedBy: req.user.email, updatedAt: new Date() },
      { where: { id } }
    );

    if (updated === 0) {
      return res.status(404).json({ message: "User not found or not updated" });
    }

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE a user's role
router.put("/users/:id/role", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ["user", "admin", "superadmin"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role provided." });
  }

  try {
    const [updated] = await User.update(
      { role, updatedBy: req.user.email, updatedAt: new Date() },
      { where: { id } }
    );

    if (updated === 0) {
      return res.status(404).json({ message: "User not found or not updated" });
    }

    res.json({ message: "Role updated successfully." });
  } catch (err) {
    console.error("Error updating role:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE general user info (username, role)
router.put("/users/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { username, role } = req.body;

  const updates = {};
  if (username) updates.username = username;
  if (role) {
    const validRoles = ["user", "admin", "superadmin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role provided." });
    }
    updates.role = role;
  }

  // Always update updatedBy and updatedAt
  updates.updatedBy = req.user.email;
  updates.updatedAt = new Date();

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "No fields provided to update." });
  }

  try {
    const [updated] = await User.update(updates, { where: { id } });

    if (updated === 0) {
      return res.status(404).json({ message: "User not found or not updated." });
    }

    res.json({ message: "User updated successfully." });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// No authentication required for login
router.post("/login", login);

module.exports = router;
