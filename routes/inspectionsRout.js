const express = require("express");
const router = express.Router({ mergeParams: true });
const Profile = require("../models/profileModel");
const Inspection = require("../models/inspectionModel");
const { activePage } = require("../middleware/index");
const { allComplete } = require("../utils/checklistUtils");

router.use(activePage);

router.get("/", async (req, res, next) => {
  const { profileId } = req.params;
  const profile = await Profile.findById(profileId).populate("inspections");
  const completed = await allComplete();
  res.render("pages/inspection", { profile, completed });
});

router.post("/", async (req, res, next) => {
  const profile = await Profile.findById(req.params.profileId).populate(
    "inspections"
  );
  const { title } = req.body;
  const newInspection = new Inspection({ title });
  console.log(newInspection);
  await newInspection.save();
  profile.inspections.push(newInspection);
  await profile.save();
  res.redirect(
    `/home/${req.user.username}/profiles/${profile._id}/inspections`
  );
});

router.patch("/", async (req, res, next) => {
  const allInspections = await Inspection.find({});
  const { cbs } = req.body;
  for (const inspection of allInspections) {
    cbs.includes(inspection._id.toString())
      ? (inspection.completed = true)
      : (inspection.completed = false);
    await inspection.save();
  }
  res.redirect(
    `/home/${req.user.username}/profiles/${req.params.profileId}/inspections`
  );
});

module.exports = router;
