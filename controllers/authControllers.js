const { catchAsyncError } = require("../utils/catchAsyncError");
const { ErrorHandler } = require("../utils/errorHandler");
const Cadet = require("../models/Cadet");
const sendToken = require("../utils/jwtToken");

exports.loginCadet = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  // Check that both email and password are available
  if (!email) throw new ErrorHandler("email is required", 422);
  if (!password) throw new ErrorHandler("password is required", 422);

  // Fetch cadet details from database
  const cadet = await Cadet.findOne({ email }).select("+password");

  // Check if cadet exists or not
  if (!cadet) throw new ErrorHandler("Cadet does not exist", 404);

  // If entered password matches with correct password
  const matched = await cadet.comparePass(password);
  if (!matched) throw new ErrorHandler("Invalid password", 401);

  // Remove password field from cadet object
  cadet.password = undefined;
  sendToken(cadet, 200, res);
});

exports.logoutCadet = catchAsyncError(async (req, res, next) => {
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };
  // Remove token cookie from computer
  res.status(200).cookie("token", null, options).json({
    success: true,
    message: "Logged out",
  });
});
