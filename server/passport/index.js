const passport = require("passport");

require("./strategies/local.strategy");
require("./strategies/jwt.strategy");
require("./strategies/facebook.strategy");

module.exports = app => {
  app.use(passport.initialize());
};
