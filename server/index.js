const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const sequelize = require("./config/db");
const User = require("./models/User");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);

// ✅ Create Super Admin if doesn't exist
const createSuperAdmin = async () => {
  const { SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } = process.env;

  if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
    console.warn("⚠️ SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set in .env");
    return;
  }

  try {
    const existingAdmin = await User.findOne({ where: { email: SUPER_ADMIN_EMAIL } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);
      await User.create({
        email: SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        role: "superadmin",
        username: "SuperAdmin",     // ✅ ensure this matches model requirements
        updatedBy: "System",            // ✅ can be null or SUPER_ADMIN_EMAIL
      });
      console.log("✅ Super Admin created:", SUPER_ADMIN_EMAIL);
    } else {
      console.log("ℹ️ Super Admin already exists");
    }
  } catch (error) {
    console.error("❌ Error creating super admin:", error);
  }
};

// ✅ Server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // ⚠️ alter:true is good for dev, but be careful in production
    await sequelize.sync({ alter: true });

    await createSuperAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Unable to connect to the database:", err);
  }
};

startServer();
