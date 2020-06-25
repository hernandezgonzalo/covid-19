const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const { ensureAuthenticated } = require("../middlewares/authentication");
const geocoder = require("../lib/geocoder");
const { issueToken } = require("../lib/token");

router.post("/login", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return res.status(401).json(err);
    if (!user) return res.status(401).json(info);

    const token = issueToken(user);
    return res.json({ success: true, token, user });
  })(req, res, next);
});

router.post("/signup", async (req, res, next) => {
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
        password,
        email,
        name,
        surname,
        location: { coordinates: [lng, lat] },
        geocode
      });

      const token = issueToken(newUser);
      return res.json({ success: true, token, user: newUser.toJSON() });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "The user already exists" });
    }
  } catch (e) {
    next(e);
  }
});

router.get("/loggedin", ensureAuthenticated, (req, res, next) => {
  return res.json({ success: true, user: req.user });
});

router.get(
  "/facebook",
  passport.authenticate("facebook-token", { session: false }),
  (req, res, next) => {
    console.log("FACEBOOK", req.user);
  }
);

module.exports = router;
