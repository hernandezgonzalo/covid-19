const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Case = require("../models/Case");
const Notification = require("../models/Notification");
const _ = require("lodash");
const { addNearCase, removeNearCase } = require("../lib/notifyNearCase");
const geocoder = require("../lib/geocoder");
const { hashPassword } = require("../lib/hash");
const uploadCloudinaryAvatar = require("../middlewares/uploadImage");

const sortFieldMapper = {
  name: "name",
  surname: "surname",
  city: "geocode.city",
  country: "geocode.country",
  date: "user_case.createdAt",
  active: "user_case"
};

// administrator control panel queries: search users
router.post("/", async (req, res, next) => {
  const { pageSize, page, search, orderBy, orderDirection } = req.body;
  const sortField = orderBy
    ? sortFieldMapper[orderBy.field]
    : "user_case.createdAt";

  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "cases",
          localField: "_id",
          foreignField: "user",
          as: "user_case"
        }
      },
      {
        $unwind: {
          path: "$user_case",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          $and: [
            {
              role: "user"
            },
            {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { surname: { $regex: search, $options: "i" } }
              ]
            }
          ]
        }
      },
      { $sort: { [sortField]: orderDirection === "asc" ? 1 : -1 } },
      { $skip: page * pageSize },
      { $limit: pageSize }
    ]);

    const count = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { surname: { $regex: search, $options: "i" } }
      ]
    }).countDocuments();

    const usersFormatted = users.map(user => {
      let image;
      if (user.image) image = user.image.url || user.image;
      const userObj = {
        id: user._id,
        location: user.location,
        name: user.name,
        surname: user.surname,
        image,
        city: user.geocode.city,
        country: user.geocode.country
      };
      if (!_.isEmpty(user.user_case)) {
        userObj.case = user.user_case._id;
        userObj.date = user.user_case.createdAt;
        userObj.active = true;
      } else userObj.active = false;

      return userObj;
    });

    return res.json({
      success: true,
      count,
      page,
      users: usersFormatted
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// look for a case to show in the map
router.post("/find-case", async (req, res, next) => {
  const { caseId } = req.body;
  try {
    const caseToShow = await Case.findById(caseId).populate("user");
    return res.json({ success: true, caseToShow });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// toggle status of an user to active
router.post("/active", async (req, res, next) => {
  const { userId } = req.body;
  try {
    const userCase = await Case.findOne({ user: userId });
    if (!userCase) {
      const newCase = await Case.create({
        user: userId
      });
      await addNearCase(newCase);
      const newCaseRes = await Case.findById(newCase._id).populate("user");
      return res.json({ success: true, case: newCaseRes });
    } else
      res.json({
        success: false,
        message: "This user has already a positive case registered"
      });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// toggle status of an user to inactive
router.post("/inactive", async (req, res, next) => {
  const { userId } = req.body;
  try {
    const userCase = await Case.findOne({ user: userId });
    if (userCase) {
      const removedCase = await userCase.remove();
      await removeNearCase(removedCase);
      return res.json({ success: true, case: removedCase });
    } else
      return res.json({
        success: false,
        message: "This user doesn't have a positive case registered"
      });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

// delete user and their case/notifications
router.post("/delete", async (req, res, next) => {
  const { userId } = req.body;
  try {
    const userCase = await Case.findOne({ user: userId });
    if (userCase) userCase.remove();

    await Notification.deleteMany({ user: userId });
    await removeNearCase(userCase);

    const user = await User.findById(userId);
    if (user) {
      await user.remove();
      return res.json({ success: true, user });
    } else return res.json({ success: false, message: "User not found" });
  } catch (error) {
    return res.json({ success: false, error: error.message });
  }
});

// add user and their case/notifications
router.post("/add", async (req, res, next) => {
  const { name, surname, lng, lat, active, date, profilePic } = req.body;

  if (!lng || !lat)
    return res.status(400).json({
      success: false,
      message: "Please, choose a location in the map first"
    });

  if (!name)
    return res
      .status(400)
      .json({ success: false, message: "The user must have a name" });

  try {
    // add user
    const [geocode] = await geocoder.reverse({ lat, lon: lng });
    const newUser = await User.create({
      username: new Date().getTime().toString(),
      password: hashPassword(new Date().getTime().toString()),
      name,
      surname,
      location: { coordinates: [lng, lat] },
      geocode
    });

    // add case
    if (active) {
      const newCase = await Case.create({ user: newUser._id });
      await addNearCase(newCase);
      newCase.createdAt = new Date(date);
      await newCase.save();
      // res.json({ success: true, case: newCase });
    }

    return res.json({ success: true, newUser });
  } catch (e) {
    next(e);
  }
});

// upload profile image to Cloudinary and update user
router.post(
  "/image",
  uploadCloudinaryAvatar.single("image"),
  async (req, res, next) => {
    const { userId } = req.body;
    console.log(userId);
    try {
      const editUser = await User.findById(userId);
      Object.assign(editUser, { image: req.file });
      await editUser.save();
      return res.json({ success: true, user: editUser.toJSON() });
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
