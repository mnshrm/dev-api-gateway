const { catchAsyncError } = require("../utils/catchAsyncError");
const { ErrorHandler } = require("../utils/errorHandler");

/**
 * To mark attendance of a student
 */
exports.markAttendance = catchAsyncError(async (req, res, next) => {
  const response = await fetch(
    process.env.EVENT_API + "attendance/" + req.params.id,
    {
      method: "PUT",
      body: JSON.stringify({
        name: req.cadet.firstName + " " + req.cadet.lastName,
        dli: req.cadet.dli,
        status: req.body.status === "Present" ? "P" : "A",
        reason: req.body.reason,
        company: req.cadet.company,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (!data.success) {
    throw new ErrorHandler("Internal server error", 500);
  }
  res.status(200).json({
    success: true,
    attendance: data.attendance,
  });
});

/**
 * To change cadet's attendance
 */
exports.changeAttendance = catchAsyncError(async (req, res, next) => {
  const response = await fetch(
    process.env.EVENT_API + "attendance/" + req.params.id,
    {
      method: "PUT",
      body: JSON.stringify({
        name: req.cadet.firstName + req.cadet.lastName,
        dli: req.cadet.dli,
        status: req.body.status === "Present" ? "P" : "A",
        reason: req.body.reason,
        company: req.cadet.company,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  if (!data.success) {
    throw new ErrorHandler("Internal server error", 500);
  }
  res.status(200).json({
    success: true,
    attendance: data.attendance,
  });
});
