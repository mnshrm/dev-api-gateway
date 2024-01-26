const express = require("express");
const {
  getMyDetails,
  updateMyDetails,
} = require("../controllers/profileControllers");
const router = express.Router();

/**
 * Route /me is for a single cadet to update his personal details
 * Can be done by the cadet himself
 */
router.route("/").get(getMyDetails).put(updateMyDetails);

module.exports.profileRouter = router;
