require("dotenv").config();

const jwt = require("jsonwebtoken");

const issueToken = user => {
  const payload = {
    sub: user._id,
    iat: Date.now(),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    username: user.username,
    role: user.role
  };

  return jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET);
};

module.exports = { issueToken };
