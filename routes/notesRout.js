const express = require("express");
const router = express.Router({ mergeParams: true });
const Profile = require("../models/profileModel");

router.get("/", async (req, res, next) => {
  const { profileId } = req.params;
  const profile = await Profile.findById(profileId);
  res.render("pages/notes", { profile });
});

router.post("/", async (req, res, next) => {
  const { notes } = req.body;
  const { profileId } = req.params;
  console.log(notes);
  await Profile.findByIdAndUpdate(profileId, { notes });
  // const profile = await Profile.findById(profileId);
  res.redirect(`/profiles/${profileId}/notes`);
});

module.exports = router;
