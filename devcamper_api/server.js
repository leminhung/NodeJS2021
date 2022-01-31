const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const path = require("path");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const bootcampRoutes = require("./routes/bootcamps");
const courseRoutes = require("./routes/courses");
const authRoutes = require("./routes/auth");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

const app = express();

// Body parser
app.use(bodyParser.json());

// Cookie parser
app.use(cookieParser());

// Dev loggin middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// connect to DB
connectDB();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => res.send({ name: "port" }));

// Mount routes
app.use("/api/v1/bootcamps", bootcampRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/auth", authRoutes);

// Error handlers
app.use(errorHandler);

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandle  promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close server & exit process
  server.close(() => process.exit(1));
});
