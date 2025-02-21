const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Category = sequelize.define(
  "categories",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image:{
      type: DataTypes.STRING,
      allowNull: true,
    },
    restaurantId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'restaurants',  
          key: 'id',             
        },
        allowNull: false,
      }
  },
  { timestamps: true }
);

module.exports = Category;
