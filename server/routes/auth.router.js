const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const { hashPassword } = require("../lib/hash");
const { isLoggedOut, isLoggedIn } = require("../middlewares/isLogged");
const geocoder = require("../lib/geocoder");

router.post("/login", isLoggedOut(), function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) return res.status(401).json(err);
    if (!user) return res.status(401).json(info);
    req.logIn(user, function (err) {
      if (err) return res.status(401).json(err);
      return res.json({ success: true, user: req.user.toJSON() });
    });
  })(req, res, next);
});

router.post("/signup", isLoggedOut(), async (req, res, next) => {
  const { username, password, name, surname, email, location } = req.body;
  const { lng, lat } = location;
  if (!username || !password) {
    return res.json({ success: false, message: "Invalid data" });
  }

  try {
    const existingUser = await User.findOne({
      username
    });
    if (!existingUser) {
      const [geocode] = await geocoder.reverse({ lat, lon: lng });
      const newUser = await User.create({
        username,
        password: hashPassword(password),
        email,
        name,
        surname,
        location: { coordinates: [lng, lat] },
        geocode
      });

      // login with the user created
      req.login(newUser, function (err) {
        if (!err) {
          return res
            .status(201)
            .json({ success: true, user: req.user.toJSON() });
        } else {
          return res.status(401).json({
            status: "error",
            message: `Error trying to login with the new user`
          });
        }
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "The user already exists" });
    }
  } catch (e) {
    next(e);
  }
});

router.get("/logout", isLoggedIn(), (req, res, next) => {
  req.logout();
  return res.json({ success: true, message: "Logged out" });
});

router.get("/loggedin", (req, res, next) => {
  if (req.isAuthenticated())
    return res.json({ success: true, user: req.user.toJSON() });
  else
    return res
      .status(401)
      .json({ success: false, message: "No user session present" });
});

module.exports = router;
