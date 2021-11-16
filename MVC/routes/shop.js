const express = require("express");
const shopControllers = require("../controllers/shop");

const router = express.Router();

router.get("/", shopControllers.getIndex);

router.get("/cart", shopControllers.getCart);

router.get("/orders", shopControllers.getOrders);

router.get("/products", shopControllers.getProducts);

router.get("/checkout", shopControllers.getCheckout);

module.exports = router;
