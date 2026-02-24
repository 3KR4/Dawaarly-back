/*
  Warnings:

  - You are about to drop the column `Users_id` on the `D_Vacation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "D_Vacation" DROP COLUMN "Users_id",
ADD COLUMN     "subuser_id" INTEGER;
