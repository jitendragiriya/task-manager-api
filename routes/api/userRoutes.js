const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUser,
  deleteUserProfile,
} = require("../../controllers/userController");
const auth = require("../../middlewares/auth");

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private
router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUser);
router.delete("/profile", auth, deleteUserProfile);

module.exports = router;
