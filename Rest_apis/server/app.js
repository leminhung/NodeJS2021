const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

// multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else cb(null, false);
};

const MONGODB_URI =
  "mongodb+srv://leminhunglmh:leminhhung123@cluster0.otp0j.mongodb.net/status";

// x-www-form-urlencoded <form>
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // application/json
app.use(multer({ storage, fileFilter }).single("image"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, origin, x-requested-with"
  );
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use((error, req, res, next) => {
  console.log("[errorFinal]", error);
  const statusCode = error.statusCode;
  const data = error.data;
  const message = error.message;
  res.status(statusCode).json({ message, data });
});

mongoose
  .connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    const server = app.listen(8080);
    console.log("Hell0");
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("Client connected!");
    });
  })
  .catch((err) => {
    console.log(err);
  });
