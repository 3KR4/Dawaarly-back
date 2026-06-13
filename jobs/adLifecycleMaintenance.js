const cron = require("node-cron");
const { runAdLifecycleMaintenance } = require("../utils/adLifecycle");
const { deleteCachePattern } = require("../utils/redis");

let started = false;

const startAdLifecycleMaintenance = () => {
  if (started) return;
  started = true;

  cron.schedule("0 * * * *", async () => {
    try {
      const result = await runAdLifecycleMaintenance({ force: true });

      if (result.expiredCount > 0) {
        await deleteCachePattern("ads:list:*");
        await deleteCachePattern("userAds:*");
        await deleteCachePattern("sections:*");
      }
    } catch (error) {
      console.error("Ad lifecycle maintenance failed:", error.message);
    }
  });
};

module.exports = {
  startAdLifecycleMaintenance,
};
