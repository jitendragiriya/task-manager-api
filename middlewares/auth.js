const jwt = require("jsonwebtoken");
const { ERRORS } = require("../constants");

/**
 * Middleware to check if a user has authenticated.
 * Verifies the JWT token and extracts user data from it.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 */
module.exports = function (req, res, next) {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: ERRORS.TOKEN_MISSING });
  }
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error(
      "JWT_SECRET token is missing. Check environment variables."
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err?.message);
    res.status(401).json({ message: ERRORS.UNAUTHORIZED });
  }
};