const Profile = require("../models/profileModel");

module.exports = {
  async getNotes(req, res, next) {
    const { profileId } = req.params;
    const profile = await Profile.findById(profileId);
    res.render("pages/notes", { profile });
  },
  async postNotes(req, res, next) {
    const { notes } = req.body;
    const { profileId } = req.params;
    await Profile.findByIdAndUpdate(profileId, { notes });
    res.redirect(`/home/${req.user.username}/profiles/${profileId}/notes`);
  },
};
