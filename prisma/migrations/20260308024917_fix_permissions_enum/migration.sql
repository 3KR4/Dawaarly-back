/*
  Warnings:

  - You are about to drop the column `user_id` on the `D_Vacation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "D_Vacation" DROP CONSTRAINT "D_Vacation_user_id_fkey";

-- AlterTable
ALTER TABLE "D_Vacation" DROP COLUMN "user_id";
