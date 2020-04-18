const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Case = require("../models/Case");

const sortFieldMapper = {
  name: "name",
  surname: "surname",
  city: "geocode.city",
  country: "geocode.country",
  date: "user_case.0.createdAt"
};

// administrator control panel queries
router.post("/", async (req, res, next) => {
  const { pageSize, page, search, orderBy, orderDirection } = req.body;
  const sortField = orderBy
    ? sortFieldMapper[orderBy.field]
    : "user_case.0.createdAt";

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
        $match: {
          $and: [
            {
              "user_case.0": {
                $exists: true
              }
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
      return {
        location: user.location,
        name: user.name,
        surname: user.surname,
        image,
        city: user.geocode.city,
        country: user.geocode.country,
        case: user.user_case[0]._id,
        date: user.user_case[0].createdAt
      };
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

module.exports = router;
