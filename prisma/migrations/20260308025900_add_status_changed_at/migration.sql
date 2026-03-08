/*
  Warnings:

  - You are about to drop the column `approved_at` on the `D_Vacation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "D_Vacation" DROP COLUMN "approved_at",
ADD COLUMN     "status_changed_at" TIMESTAMP(3);
