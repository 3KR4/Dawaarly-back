const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

cron.schedule("* * * * *", async () => {
  const isRunning = global.bookingCleanupRunning;

  if (isRunning) {
    console.log("⚠️ Previous cleanup still running, skipping...");
    return;
  }

  global.bookingCleanupRunning = true;

  try {
    const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

    const result = await prisma.booking.deleteMany({
      where: {
        status: "PENDING",
        created_at: { lt: twentyMinutesAgo },
      },
    });

    console.log(`✅ Cleaned ${result.count} old pending bookings`);
  } catch (error) {
    console.error("❌ Error cleaning bookings:", error);
  } finally {
    global.bookingCleanupRunning = false;
  }
});
