const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.post("/signup", userController.postSignup);
router.post("/signin", userController.postSignin);
router.post("/reset", userController.postResetPassword);
router.post("/new-password", userController.postNewPassword);

module.exports = router;
