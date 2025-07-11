const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// --- Mock auth middleware to set req.user.email ---
// Replace this with real auth (e.g., JWT) in production
router.use((req, res, next) => {
  // In a real app, get this from your auth token/session
  req.user = { email: 'current.user@example.com' };
  next();
});

// ✅ GET all users
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT 
        id, 
        email, 
        role, 
        username,
        updated_by AS updatedBy,
        updated_at AS updatedAt
      FROM users
    `);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ CREATE a new user
router.post('/users', async (req, res) => {
  const { email, password, role, username } = req.body;

  if (!email || !password || !role || !username) {
    return res.status(400).json({ message: "Email, password, role, and username are required." });
  }

  try {
    const [exists] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length > 0) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (email, password, role, username, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [email, hashedPassword, role, username, req.user.email]
    );

    res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE a user's password
router.put('/users/:id/password', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const idNum = parseInt(id, 10);

  if (isNaN(idNum)) return res.status(400).json({ message: "Invalid user ID." });
  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "UPDATE users SET password = ?, updated_by = ?, updated_at = NOW() WHERE id = ?",
      [hashed, req.user.email, idNum]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE a user's role
router.put('/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const idNum = parseInt(id, 10);

  const validRoles = ["user", "admin", "superadmin"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role provided." });
  }
  if (isNaN(idNum)) return res.status(400).json({ message: "Invalid user ID." });

  try {
    const [result] = await db.query(
      "UPDATE users SET role = ?, updated_by = ?, updated_at = NOW() WHERE id = ?",
      [role, req.user.email, idNum]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "Role updated successfully." });
  } catch (err) {
    console.error("Error updating role:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE general user info (username, role)
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, role } = req.body;
  const idNum = parseInt(id, 10);

  if (isNaN(idNum)) return res.status(400).json({ message: "Invalid user ID." });

  const fields = [];
  const values = [];

  if (username) {
    fields.push("username = ?");
    values.push(username);
  }
  if (role) {
    const validRoles = ["user", "admin", "superadmin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role provided." });
    }
    fields.push("role = ?");
    values.push(role);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update." });
  }

  // Always update updated_by and updated_at
  fields.push("updated_by = ?");
  values.push(req.user.email);

  fields.push("updated_at = NOW()");
  const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
  values.push(idNum);

  try {
    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User updated successfully." });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
