const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.post("/signup", userController.postSignup);
router.post("/signin", userController.postSignin);

module.exports = router;
