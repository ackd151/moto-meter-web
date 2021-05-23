const express = require("express");
const router = express.Router({ mergeParams: true });
const Profile = require("../models/profileModel");
const Inspection = require("../models/inspectionModel");
const { activePage } = require("../middleware/index");

router.use(activePage);

router.get("/", async (req, res, next) => {
  const { profileId } = req.params;
  const profile = await Profile.findById(profileId).populate("inspections");
  const completed = await Inspection.inspectionsComplete(profileId);
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
  req.flash("success", `Added "${newInspection.title}" inspection`);
  res.redirect(
    `/home/${req.user.username}/profiles/${profile._id}/inspections`
  );
});

router.patch("/", async (req, res, next) => {
  const activeProfile = await Profile.findById(req.params.profileId).populate(
    "inspections"
  );
  // const allInspections = activeProfile.inspections;
  const { cbs } = req.body;
  for (const inspection of activeProfile.inspections) {
    cbs.includes(inspection._id.toString())
      ? (inspection.completed = true)
      : (inspection.completed = false);
    await inspection.save();
  }
  res.redirect(
    `/home/${req.user.username}/profiles/${req.params.profileId}/inspections`
  );
});

router.get("/edit", async (req, res, next) => {
  const profile = await Profile.findById(req.params.profileId).populate(
    "inspections"
  );
  res.render("pages/inspectionEdit", { profile });
});

router.delete("/destroy", async (req, res, next) => {
  const { cbs } = req.body;
  await Profile.findByIdAndUpdate(req.params.profileId, {
    $pull: { inspections: { $in: cbs } },
  });
  const response = await Inspection.deleteMany({ _id: { $in: cbs } });
  req.flash(
    "success",
    `Successfully deleted ${response.deletedCount} inspections`
  );
  res.redirect(
    `/home/${req.user.username}/profiles/${req.params.profileId}/inspections`
  );
});

module.exports = router;
