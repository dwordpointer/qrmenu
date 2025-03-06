import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../data/db.js";

const Table = sequelize.define(
  "Table",
  {
    tableNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  { tableName: "tables", timestamps: true }
);

export default Table;
