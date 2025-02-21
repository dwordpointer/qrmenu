const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Restaurant = sequelize.define(
  "restaurants",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = Restaurant;
