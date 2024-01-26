const express = require("express");
const { loginCadet, logoutCadet } = require("../controllers/authControllers");
const router = express.Router();

router.route("/login").post(loginCadet);
router.route("/logout").post(logoutCadet);

module.exports = router;
