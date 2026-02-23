-- AlterTable
ALTER TABLE "SubUser" ADD COLUMN     "active_ads_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "phone_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "roles" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "subscription_ads_limit" INTEGER;
