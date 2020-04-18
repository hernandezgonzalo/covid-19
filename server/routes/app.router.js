const express = require("express");
const router = express.Router();
const Case = require("../models/Case");
const checkRole = require("../middlewares/checkRole");
const { addNearCase, removeNearCase } = require("../lib/notifyNearCase");

// get all the cases registered
router.get("/", async (req, res, next) => {
  try {
    const cases = await Case.find().populate("user");
    const casesFormatted = cases.map(c => ({
      id: c.id,
      location: c.user.location,
      user: { id: c.user.id, fullName: c.user.fullName, image: c.user.image },
      date: c.createdAt
    }));
    res.json({ success: true, cases: casesFormatted });
  } catch (error) {
    res.json({ success: false, error });
  }
});

// check if current user has a case registered and retrieve the information
router.get("/user", checkRole("user"), async (req, res, next) => {
  try {
    const userCase = await Case.findOne({ user: req.user._id }).populate(
      "user"
    );
    res.json({ success: true, case: userCase });
  } catch (error) {
    res.json({ success: false, error });
  }
});

// add new positive case for the current user
router.post("/user/add", checkRole("user"), async (req, res, next) => {
  const user = req.user;
  try {
    const userCase = await Case.findOne({ user: user._id });
    if (!userCase) {
      const newCase = await Case.create({
        user: user._id
      });
      await addNearCase(newCase);
      const newCaseRes = await Case.findById(newCase._id).populate("user");
      res.json({ success: true, case: newCaseRes });
    } else
      res.json({
        success: false,
        message: "This user has already a positive case registered"
      });
  } catch (error) {
    res.json({ success: false, error });
  }
});

// remove positive case for the current user
router.get("/user/remove", checkRole("user"), async (req, res, next) => {
  try {
    const userCase = await Case.findOne({ user: req.user._id });
    if (userCase) {
      const removedCase = await userCase.remove();
      await removeNearCase(removedCase);
      res.json({ success: true, case: removedCase });
    } else
      res.json({
        success: false,
        message: "This user doesn't have a positive case registered"
      });
  } catch (error) {
    res.json({ success: false, error });
  }
});

module.exports = router;
