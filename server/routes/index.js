const express = require("express");
const router = express.Router();
const checkRole = require("../middlewares/checkRole");
const { ensureAuthenticated } = require("../middlewares/authentication");

router.get("/", (req, res, next) => {
  res.json({ success: true, message: "Welcome" });
});

router.use("/auth", require("./auth.router"));

router.use("/profile", require("./profile.router"));

router.use("/app", ensureAuthenticated, require("./app.router"));

router.use(
  "/admin",
  ensureAuthenticated,
  checkRole("admin"),
  require("./admin.router")
);

router.use(
  "/notifications",
  ensureAuthenticated,
  require("./notifications.router")
);

module.exports = router;
