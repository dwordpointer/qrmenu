const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Product = sequelize.define(
  "products",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: "categories", // `categories` modeline referans
        key: "id", // `categories` modelinin `id` sütununa
      },
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Product;
