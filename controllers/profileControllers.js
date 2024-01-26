const { catchAsyncError } = require("../utils/catchAsyncError");
const { ErrorHandler } = require("../utils/errorHandler");

exports.getMyDetails = catchAsyncError(async (req, res, next) => {
  req.cadet.password = undefined;
  res.status(200).json(req.cadet);
});

// Thir controller executes logic to update personal details of the
exports.updateMyDetails = catchAsyncError(async (req, res, next) => {
  const keys = Object.keys(req.body);
  // Check if cadet is trying to update unauthorized fields
  if (
    keys.includes("dli") ||
    keys.includes("company") ||
    keys.includes("rank")
  ) {
    throw new ErrorHandler(
      "Cadet can only update his personal details in profile",
      422
    );
  }

  for (let i = 0; i < keys.length; i++) {
    if (keys[i] !== "oldPassword" && keys[i] !== "newPassword")
      req.cadet[keys[i]] = req.body[keys[i]];
  }

  if (keys.includes("newPassword")) {
    const matched = await req.cadet.comparePass(req.body.oldPassword);
    if (!matched) throw new ErrorHandler("Enter correct password", 401);
    req.cadet.password = req.body.newPassword;
  }
  const newCadetDetails = await req.cadet.save();
  // Remove password field from user
  newCadetDetails.password = undefined;
  res.status(200).json({
    success: true,
    cadet: newCadetDetails,
  });
});
