const express = require("express");
const router = express.Router();
const todoController = require("../controller/todo");

router.get("/", todoController.getTodos);
router.post("/", todoController.postAddTodo);
router.post("/delete", todoController.postDeleteTodo);
router.get("/edit/:id", todoController.getEditTodo);
router.post("/edit", todoController.postEditTodo);

module.exports = router;
