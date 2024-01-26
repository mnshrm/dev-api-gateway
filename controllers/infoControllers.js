const Cadet = require("../models/Cadet");
const { catchAsyncError } = require("../utils/catchAsyncError");
const { ErrorHandler } = require("../utils/errorHandler");

/**
 * To get all cadets
 */
exports.getAllCadets = catchAsyncError(async (req, res, next) => {
  const cadets = await Cadet.find();
  res.status(200).json({
    success: true,
    cadets,
  });
});
/**
 * To create a new cadet, can only be done by rank panel except lance corporal
 */
exports.createNewCadet = catchAsyncError(async (req, res, next) => {
  const { email, password, dli, rank, company } = req.body;
  if (!email || !password || !dli || !rank || !company)
    throw new ErrorHandler("Please provide all required fields", 422);
  const cadet = new Cadet(req.body);
  await cadet.save();
  res.status(200).json({
    success: true,
    msg: "cadet created",
  });
});

/**
 * To get a single cadet's details
 */
exports.getSingleCadet = catchAsyncError(async (req, res, next) => {
  // Fetch cadet details from database
  const cadet = await Cadet.findOne({ dli: req.params.dli });
  // Check if cadet exists
  if (!cadet) throw new ErrorHandler("Cadet not found", 404);

  res.status(200).json({
    success: true,
    cadet,
  });
});

/**
 * To delete a single cadet
 */
exports.deleteSingleCadet = catchAsyncError(async (req, res, next) => {
  // Delete cadet using id
  const confirmation = await Cadet.deleteOne({ dli: req.params.dli });

  if (!confirmation.deletedCount)
    throw new ErrorHandler("Internal Server error", 500);
  res.status(200).json({
    success: true,
    deletedCount: confirmation.deletedCount,
  });
});

/**
 * To update a single cadet's details
 * ! Rank panel only has authority to update rank, dli or company, any effort to update any personal detail will result into error.
 */
exports.UpdateOneCadet = catchAsyncError(async (req, res, next) => {
  // ONLY UPDATE DLI OR RANK OR COMPANY IN THIS CONTROLLER
  const { firstName, lastName, password, email, contact } = req.body;
  if (firstName || lastName || password || email || contact) {
    throw new ErrorHandler(
      "Rank panel is not authorized to update personal details",
      401
    );
  }

  const confirmation = await Cadet.updateOne({ dli: req.params.dli }, req.body);
  if (!confirmation.matchedCount)
    throw new ErrorHandler("No cadet matched with request", 404);
  const cadet = await Cadet.findOne({ dli: req.params.dli });
  res.status(200).json({
    success: true,
    cadet,
  });
});
