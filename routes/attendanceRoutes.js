const express = require("express");
const {
  changeAttendance,
  markAttendance,
} = require("../controllers/attendanceController");

const router = express.Router();

router.route("/:id").post(markAttendance).put(changeAttendance);

module.exports = router;
