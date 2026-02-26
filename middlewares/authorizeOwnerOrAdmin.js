exports.authorizeOwnerOrAdmin = async (req, res, next) => {
  const { adId } = req.params;

  const ad = await prisma.D_Vacation.findUnique({
    where: { id: Number(adId) },
  });

  if (!ad) {
    return res.status(404).json({ message: "Ad not found" });
  }

  const isAdmin =
    req.user?.is_super_admin || req.user?.user_type === "admin";

  const isOwner =
    ad.admin_id === req.user.id ||
    ad.subuser_id === req.user.id;

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ message: "Not allowed" });
  }
  next();
};