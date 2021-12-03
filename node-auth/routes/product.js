const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const isAuth = require("../middleware/is-auth");

router.delete("/:productId", isAuth, productController.deleteProduct);
router.post("/", isAuth, productController.postProduct);
router.get("/:productId", productController.getProduct);
router.get("/", productController.getProducts);
module.exports = router;
