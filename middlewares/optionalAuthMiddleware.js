exports.optionalAuth = (req, res, next) => {
  const authHeader =
    req.headers["authorization"] || req.headers["x-api-key"];

  if (!authHeader) {
    req.user = null; // 👈 مهم
    return next();
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      user_type: decoded.role,
      is_super_admin: decoded.is_super_admin || false,
      permissions: decoded.permissions || [],
    };
  } catch (err) {
    req.user = null; // 👈 حتى لو التوكن غلط
  }

  next();
};