const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { hashPassword } = require("../lib/hash");
const { isLoggedIn } = require("../middlewares/isLogged");
const uploadCloudinaryAvatar = require("../middlewares/uploadImage");

// update profile
router.post("/", isLoggedIn(), async (req, res, next) => {
  const { username, password, email, name, surname } = req.body;
  if (!username || !password) {
    return res.json({ success: false, message: "Invalid data" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (!existingUser || username === req.user.username) {
      const editUser = await User.findOne(req.user._id);
      Object.assign(editUser, {
        username,
        password: hashPassword(password),
        email,
        name,
        surname
      });
      await editUser.save();
      res.json({ success: true, message: "Profile updated" });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "The user already exists" });
    }
  } catch (e) {
    next(e);
  }
});

// upload profile image to Cloudinary and update user
router.post(
  "/image",
  isLoggedIn(),
  uploadCloudinaryAvatar.single("image"),
  async (req, res, next) => {
    try {
      const editUser = await User.findOne(req.user._id);
      Object.assign(editUser, { image: req.file });
      await editUser.save();
      return res.json({ success: true, user: editUser.toJSON() });
    } catch (e) {
      next(e);
    }
  }
);

router.get("/", isLoggedIn(), (req, res, next) => {
  res.json({ success: true, user: req.user.toJSON() });
});

module.exports = router;
