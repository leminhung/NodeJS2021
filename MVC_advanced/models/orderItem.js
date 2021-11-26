const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");
const OrderItem = sequelize.define("orderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  qty: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
});

module.exports = OrderItem;
