const Profile = require("../models/profileModel");
const Inspection = require("../models/inspectionModel");

module.exports = {
  async getInspections(req, res, next) {
    const { profileId } = req.params;
    const profile = await Profile.findById(profileId).populate("inspections");
    const completed = await Inspection.inspectionsComplete(profileId);
    console.log(completed);
    res.render("pages/inspection", { profile, completed });
  },
  async postInspections(req, res, next) {
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
  },
  async updateInspections(req, res, next) {
    const activeProfile = await Profile.findById(req.params.profileId).populate(
      "inspections"
    );
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
  },
  async getInspectionsEdit(req, res, next) {
    const profile = await Profile.findById(req.params.profileId).populate(
      "inspections"
    );
    res.render("pages/inspectionEdit", { profile });
  },
  async deleteInspections(req, res, next) {
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
  },
};
