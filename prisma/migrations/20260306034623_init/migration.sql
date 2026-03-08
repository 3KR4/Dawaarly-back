/*
  Warnings:

  - The `rent_frequency` column on the `D_Vacation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `min_rent_period_unit` column on the `D_Vacation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `SubscriptionRequests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `Interests` on the `Users` table. All the data in the column will be lost.
  - The `gender` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `user_type` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('USER', 'ADMIN', 'SUBUSER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "RentFrequencyAndPeriodUnit" AS ENUM ('DAY', 'WEEK', 'MONTH');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropIndex
DROP INDEX "D_Vacation_created_at_idx";

-- AlterTable
ALTER TABLE "D_Vacation" DROP COLUMN "rent_frequency",
ADD COLUMN     "rent_frequency" "RentFrequencyAndPeriodUnit",
DROP COLUMN "min_rent_period_unit",
ADD COLUMN     "min_rent_period_unit" "RentFrequencyAndPeriodUnit";

-- AlterTable
ALTER TABLE "SubscriptionRequests" DROP COLUMN "status",
ADD COLUMN     "status" "RequestStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "Interests",
ADD COLUMN     "interests" INTEGER[],
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender",
DROP COLUMN "user_type",
ADD COLUMN     "user_type" "UserType" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE INDEX "D_Vacation_status_created_at_idx" ON "D_Vacation"("status", "created_at");

-- AddForeignKey
ALTER TABLE "AdminLogs" ADD CONSTRAINT "AdminLogs_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
