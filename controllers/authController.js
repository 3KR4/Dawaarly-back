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
    email_verified: user.email_verified,
    phone_verified: user.phone_verified,
    is_super_admin: user.is_super_admin || false,
  };
  if (user.user_type === "subscriber") {
    base.tiktok_link = user.tiktok_link;
    base.facebook_link = user.facebook_link;
    base.subscription_ads_limit = user.subscription_ads_limit || 0;
  } else if (user.user_type === "admin") {
    base.permissions = user.permissions || [];
  }
  return base;
}

// ----------------------- Helper Tokens -----------------------
function createAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.user_type,
      permissions: user.permissions || [],
      is_super_admin: user.is_super_admin || false,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }, // access token قصير
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }, // refresh token أطول
  );
}

// ----------------------- REGISTER -----------------------
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone, birth_date, gender } = req.body;
    if (!full_name || !email || !password || !phone)
      return res.status(400).json({ message: "Missing required fields" });

    const existingEmail = await prisma.Users.findUnique({ where: { email } });
    if (existingEmail)
      return res.status(400).json({ message: "Email already exists" });

    const existingPhone = await prisma.Users.findUnique({ where: { phone } });
    if (existingPhone)
      return res.status(400).json({ message: "Phone already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const user = await prisma.Users.create({
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

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    await prisma.RefreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created, verify email",
      accessToken,
      user: serializeUser(user),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------- LOGIN -----------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.Users.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!user.email_verified) {
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      const expiry = new Date(Date.now() + 10 * 60 * 1000);
      await prisma.Users.update({
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

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    await prisma.RefreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user: serializeUser(user) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------- REFRESH TOKEN -----------------------
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const dbToken = await prisma.RefreshToken.findUnique({ where: { token } });
    if (!dbToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Refresh token expired" });

      const user = await prisma.Users.findUnique({ where: { id: decoded.id } });
      if (!user) return res.status(404).json({ message: "User not found" });

      const newAccessToken = createAccessToken(user);
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------- LOGOUT -----------------------
exports.logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await prisma.RefreshToken.deleteMany({ where: { token } });
      res.clearCookie("refreshToken");
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  const user = await prisma.Users.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.verification_code !== code || new Date() > user.verification_expiry)
    return res.status(400).json({ message: "Invalid or expired code" });

  await prisma.Users.update({
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

    const user = await prisma.Users.findUnique({ where: { email } });

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

    await prisma.Users.update({
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
      user_type, // admin / subscriber / user
      permissions, // array
      is_super_admin, // boolean
    } = req.body;

    const userToUpdate = await prisma.Users.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!userToUpdate)
      return res.status(404).json({ message: "User not found" });

    const requester = req.user;

    // ---------------- قواعد الصلاحيات ----------------
    if (requester.is_super_admin) {
      // Super Admin يقدر يعدل أي شيء
    } else if (requester.user_type === "admin") {
      // Admin عادي
      if (userToUpdate.user_type === "admin" || userToUpdate.is_super_admin) {
        return res.status(403).json({ message: "Cannot edit other admins" });
      }
      // Admin عادي مش قادر يغير النوع أو الصلاحيات
      if (user_type || permissions || is_super_admin !== undefined) {
        return res
          .status(403)
          .json({ message: "Cannot change role or permissions" });
      }
    } else {
      // مستخدم عادي
      if (requester.id !== userToUpdate.id) {
        return res
          .status(403)
          .json({ message: "You can only edit your own profile" });
      }
      if (user_type || permissions || is_super_admin !== undefined) {
        return res
          .status(403)
          .json({ message: "Cannot change role or permissions" });
      }
    }

    // ---------------- تحديث البيانات ----------------
    const updatedUser = await prisma.Users.update({
      where: { id: parseInt(userId) },
      data: {
        full_name,
        phone,
        gender,
        birth_date: birth_date ? new Date(birth_date) : undefined,
        tiktok_link,
        facebook_link,
        admin_comment,
        ...(requester.is_super_admin && {
          user_type: user_type || userToUpdate.user_type,
          permissions: permissions || userToUpdate.permissions,
          is_super_admin:
            is_super_admin !== undefined
              ? is_super_admin
              : userToUpdate.is_super_admin,
        }),
      },
    });

    res.json({
      message: "User updated successfully",
      user: serializeUser(updatedUser),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const userToDelete = await prisma.Users.findUnique({
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

    await prisma.Users.delete({ where: { id: parseInt(userId) } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const { email, old_password, new_password } = req.body;

    const user = await prisma.Users.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Old password is incorrect" });

    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    await prisma.Users.update({
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
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const where = {};
    if (user_type) where.user_type = user_type;
    if (search) where.full_name = { contains: search, mode: "insensitive" };

    // إجمالي عدد المستخدمين
    const total = await prisma.Users.count({ where });

    // جلب المستخدمين بدون الاعتماد على include.ads
    const users = await prisma.Users.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    // جلب عدد الإعلانات النشطة لكل مستخدم دفعة واحدة
    const userIds = users.map((u) => u.id);
    const activeAdsCounts = await prisma.D_Vacation.groupBy({
      by: ["admin_id"],
      where: {
        admin_id: { in: userIds },
        status: "ACTIVE",
      },
      _count: { id: true },
    });

    const countsMap = {};
    activeAdsCounts.forEach((c) => (countsMap[c.admin_id] = c._count.id));

    // تسلسل المستخدمين
    const serializedUsers = users.map((u) => {
      const base = serializeUser(u);
      base.active_ads_count = countsMap[u.id] || 0;
      return base;
    });

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      users: serializedUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};