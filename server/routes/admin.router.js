const express = require("express");
const router = express.Router();
const Case = require("../models/Case");

router.post("/", async (req, res, next) => {
  const { pageSize, page, search } = req.body;
  try {
    const cases = await Case.find({ username: { $regex: "ad" } })
      .populate("user")
      .sort({ createdAt: -1 })
      .skip(page * pageSize)
      .limit(pageSize);

    const casesFormatted = cases.map(c => {
      let image;
      if (c.user.image) image = c.user.image.url || c.user.image;
      return {
        id: c.id,
        location: c.user.location,
        name: c.user.name,
        surname: c.user.surname,
        image,
        date: c.createdAt,
        city: c.user.geocode.city,
        country: c.user.geocode.country
      };
    });

    res.json({
      success: true,
      cases: casesFormatted,
      count: cases.length,
      page
    });
  } catch (error) {
    res.json({ success: false, error });
  }
});

module.exports = router;
