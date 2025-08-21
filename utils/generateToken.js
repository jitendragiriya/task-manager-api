const jwt = require("jsonwebtoken");
const { TOKEN_EXPIRY_TIME } = require("../constants");

const generateToken = (id) => {
  return jwt.sign({ user: { id } }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY_TIME });
};

module.exports = generateToken;
