const express = require("express");
const { authorizeRank } = require("../middlewares/authMiddleware");
const {
  getSingleCadet,
  createNewCadet,
  deleteSingleCadet,
  UpdateOneCadet,
  getAllCadets,
} = require("../controllers/infoControllers");

const router = express.Router();

/**
 * Router to facilitate CRUD operations for a single cadet
 * Operations can be done by Rank panel only
 */
// router.use(authorizeRank(["SUO", "JUO", "CSM", "CQMS", "SGT", "CPL"]));

router.route("/").post(createNewCadet).get(getAllCadets);
router
  .route("/:dli")
  .get(getSingleCadet)
  .delete(deleteSingleCadet)
  .put(UpdateOneCadet);

module.exports = router;
