/*
  Warnings:

  - You are about to drop the column `ad_id` on the `D_Vacation` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "D_Vacation_ad_id_key";

-- AlterTable
ALTER TABLE "D_Vacation" DROP COLUMN "ad_id";
