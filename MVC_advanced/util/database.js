const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "12345678", {
  dialect: "mysql",
  root: "localhost",
});

module.exports = sequelize;
