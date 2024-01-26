process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION !!!");
  console.log(err);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});

const app = require("./app");
const connectDB = require("./db/db");

connectDB();
app.listen(process.env.PORT, () => {
  console.log("Server started at port " + process.env.PORT);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION !!!");
  console.error(err);
  console.log("Shutting down server");
  process.exit(1);
});
