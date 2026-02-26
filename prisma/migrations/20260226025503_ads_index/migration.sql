/*
  Warnings:

  - You are about to drop the column `usersId` on the `Booking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_usersId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "usersId";

-- CreateIndex
CREATE INDEX "D_Vacation_created_at_idx" ON "D_Vacation"("created_at");

-- CreateIndex
CREATE INDEX "D_Vacation_compound_id_idx" ON "D_Vacation"("compound_id");

-- CreateIndex
CREATE INDEX "D_Vacation_categoryId_idx" ON "D_Vacation"("categoryId");

-- CreateIndex
CREATE INDEX "D_Vacation_subCategoryId_idx" ON "D_Vacation"("subCategoryId");

-- CreateIndex
CREATE INDEX "D_Vacation_deposit_amount_idx" ON "D_Vacation"("deposit_amount");

-- CreateIndex
CREATE INDEX "D_Vacation_status_categoryId_city_id_created_at_idx" ON "D_Vacation"("status", "categoryId", "city_id", "created_at");

-- CreateIndex
CREATE INDEX "D_Vacation_status_featured_priority_idx" ON "D_Vacation"("status", "featured_priority");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
