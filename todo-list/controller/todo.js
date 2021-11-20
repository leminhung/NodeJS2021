const Todo = require("../model/todo");
const path = require("path");
const { v4: uuid_v4 } = require("uuid");

exports.getTodos = (req, res, next) => {
  Todo.fetchAllTodos((todos) => {
    res.render("todo", {
      todos,
    });
  });
};

exports.postAddTodo = (req, res, next) => {
  let todoTitle = req.body.title;
  let id = uuid_v4();
  let todo = new Todo(id, todoTitle);
  todo.addTodo();
  res.redirect("/");
};

exports.postDeleteTodo = (req, res, next) => {
  const id = req.body.id;
  Todo.deleteTodo(id);
  res.redirect("/");
};

exports.getEditTodo = (req, res, next) => {
  const id = req.params.id;
  Todo.findById(id, (todo) => {
    res.render("editTodo", {
      todo,
      titlePage: "Edit",
    });
  });
};

exports.postEditTodo = (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  let updateTodo = new Todo(id, title);
  updateTodo.addTodo();
  res.redirect("/");
};
