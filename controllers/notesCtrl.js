const Profile = require("../models/profileModel");

module.exports = {
  async getNotes(req, res, next) {
    const profile = await Profile.findById(req.targetId);
    res.render("pages/notes", { profile });
  },
  async postNotes(req, res, next) {
    const { notes } = req.body;
    const profile = await Profile.findByIdAndUpdate(req.targetId, { notes });
    res.redirect(`/${req.user.username}/garage/${profile.url}/notes`);
  },
};
