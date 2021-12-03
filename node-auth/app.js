const dotenv = require("dotenv");
dotenv.config({
  path: "./config/dev.env",
});

const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes");
const app = express();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const connectDB = require("./config/database");
connectDB();
const PORT = process.env.PORT || 5000;
const User = require("./models/User");

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  const user = await User.findById(req.session.user._id);
  if (user) {
    req.user = user;
    next();
  }
});

// tạo biến local để lưu trữ các biến => có thể sử dụng vs mọi req
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // res.locals.csrfToken = req.csrfToken();
  next();
});

router(app);

app.listen(PORT, () => {
  console.log(`App running at port: ${PORT}`);
});
