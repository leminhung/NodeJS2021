const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });
    console.log(`MongoDb connected: ${conn.connection.host}`.cyan.bold);
  } catch (err) {
    console.log("[err--]", err);
  }
};

module.exports = connectDB;
