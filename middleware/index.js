module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.intendedRoute = req.originalUrl;
    req.flash("error", "You must be logged in to do that.");
    return res.redirect("/login");
  }
  next();
};
