const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

cron.schedule("* * * * *", async () => {
  const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

  await prisma.booking.deleteMany({
    where: {
      status: "PENDING",
      created_at: { lt: twentyMinutesAgo },
    },
  });

  console.log("Old pending bookings cleaned");
});