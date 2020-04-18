const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../models/User");
const { checkHashed } = require("../../lib/hash");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const foundUser = await User.findOne({ username });
      if (foundUser) {
        checkHashed(password, foundUser.password)
          ? done(null, foundUser)
          : done(null, false, { success: false, message: "Invalid password" });
      } else {
        done(null, false, { success: false, message: "Invalid username" });
      }
    } catch (error) {
      done(error);
    }
  })
);
