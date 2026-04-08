const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../utils/sendEmail");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const {
  checkSuperAdminPriority,
} = require("../middlewares/checkSuperAdminPriority");

// Rate limiter للـ auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 دقيقة
  max: 5, // 5 طلبات لكل IP
  message: { message: "Too many requests, please try again later" },
});
const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // دقيقة
  max: 3, // 3 محاولات فقط
  message: { message: "Too many OTP attempts, try again later" },
});
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
    { expiresIn: "15m" },
  );
}
function createRefreshToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}
// ----------------------- Serialize -----------------------
async function serializeUser(user, requester = null) {
  const [country, governorate, city] = await Promise.all([
    user.country_id
      ? prisma.Countries.findUnique({ where: { id: user.country_id } })
      : null,
    user.governorate_id
      ? prisma.Governorates.findUnique({
          where: { id: user.governorate_id },
        })
      : null,
    user.city_id
      ? prisma.Cities.findUnique({ where: { id: user.city_id } })
      : null,
  ]);

  const isAdmin = requester?.user_type === "ADMIN" || requester?.is_super_admin;

  const isOwner = requester?.id === user.id;

  const canSeeSensitive = isAdmin || isOwner;

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
    birth_date: user.birth_date,
    created_at: user.created_at,
    email_verified: user.email_verified,
    phone_verified: user.phone_verified,

    country: country || null,
    governorate: governorate || null,
    city: city || null,

    language: user.language,
    theme: user.theme,
    interests: user.interests || [],

    // 👇 public
    tiktok_link: user.tiktok_link,
    facebook_link: user.facebook_link,

    // 👇 sensitive
    ...(canSeeSensitive && {
      subscription_ads_limit: user.subscription_ads_limit || 0,
      user_type: user.user_type,
      permissions: user.permissions || [],
      is_super_admin: user.is_super_admin || false,
    }),
  };
}
// ----------------------- REGISTER -----------------------
exports.register = [
  authLimiter,
  async (req, res) => {
    const {
      full_name,
      email,
      password,
      phone,
      birth_date,
      gender,
      country_id,
      governorate_id,
      city_id,
      language,
      theme,
      interests,
    } = req.body;

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

    await prisma.Users.create({
      data: {
        full_name,
        email,
        phone,
        password: hashedPassword,
        birth_date: birth_date ? new Date(birth_date) : null,
        gender,
        country_id,
        governorate_id,
        city_id,
        language: language || "en",
        theme: theme || "light",
        interests: interests || [],
        verification_code: verificationCode,
        verification_expiry: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      message: "User created. Please verify your email.",
    });
  },
];
// ----------------------- LOGIN -----------------------
exports.login = [
  authLimiter,
  async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.Users.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    if (!user.email_verified) {
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();

      await prisma.Users.update({
        where: { email },
        data: {
          verification_code: verificationCode,
          verification_expiry: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      await sendVerificationEmail(email, verificationCode);

      return res.status(403).json({
        message: "Email not verified. Verification code sent again.",
      });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    const hashedToken = await bcrypt.hash(refreshToken, 10);

    await prisma.RefreshToken.create({
      data: {
        token: hashedToken,
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

    res.json({
      accessToken,
      user: await serializeUser(user, user),
    });
  },
];

// ----------------------- REFRESH TOKEN -----------------------
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    // أول خطوة: verify للـ token
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Refresh token expired" });

      // دلوقتي decoded موجود
      const tokens = await prisma.RefreshToken.findMany({
        where: { userId: decoded.id },
      });

      let validToken = null;
      for (const t of tokens) {
        const isMatch = await bcrypt.compare(token, t.token);
        if (isMatch) {
          validToken = t;
          break;
        }
      }

      if (!validToken)
        return res.status(403).json({ message: "Invalid refresh token" });

      const user = await prisma.Users.findUnique({ where: { id: decoded.id } });
      if (!user) return res.status(404).json({ message: "User not found" });

      const newAccessToken = createAccessToken(user);

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error(error);
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

exports.verifyEmail = [
  otpLimiter,
  async (req, res) => {
    const { email, code } = req.body;

    const user = await prisma.Users.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      user.verification_code !== code ||
      new Date() > user.verification_expiry
    )
      return res.status(400).json({ message: "Invalid or expired code" });

    const updatedUser = await prisma.Users.update({
      where: { email },
      data: {
        email_verified: true,
        verification_code: null,
        verification_expiry: null,
      },
    });

    const accessToken = createAccessToken(updatedUser);
    const refreshToken = createRefreshToken(updatedUser);

    const hashedToken = await bcrypt.hash(refreshToken, 10);

    await prisma.RefreshToken.create({
      data: {
        token: hashedToken,
        userId: updatedUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Email verified successfully",
      accessToken,
      user: await serializeUser(updatedUser, updatedUser),
    });
  },
];
exports.resendOTP = [
  otpLimiter,
  async (req, res) => {
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
  },
];
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.Users.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    // ================== تحقق من الوقت لو عمل resend ==================
    const now = new Date(); // توقيت الجهاز الحالي
    if (user.reset_password_expiry) {
      const lastRequest = new Date(
        user.reset_password_expiry.getTime() - 10 * 60 * 1000,
      ); // آخر مرة تم فيها إنشاء الكود
      if (now - lastRequest < 60 * 1000) {
        return res.status(429).json({
          message: "Please wait at least 1 minute before requesting again",
        });
      }
    }

    // ================== إنشاء OTP ==================
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // صلاحية 10 دقائق

    await prisma.Users.update({
      where: { email },
      data: { reset_password_code: resetCode, reset_password_expiry: expiry },
    });

    await sendVerificationEmail(email, resetCode); // إرسال OTP

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { email, new_password, otp } = req.body;
    const user = await prisma.Users.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date(); // توقيت الجهاز الحالي

    // ================== تحقق من صحة OTP ==================
    if (
      user.reset_password_code !== otp ||
      !user.reset_password_expiry ||
      now > user.reset_password_expiry
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // ================== تشفير كلمة السر الجديدة ==================
    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    await prisma.Users.update({
      where: { email },
      data: {
        password: hashedNewPassword,
        reset_password_code: null,
        reset_password_expiry: null,
      },
    });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      full_name,
      phone,
      birth_date,
      gender,
      country_id,
      governorate_id,
      city_id,
      language,
      theme,
      interests,
    } = req.body;

    const cleanData = (obj) => {
      return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined),
      );
    };

    const data = cleanData({
      full_name,
      phone,
      gender,
      birth_date: birth_date ? new Date(birth_date) : undefined,
      country_id,
      governorate_id,
      city_id,
      language,
      theme,
      interests,
    });

    const user = await prisma.Users.update({
      where: { id: userId },
      data,
    });

    res.json({
      message: "Profile updated",
      user: await serializeUser(user, req.user),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateSubuserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.Users.findUnique({
      where: { id: userId },
    });

    if (user.user_type !== "SUBUSER")
      return res.status(403).json({ message: "Only subusers can update this" });

    const { facebook_link, tiktok_link } = req.body;

    const updated = await prisma.Users.update({
      where: { id: userId },
      data: {
        facebook_link,
        tiktok_link,
      },
    });

    res.json({
      message: "Updated",
      user: await serializeUser(updated, req.user),
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.setSuperAdmin = async (req, res) => {
  try {
    const requester = req.user;
    const targetId = Number(req.params.id);
    const { makeSuper } = req.body; // true => promote, false => demote

    if (!requester.is_super_admin) {
      return res
        .status(403)
        .json({ message: "Only super admins can assign super admins" });
    }

    // ممكن تضيف check الأولوية لو عايز
    await checkSuperAdminPriority(requester.id, targetId);

    await prisma.Users.update({
      where: { id: targetId },
      data: {
        is_super_admin: !!makeSuper, // true/false حسب الطلب
        user_type: makeSuper ? "ADMIN" : "ADMIN", // ممكن تخليها مش متغيرة عند demote
      },
    });

    res.json({
      message: makeSuper
        ? "User promoted to super admin"
        : "User demoted from super admin",
    });
  } catch (e) {
    res
      .status(403)
      .json({ message: e.message || "Cannot change super admin status" });
  }
};
exports.updateSubscriptionLimit = async (req, res) => {
  try {
    const requester = req.user;
    if (
      !requester.is_super_admin &&
      !requester.permissions?.includes("CHANGE_SUBUSER_LIMIT")
    ) {
      return res.status(403).json({
        message: "Forbidden: Not allowed to change subscription limit",
      });
    }

    const userId = Number(req.params.id);
    const { subscription_ads_limit } = req.body;

    const user = await prisma.Users.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.user_type !== "SUBUSER") {
      return res
        .status(400)
        .json({ message: "Only subusers can have subscription limit" });
    }

    await prisma.Users.update({
      where: { id: userId },
      data: { subscription_ads_limit: subscription_ads_limit || 0 },
    });

    res.json({
      message: "Subscription ads limit updated successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
exports.changeUserRole = async (req, res) => {
  try {
    const requester = req.user;
    const userId = Number(req.params.id);
    const { user_type } = req.body;

    // جلب المستخدم الهدف
    const user = await prisma.Users.findUnique({
      where: { id: userId },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    // منع تغيير رول سوبر ادمن
    if (user.is_super_admin) {
      return res.status(400).json({
        message: "Cannot change role of a super admin",
      });
    }

    // ---------------- قواعد التغيير ----------------
    if (user_type === "ADMIN") {
      // لو حد عايز يحول لادمن → لازم يكون سوبر ادمن
      if (!requester.is_super_admin) {
        return res.status(403).json({
          message: "Only super admin can promote someone to admin",
        });
      }

      // تحديث رول و permissions افتراضية
      const updateData = {
        user_type: "ADMIN",
        permissions: ["CHANGE_ADS_STATUS"],
      };

      await prisma.Users.update({
        where: { id: userId },
        data: updateData,
      });

      return res.json({
        message: "User promoted to ADMIN",
      });
    }

    if (user_type === "SUBUSER") {
      // لازم يكون عنده صلاحية MAKE_SUBSCRIBER
      if (
        !requester.is_super_admin &&
        !requester.permissions?.includes("MAKE_SUBSCRIBER")
      ) {
        return res.status(403).json({
          message: "You don't have permission to make someone a subscriber",
        });
      }

      const updateData = {
        user_type: "SUBUSER",
      };

      await prisma.Users.update({
        where: { id: userId },
        data: updateData,
      });

      return res.json({
        message: "User converted to SUBUSER",
      });
    }

    if (user_type === "USER") {
      // لازم يكون عنده صلاحية لتغيير الرول
      if (!requester.is_super_admin) {
        return res.status(403).json({
          message: "You don't have permission to demote someone to USER",
        });
      }

      const updateData = {
        user_type: "USER",
        permissions: [], // أو صلاحيات افتراضية للـ USER العادي
        subscription_ads_limit: 0,
      };

      await prisma.Users.update({
        where: { id: userId },
        data: updateData,
      });

      return res.json({
        message: "User demoted to USER",
      });
    }

    // منع تغيير SUBUSER أو أي رول آخر
    return res.status(400).json({
      message: "Role change not allowed",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updatePermissions = async (req, res) => {
  try {
    const requester = req.user;

    if (!requester.is_super_admin)
      return res.status(403).json({ message: "Super admin only" });

    const userId = Number(req.params.id);
    const { permissions } = req.body;

    const user = await prisma.Users.findUnique({
      where: { id: userId },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    // ✅ هنا نضيف check للسوبر ادمن
    if (user.is_super_admin) {
      return res.status(403).json({
        message: "Cannot change permissions of a super admin",
      });
    }

    if (user.user_type !== "ADMIN")
      return res.status(400).json({
        message: "Permissions only for admins",
      });

    const updated = await prisma.Users.update({
      where: { id: userId },
      data: { permissions },
    });

    res.json({
      message: "Permissions updated",
      user: await serializeUser(updated, req.user),
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.userId);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const userToDelete = await prisma.Users.findUnique({
      where: { id },
    });

    if (!userToDelete)
      return res.status(404).json({ message: "User not found" });

    const requester = req.user;

    // منع حذف السوبر ادمن
    if (userToDelete.is_super_admin) {
      return res.status(403).json({
        message: "Super admin cannot be deleted",
      });
    }

    // ---------------- صلاحيات الحذف ----------------

    if (!requester.is_super_admin) {
      // Admin عادي
      if (requester.user_type === "ADMIN") {
        if (userToDelete.user_type === "ADMIN") {
          return res
            .status(403)
            .json({ message: "Admin cannot delete another admin" });
        }
      } else {
        // مستخدم عادي
        if (requester.id !== userToDelete.id) {
          return res
            .status(403)
            .json({ message: "You can only delete your own account" });
        }
      }
    }

    // حذف refresh tokens
    await prisma.RefreshToken.deleteMany({
      where: { userId: userToDelete.id },
    });

    // حذف المستخدم
    await prisma.Users.delete({
      where: { id: userToDelete.id },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { old_password, new_password } = req.body;

    const user = await prisma.Users.findUnique({
      where: { id: userId },
    });

    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Old password is incorrect" });

    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    await prisma.Users.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const requester = req.user;

    if (requester.user_type !== "ADMIN" && !requester.is_super_admin) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    let { user_type, permissions, search, page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    const where = {};

    // فلتر نوع المستخدم (قيمة واحدة)
    if (user_type) {
      where.user_type = user_type;
    }

    // فلتر الاسم
    if (search) {
      where.OR = [
        {
          full_name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // فلتر الصلاحيات (أكثر من قيمة)
    if (permissions) {
      const permsArray = permissions.split(",");

      where.permissions = {
        hasSome: permsArray,
      };
    }

    const total = await prisma.Users.count({ where });

    const users = await prisma.Users.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    const userIds = users.map((u) => u.id);

    const activeAdsCounts = await prisma.D_Vacation.groupBy({
      by: ["admin_id", "subuser_id"],
      where: {
        status: "ACTIVE",
        OR: [{ admin_id: { in: userIds } }, { subuser_id: { in: userIds } }],
      },
      _count: { id: true },
    });

    const countsMap = {};

    // احسب لكل واحد سواء admin او subuser
    activeAdsCounts.forEach((c) => {
      if (c.admin_id)
        countsMap[c.admin_id] = (countsMap[c.admin_id] || 0) + c._count.id;
      if (c.subuser_id)
        countsMap[c.subuser_id] = (countsMap[c.subuser_id] || 0) + c._count.id;
    });
    const serializedUsers = await Promise.all(
      users.map(async (u) => {
        const base = await serializeUser(u, requester);
        base.active_ads_count = countsMap[u.id] || 0;
        return base;
      }),
    );

    res.json({
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },

      users: serializedUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getUser = async (req, res) => {
  try {
    const requester = req.user; // ممكن يكون null
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const user = await prisma.Users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const serialized = await serializeUser(user, requester);

    res.json(serialized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getMe = async (req, res) => {
  try {
    const user = await prisma.Users.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(await serializeUser(user, user));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
