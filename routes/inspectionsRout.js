const express = require("express");
const router = express.Router({ mergeParams: true });
const Profile = require("../models/profileModel");
const { activePage } = require("../middleware/index");

router.use(activePage);

router.get("/", async (req, res, next) => {
  const { profileId } = req.params;
  const profile = await Profile.findById(profileId);
  console.log(profile);
  res.render("pages/inspection", { profile });
});

module.exports = router;
