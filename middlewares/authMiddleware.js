const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  // 1️⃣ جلب الـ token من الـ headers
  const authHeader = req.headers["authorization"] || req.headers["x-api-key"];
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  // 2️⃣ لو جاي في صيغة Bearer token ناخد الجزء بعد "Bearer "
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    // 3️⃣ فك الـ JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ هنا نخزن كل المعلومات المهمة في req.user
    req.user = {
      id: decoded.id,
      user_type: decoded.role,       // user / subscriber / admin
      is_super_admin: decoded.is_super_admin || false, // true/false
      permissions: decoded.permissions || [],    // array of strings لو موجودة
    };

    next(); // 5️⃣ نمشي للـ route handler
  } catch (err) {
    // 6️⃣ لو فيه خطأ بالـ JWT أو منتهي
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};