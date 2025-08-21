const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { validateEmail, validatePassword } = require("../utils/validators");
const { ERRORS, MESSAGES } = require("../constants");

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: ERRORS.USER_REQUIRED });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: ERRORS.INVALID_CREDENTIALS });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({
        message: ERRORS.INVALID_PASSWORD
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: ERRORS.USER_EXISTS });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: MESSAGES.USER_REGISTERED,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/users/login
 * @desc    Login user
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: ERRORS.INVALID_CREDENTIALS });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: ERRORS.INVALID_CREDENTIALS });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: ERRORS.PASSWORD_NOT_MATCH });
    }

    res.json({
      message: MESSAGES.USER_LOGGED_IN,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/users/profile
 * @desc    Get logged-in user profile
 * @access  Private
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: ERRORS.USER_NOT_FOUND });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/users/profile
 * @desc    Update logged-in user profile
 * @access  Private
 */
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: ERRORS.USER_NOT_FOUND });

    if (email && !validateEmail(email)) {
      return res.status(400).json({ message: ERRORS.INVALID_EMAIL });
    }

    if (password) {
      if (!validatePassword(password)) {
        return res.status(400).json({
          message:
            ERRORS.INVALID_PASSWORD
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    user.name = name || user.name;
    user.email = email || user.email;

    const updatedUser = await user.save();

    res.json({
      message: MESSAGES.USER_UPDATED,
      user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/users/profile
 * @desc    delete an user profile
 * @access  Private
 */
exports.deleteUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: ERRORS.USER_NOT_FOUND });

    res.json({ message: MESSAGES.USER_DELETED });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};