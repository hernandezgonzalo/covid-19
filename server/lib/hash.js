require("dotenv").config();

const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPT_ROUNDS));

const hashPassword = text => {
  const hash = bcrypt.hashSync(text, salt);
  return hash;
};

const checkHashed = bcrypt.compareSync;

module.exports = {
  hashPassword,
  checkHashed
};
