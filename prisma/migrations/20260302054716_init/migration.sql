/*
  Warnings:

  - You are about to drop the `AdRejection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AdRejection" DROP CONSTRAINT "AdRejection_ad_id_fkey";

-- AlterTable
ALTER TABLE "D_Vacation" ADD COLUMN     "reject_reason" TEXT;

-- DropTable
DROP TABLE "AdRejection";
