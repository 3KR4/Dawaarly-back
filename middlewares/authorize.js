exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { user_type, is_super_admin } = req.user;

    // لو مسموح SUPER_ADMIN
    if (allowedRoles.includes("SUPER_ADMIN") && is_super_admin) {
      return next();
    }

    // باقي الرولز
    if (!allowedRoles.includes(user_type)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};
