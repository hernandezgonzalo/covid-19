const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

router.get("/", async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "case",
        populate: {
          path: "user",
          model: "User"
        }
      });
    res.json({ success: true, notifications });
  } catch (error) {
    res.json({ success: false, error });
  }
});

router.post("/read", async (req, res, next) => {
  const { id } = req.body;
  try {
    const notification = await Notification.findById(id);
    notification.read = true;
    await notification.save();
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, error });
  }
});

module.exports = router;
