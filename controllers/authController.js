const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../utils/sendEmail");
const prisma = new PrismaClient();

function serializeUser(user) {
  const base = {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
    birth_date: user.birth_date,
    created_at: user.created_at,
    user_type: user.user_type,
  };

  switch (user.user_type) {
    case "subscriber":
      base.tiktok_link = user.tiktok_link;
      base.facebook_link = user.facebook_link;
      base.active_ads_count = user.active_ads_count;
      base.subscription_ads_limit = user.subscription_ads_limit || 0;
      break;

    case "admin":
      base.roles = user.roles || [];
      base.active_ads_count = user.active_ads_count;
      break;

    default:
      // Regular user
      base.email_verified = user.email_verified;
      base.phone_verified = user.phone_verified;
      break;
  }
  base.is_super_admin = user.is_super_admin || false;
  return base;
}
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, birth_date, gender } = req.body;

    if (!full_name || !email || !password || !phone)
      return res.status(400).json({ message: "Missing required fields" });

    const existingEmail = await prisma.subUser.findUnique({ where: { email } });
    if (existingEmail)
      return res.status(400).json({ message: "Email already exists" });

    const existingPhone = await prisma.subUser.findUnique({ where: { phone } });
    if (existingPhone)
      return res.status(400).json({ message: "Phone already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const user = await prisma.subUser.create({
      data: {
        full_name,
        email,
        phone,
        password: hashedPassword,
        birth_date: birth_date ? new Date(birth_date) : null,
        gender,
        verification_code: verificationCode,
        verification_expiry: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendVerificationEmail(email, verificationCode);

    // Create JWT including roles & is_super_admin
    const token = jwt.sign(
      {
        id: user.id,
        role: user.user_type,
        roles: user.roles || [],
        is_super_admin: user.is_super_admin || false,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      message: "User created, verify email",
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.log(error);

    if (error.code === "P2002") {
      const field = error.meta.target[0];
      const messages = {
        email: "This email is already registered",
        phone: "This phone number is already registered",
      };
      return res
        .status(400)
        .json({ message: messages[field] || `${field} must be unique` });
    }

    res.status(500).json({ message: "Server error" });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.subUser.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!user.email_verified) {
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      const expiry = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.subUser.update({
        where: { email },
        data: {
          verification_code: verificationCode,
          verification_expiry: expiry,
        },
      });

      await sendVerificationEmail(email, verificationCode);

      return res
        .status(403)
        .json({ message: "Email not verified. OTP resent." });
    }

    // JWT with roles & is_super_admin
    const token = jwt.sign(
      {
        id: user.id,
        role: user.user_type,
        roles: user.roles || [],
        is_super_admin: user.is_super_admin || false,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  const user = await prisma.subUser.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.verification_code !== code || new Date() > user.verification_expiry)
    return res.status(400).json({ message: "Invalid or expired code" });

  await prisma.subUser.update({
    where: { email },
    data: {
      email_verified: true,
      verification_code: null,
      verification_expiry: null,
    },
  });

  res.json({ message: "Email verified successfully" });
};
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.subUser.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.email_verified)
      return res.status(400).json({ message: "Email already verified" });

    const now = new Date();
    if (user.last_otp_sent_at && now - user.last_otp_sent_at < 60 * 1000) {
      // لو محاولش قبل 60 ثانية
      return res
        .status(429)
        .json({ message: "Wait before requesting OTP again" });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 دقايق

    await prisma.subUser.update({
      where: { email },
      data: {
        verification_code: verificationCode,
        verification_expiry: expiry,
        last_otp_sent_at: now,
      },
    });

    await sendVerificationEmail(email, verificationCode);

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      full_name,
      phone,
      gender,
      birth_date,
      tiktok_link,
      facebook_link,
      admin_comment,
      user_type,    // جديد
      roles,        // جديد
      is_super_admin // جديد
    } = req.body;

    const userToUpdate = await prisma.subUser.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!userToUpdate)
      return res.status(404).json({ message: "User not found" });

    const requester = req.user;

    // قواعد الصلاحيات:
    if (!requester.is_super_admin) {
      if (requester.user_type === "admin") {
        if (
          userToUpdate.user_type === "admin" &&
          !userToUpdate.is_super_admin
        ) {
          return res
            .status(403)
            .json({ message: "Admin cannot edit another admin" });
        }
      } else {
        if (requester.id !== userToUpdate.id) {
          return res
            .status(403)
            .json({ message: "You can only edit your own profile" });
        }
      }
    }

    const updatedUser = await prisma.subUser.update({
      where: { id: parseInt(userId) },
      data: {
        full_name,
        phone,
        gender,
        birth_date: birth_date ? new Date(birth_date) : undefined,
        tiktok_link,
        facebook_link,
        admin_comment,
        ...(requester.is_super_admin && { user_type, roles, is_super_admin }),
      },
    });

    res.json(serializeUser(updatedUser));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const userToDelete = await prisma.subUser.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!userToDelete)
      return res.status(404).json({ message: "User not found" });

    const requester = req.user;

    if (!requester.is_super_admin) {
      if (requester.user_type === "admin") {
        // Admin مش قادر يحذف Admin آخر أو SuperAdmin
        if (
          (userToDelete.user_type === "admin" &&
            !userToDelete.is_super_admin) ||
          userToDelete.is_super_admin
        ) {
          return res
            .status(403)
            .json({ message: "Admin cannot delete this user" });
        }
      } else {
        // user أو subscriber يحذف نفسه فقط
        if (requester.id !== userToDelete.id) {
          return res
            .status(403)
            .json({ message: "You can only delete your own account" });
        }
      }
    }

    await prisma.subUser.delete({ where: { id: parseInt(userId) } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const { email, old_password, new_password } = req.body;

    const user = await prisma.subUser.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Old password is incorrect" });

    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    await prisma.subUser.update({
      where: { email },
      data: { password: hashedNewPassword },
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const requester = req.user;
    if (requester.user_type !== "admin" && !requester.is_super_admin) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    let { user_type, search, page, limit } = req.query;

    page = parseInt(page) || 1; // الصفحة الافتراضية
    limit = parseInt(limit) || 10; // عدد المستخدمين في كل صفحة
    const skip = (page - 1) * limit;

    const where = {};

    if (user_type) {
      where.user_type = user_type;
    }

    if (search) {
      where.full_name = {
        contains: search,
        mode: "insensitive",
      };
    }

    // إجمالي عدد المستخدمين للصفحات
    const total = await prisma.subUser.count({ where });

    const users = await prisma.subUser.findMany({
      where,
      include: { ads: true, bookings: true },
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    const serializedUsers = users.map((u) => serializeUser(u));

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      users: serializedUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getUserAds = async (req, res) => {
  const userId = parseInt(req.params.userId);

  const user = await prisma.subUser.findUnique({
    where: { id: userId },
    include: { ads: true },
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  // Admin أو صاحب الحساب فقط
  if (req.user.id !== userId && req.user.user_type !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  res.json(user.ads);
};
exports.getUserBookings = async (req, res) => {
  const userId = parseInt(req.params.userId);

  const user = await prisma.subUser.findUnique({
    where: { id: userId },
    include: { bookings: true },
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (req.user.id !== userId && req.user.user_type !== "admin")
    return res.status(403).json({ message: "Forbidden" });

  res.json(user.bookings);
};
