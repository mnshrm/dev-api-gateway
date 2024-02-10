const path = require("path");
const { exec } = require("child_process");
const cron = require("node-cron");

const cadetRouter = require("./routes/infoRoutes.js");
const { isAuthenticated } = require("./middlewares/authMiddleware.js");
const authRouter = require("./routes/authRoutes.js");
const { errorMiddleware } = require("./middlewares/error.js");
const { profileRouter } = require("./routes/profileRoutes.js");
const attendanceRouter = require("./routes/attendanceRoutes.js");
const { eventRouter } = require("./routes/eventRoutes.js");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config({ path: path.join(__dirname, "config", ".env") });
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND,
    methods: "GET,POST,PUT,PATCH,DELETE", // Allow these HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use("/restartServer", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Server restarted",
  });
});

//middleware to authenticate user

app.use("/checkIfAuthenticated", isAuthenticated, (req, res, next) => {
  req.cadet.password = undefined;
  res.status(200).json({
    success: true,
    msg: "logged in",
    cadet: req.cadet,
  });
});

// Authentication (login, logout) router
app.use("/auth", authRouter);

// Check if user is authenticated before executing following routes
app.use(isAuthenticated);

// Event routes
app.use("/event", eventRouter);

// Cadet informations management router
app.use("/cadetInfo", cadetRouter);

// Attendace management
app.use("/attendance", attendanceRouter);

// Personal Profile router
app.use("/me", profileRouter);

// Error middleware
app.use(errorMiddleware);

module.exports = app;
