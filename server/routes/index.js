const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/isLogged");
const checkRole = require("../middlewares/checkRole");

router.get("/", (req, res, next) => {
  res.json({ success: true, message: "Welcome" });
});

const authRouter = require("./auth.router");
router.use("/auth", authRouter);

const profileRouter = require("./profile.router");
router.use("/profile", profileRouter);

const appRouter = require("./app.router");
router.use("/app", isLoggedIn(), appRouter);

const adminRouter = require("./admin.router");
router.use("/admin", checkRole("admin"), adminRouter);

const notificationsRouter = require("./notifications.router");
router.use("/notifications", isLoggedIn(), notificationsRouter);

module.exports = router;
