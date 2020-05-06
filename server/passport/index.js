const passport = require("passport");

require("./strategies/local.strategy");
require("./strategies/jwt.strategy");

module.exports = app => {
  app.use(passport.initialize());
};
