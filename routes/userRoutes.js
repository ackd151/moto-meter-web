const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/index");
const User = require("../models/userModel");

router.get("/:username", isLoggedIn, async (req, res, next) => {
  const user = await User.findOne({ username: req.params.username }).populate(
    "bikeProfiles"
  );
  res.render("users/userHome", { user });
});

module.exports = router;
