/*
  Warnings:

  - You are about to drop the column `usersId` on the `D_Vacation` table. All the data in the column will be lost.
  - The `rent_currency` column on the `D_Vacation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `user_verified` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `AdImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'EGP', 'SAR', 'AED');

-- CreateEnum
CREATE TYPE "ImageEntityType" AS ENUM ('AD', 'SLIDER', 'USER', 'CATEGORY', 'AREA', 'COMPOUND');

-- DropForeignKey
ALTER TABLE "AdImage" DROP CONSTRAINT "AdImage_ad_id_fkey";

-- DropForeignKey
ALTER TABLE "D_Vacation" DROP CONSTRAINT "D_Vacation_usersId_fkey";

-- DropIndex
DROP INDEX "D_Vacation_status_categoryId_city_id_created_at_idx";

-- DropIndex
DROP INDEX "D_Vacation_status_subCategoryId_city_id_created_at_idx";

-- AlterTable
ALTER TABLE "D_Vacation" DROP COLUMN "usersId",
ADD COLUMN     "user_id" INTEGER,
DROP COLUMN "rent_currency",
ADD COLUMN     "rent_currency" "Currency" NOT NULL DEFAULT 'EGP';

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "user_verified",
ADD COLUMN     "city_id" INTEGER,
ADD COLUMN     "country_id" INTEGER,
ADD COLUMN     "governorate_id" INTEGER,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'light',
ALTER COLUMN "subscription_ads_limit" SET DEFAULT 0;

-- DropTable
DROP TABLE "AdImage";

-- CreateTable
CREATE TABLE "SubscriptionRequests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "rejection_reason" TEXT,
    "reviewed_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "SubscriptionRequests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Images" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT NOT NULL,
    "secure_url" TEXT NOT NULL,
    "folder" TEXT,
    "entity_type" "ImageEntityType" NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sliders" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "link" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sliders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminLogs" (
    "id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Images_entity_type_entity_id_idx" ON "Images"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "D_Vacation_status_categoryId_rent_amount_city_id_created_at_idx" ON "D_Vacation"("status", "categoryId", "rent_amount", "city_id", "created_at");

-- CreateIndex
CREATE INDEX "D_Vacation_status_subCategoryId_rent_amount_city_id_created_idx" ON "D_Vacation"("status", "subCategoryId", "rent_amount", "city_id", "created_at");

-- CreateIndex
CREATE INDEX "Users_country_id_idx" ON "Users"("country_id");

-- CreateIndex
CREATE INDEX "Users_governorate_id_idx" ON "Users"("governorate_id");

-- CreateIndex
CREATE INDEX "Users_city_id_idx" ON "Users"("city_id");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_governorate_id_fkey" FOREIGN KEY ("governorate_id") REFERENCES "Governorates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "Cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionRequests" ADD CONSTRAINT "SubscriptionRequests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubscriptionRequests" ADD CONSTRAINT "SubscriptionRequests_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "D_Vacation" ADD CONSTRAINT "D_Vacation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdFavorite" ADD CONSTRAINT "AdFavorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
