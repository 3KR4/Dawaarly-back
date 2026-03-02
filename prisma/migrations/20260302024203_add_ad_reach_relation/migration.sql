/*
  Warnings:

  - You are about to drop the column `roles` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "D_Vacation" ADD COLUMN     "was_previously_approved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "roles",
ADD COLUMN     "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "AdReach" (
    "id" SERIAL NOT NULL,
    "ad_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdReach_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdReach_ad_id_user_id_key" ON "AdReach"("ad_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "AdReach_ad_id_ip_address_key" ON "AdReach"("ad_id", "ip_address");

-- CreateIndex
CREATE INDEX "D_Vacation_status_subCategoryId_city_id_created_at_idx" ON "D_Vacation"("status", "subCategoryId", "city_id", "created_at");

-- AddForeignKey
ALTER TABLE "AdReach" ADD CONSTRAINT "AdReach_ad_id_fkey" FOREIGN KEY ("ad_id") REFERENCES "D_Vacation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
