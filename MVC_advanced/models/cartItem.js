const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");
const CartItem = sequelize.define("cartItem", {
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

module.exports = CartItem;
