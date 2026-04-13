const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


async function checkSuperAdminPriority(requesterId, targetId) {
  const requester = await prisma.Users.findUnique({
    where: { id: requesterId },
  });
  const target = await prisma.Users.findUnique({ where: { id: targetId } });

  if (!requester || !target) throw new Error("User not found");

  // لو الهدف سوبر أدمن
  if (target.is_super_admin) {
    if (!requester.is_super_admin) {
      throw new Error("Only super admins can modify super admins");
    }

    // الأقدم له أولوية
    if (target.created_at < requester.created_at) {
      throw new Error("Cannot modify an older super admin");
    }
  }
}

module.exports = { checkSuperAdminPriority };
