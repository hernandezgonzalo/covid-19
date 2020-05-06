const passport = require("passport");

const ensureAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (info) return next(info.message);
    if (err) return next(err);
    if (!user) return next(new Error("You are not allowed to access"));
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = { ensureAuthenticated };
