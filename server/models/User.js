const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: true, // Optional field, can be null
  }
});

module.exports = User;
