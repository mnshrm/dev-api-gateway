const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log("Database connected ");
  } catch (err) {
    console.log("Can not connect to database");
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
