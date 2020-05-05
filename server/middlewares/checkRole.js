function checkRole(role) {
  return function (req, res, next) {
    if (req.user.role === role) return next();
    else {
      res.status(401).json({
        success: false,
        message: "You don't have enough permissions"
      });
    }
  };
}

module.exports = checkRole;
