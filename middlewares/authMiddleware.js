const Cadet = require("../models/Cadet");
const jwt = require("jsonwebtoken");
const { ErrorHandler } = require("../utils/errorHandler");
const { catchAsyncError } = require("../utils/catchAsyncError");

/**
 * Function to authenticate user on the basis of
 */
module.exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    throw new ErrorHandler("Please login before accessing this resource", 401);

  const data = jwt.verify(token, process.env.TOKEN_SECRET);
  req.cadet = await Cadet.findById(data.id).select("+password");
  next();
});

/**
 * Function to authorize a cadet to access a feature, on the basis of its rank
 * @param {String[]} rankArr
 * @returns
 */
module.exports.authorizeRank = (rankArr) => {
  return async (req, res, next) => {
    if (rankArr.includes(req.cadet.rank)) next();
    else
      return next(
        new ErrorHandler(
          `Cadet with rank ${req.cadet.rank} is not authorized to access this resource`,
          403
        )
      );
  };
};
