const jwt = require("jsonwebtoken");
const keys = require("../keys");

module.exports = (name) => {
  return jwt.sign(
    {
      sub: name,
      iss: keys.JWT_ISS,
    },
    keys.JWT_SECRET,
    {
      expiresIn: keys.JWT_EXPIRES,
    }
  );
};
