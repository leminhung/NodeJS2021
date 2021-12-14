"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
let todos = [];
router.get("/", (req, res, next) => {
    res.status(200).json({ todos: todos });
});
router.post("/todo", (req, res, next) => {
    const newTodo = {
        id: new Date().toISOString(),
        title: req.body.title,
    };
    todos.push(newTodo);
    res
        .status(201)
        .json({ messge: "Add todo sucessfully!", todo: newTodo, todos });
});
router.put("/todo/:todoId", (req, res, next) => {
    const params = req.params;
    const body = req.body;
    const tid = params.todoId;
    const todoIndex = todos.findIndex((t) => t.id === tid);
    if (todoIndex >= 0) {
        todos[todoIndex] = { id: tid, title: body.title };
        return res.status(200).json({ message: "Update todo!", todos });
    }
    return res
        .status(404)
        .json({ message: "Could not find this todo with this id!" });
});
router.delete("/todo/:todoId", (req, res, next) => {
    const params = req.params;
    const tid = params.todoId;
    todos = todos.filter((t) => t.id !== tid);
    return res.status(200).json({ message: "Delete todo!", todos });
});
exports.default = router;
