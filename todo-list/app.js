const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
var bodyParser = require("body-parser");
const todoRoute = require("./routes/todo");

app.set("view engine", "ejs");
app.set("views", "views");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", todoRoute);

app.listen(PORT, () => {
  console.log(`App running at port: ${PORT}`);
});
