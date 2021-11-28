const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("61a23d5225824a1ffae2f0a3")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://leminhunglmh:leminhhung123@cluster0.otp0j.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    let user = new User({
      name: "leminhhung",
      email: "hung@gmail.com",
      cart: {
        items: [],
      },
    });
    user.save();
    console.log("Connect to database successfully!");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
