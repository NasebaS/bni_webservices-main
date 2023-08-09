const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize"); // Adjust the path

const Ledger = sequelize.define("Ledger", {
    ledger_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ledger_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ledger_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  // Add more fields as needed
});

module.exports = Ledger;
