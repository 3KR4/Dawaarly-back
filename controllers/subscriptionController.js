const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createSubscriptionRequest = async (req, res) => {
  try {
    const userId = req.user.id;

    const existingRequest = await prisma.subscriptionRequests.findFirst({
      where: {
        user_id: userId,
        status: "pending",
      },
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You already have a pending request",
      });
    }

    const request = await prisma.subscriptionRequests.create({
      data: {
        user_id: userId,
      },
    });

    res.json({
      message: "Subscription request submitted",
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
exports.getSubscriptionRequests = async (req, res) => {
  try {
    const requests = await prisma.subscriptionRequests.findMany({
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
exports.approveSubscriptionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const request = await prisma.subscriptionRequests.update({
      where: { id: Number(id) },
      data: {
        status: "approved",
        reviewed_by: adminId,
        reviewed_at: new Date(),
      },
    });

    await prisma.users.update({
      where: { id: request.user_id },
      data: {
        user_type: "SUBUSER",
      },
    });

    res.json({
      message: "Request approved",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
exports.rejectSubscriptionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejection_reason } = req.body;
    const adminId = req.user.id;

    const request = await prisma.subscriptionRequests.update({
      where: { id: Number(id) },
      data: {
        status: "rejected",
        rejection_reason,
        reviewed_by: adminId,
        reviewed_at: new Date(),
      },
    });

    res.json({
      message: "Request rejected",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
