const {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventDetails,
} = require("../controllers/eventControllers");
const { authorizeRank } = require("../middlewares/authMiddleware");

const express = require("express");

const router = express.Router();

router.route("/").get(getAllEvents);
router.route("/:id").get(getEventDetails);

router.use(authorizeRank(["SUO", "JUO", "CSM", "CQMS", "SGT", "CPL"]));

router.route("/").post(createEvent);
router.route("/:id").put(updateEvent).delete(deleteEvent);

exports.eventRouter = router;
