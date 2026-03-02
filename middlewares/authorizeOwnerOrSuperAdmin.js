const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
exports.authorizeOwnerOrSuperAdmin = async (req, res, next) => {
  const { adId } = req.params;
  const ad = await prisma.D_Vacation.findUnique({
    where: { id: Number(adId) },
  });
  if (!ad) return res.status(404).json({ message: "Ad not found" });

  const isSuperAdmin = req.user?.is_super_admin;
  const isOwner = ad.admin_id === req.user.id || ad.subuser_id === req.user.id;

  if (!isOwner && !isSuperAdmin) {
    return res.status(403).json({ message: "Not allowed" });
  }

  req.ad = ad; // ممكن تمرره للـ controller لتوفير query ثاني
  next();
};
