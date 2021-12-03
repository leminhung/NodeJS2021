const userRoute = require("./user");
const productRoute = require("./product");

module.exports = (app) => {
  app.use("/api/auth", userRoute);
  app.use("/api/products", productRoute);
};
