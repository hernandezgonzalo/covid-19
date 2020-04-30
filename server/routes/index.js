const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/isLogged");
const checkRole = require("../middlewares/checkRole");

router.get("/", (req, res, next) => {
  res.json({ success: true, message: "Welcome" });
});

router.use("/auth", require("./auth.router"));

router.use("/profile", require("./profile.router"));

router.use("/app", isLoggedIn(), require("./app.router"));

router.use("/admin", checkRole("admin"), require("./admin.router"));

router.use("/notifications", isLoggedIn(), require("./notifications.router"));

module.exports = router;
