const User = require("../models/userModel");

module.exports = {
  getHome(req, res, next) {
    res.render("index");
  },
  getRegister(req, res, next) {
    res.render("users/register");
  },
  async postRegister(req, res, next) {
    try {
      const { username, email, password, password2 } = req.body.user;
      if (password !== password2) {
        req.flash("error", "Passwords do not match.");
        return res.redirect("/register");
      }
      const newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", `Welcome to MotoMeter ${username}`);
      });
    } catch (e) {
      let msg = e.message;
      if (msg.includes("email_1"))
        msg = "A user with the given email is already registered";
      req.flash("error", `${msg}`);
      return res.redirect("/register");
    }
    res.redirect(`/${req.body.user.username}/garage`);
  },
  getLogin(req, res, next) {
    res.render("users/login");
  },
  postLogin(req, res, next) {
    req.flash("success", `Welcome back, ${req.user.username}!`);
    const redirectUrl =
      req.session.intendedRoute || `${req.user.username}/garage`;
    delete req.session.intendedRoute;
    res.redirect(redirectUrl);
  },
  getLogout(req, res, next) {
    req.logout();
    req.flash("success", "Logged out.");
    res.redirect("/");
  },
};
