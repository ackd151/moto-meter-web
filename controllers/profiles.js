const Profile = require("../models/profile");

module.exports = {
  async createProfile(req, res, next) {
    const newProfile = new Profile(req.body.profile);
    await newProfile.save();
    req.flash("success", "New dirtbike profile created.");
    res.redirect(`/profiles/${newProfile._id}`);
  },
  async getProfile(req, res, next) {
    // Fetch profile by id, populate tasks
    const profile = await Profile.findOne({
      _id: req.params.profileId,
    }).populate("tasks");
    // working
    for (const task of profile.tasks) {
      task.remainingHours = await task.getRemainingHours();
    }

    // attempt to sort tasks....
    const { tasks } = profile;
    console.log(tasks);
    for (const task of tasks) {
      task.remainingHours = await task.getRemainingHours();
      console.log(task.remainingHours);
    }
    tasks.sort(compareTasks);
    console.log(tasks);

    res.render("pages/profile", { profile });
  },
  async updateProfile(req, res, next) {
    await Profile.findByIdAndUpdate(req.params.profileId, {
      hours: req.body.hours,
    });
    res.redirect(`/profiles/${req.params.profileId}`);
  },
};

function compareTasks(a, b) {
  return a.remainingHours > b.remainingHours
    ? 1
    : a.remainingHours < b.remainingHours
    ? -1
    : 0;
}
