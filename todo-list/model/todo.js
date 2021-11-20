const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "todos.json"
);

const getDataFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb(null);
    } else cb(JSON.parse(fileContent));
  });
};

module.exports = class Todo {
  constructor(id, title) {
    this.id = id;
    this.title = title;
  }

  addTodo() {
    getDataFromFile((todos) => {
      let tods = [...todos];
      let existingIndexTodo = tods.findIndex((tod) => tod.id === this.id);
      if (existingIndexTodo) {
        tods[existingIndexTodo] = this;
        fs.writeFile(p, JSON.stringify(tods), (err) => {
          console.log("[err]", err);
        });
      } else {
        let newTodo = { id: this.id, title: this.title };
        tods = [...tods, newTodo];
        fs.writeFile(p, JSON.stringify(tods), (err) => {
          console.log("[err]", err);
        });
      }
    });
  }
  static fetchAllTodos(cb) {
    getDataFromFile(cb);
  }

  static deleteTodo(id) {
    getDataFromFile((todos) => {
      let updateTodos = [...todos];
      updateTodos = updateTodos.filter((todo) => todo.id !== id);
      fs.writeFile(p, JSON.stringify(updateTodos), (err) => {
        console.log("[err]", err);
      });
    });
  }

  static findById(id, cb) {
    getDataFromFile((todos) => {
      let todo = todos.find((tod) => tod.id === id);
      cb(todo);
    });
  }
};
