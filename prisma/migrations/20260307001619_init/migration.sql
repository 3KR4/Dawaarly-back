/*
  Warnings:

  - The `permissions` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('CREATE_AD', 'DELETE_AD', 'UPDATE_AD', 'VIEW_ANALYTICS');

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "permissions",
ADD COLUMN     "permissions" "Permission"[];
