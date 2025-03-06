import { DataTypes } from "sequelize";
import sequelize from "../data/db.js";

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
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      references: {
        model: "restaurants",
        key: "id",
      },
      allowNull: false,
    },
    enable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  { timestamps: true }
);

export default Category;
