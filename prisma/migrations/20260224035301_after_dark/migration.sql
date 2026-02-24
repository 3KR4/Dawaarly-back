/*
  Warnings:

  - The `status` column on the `Booking` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `DVacation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AdStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'SOLD', 'BOOKED', 'DISABLED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'BOOKED', 'CLIENT_ARRIVED', 'CLIENT_LEFT', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_ad_id_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_user_id_fkey";

-- DropForeignKey
ALTER TABLE "DVacation" DROP CONSTRAINT "DVacation_Users_id_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usersId" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "DVacation";

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3),
    "gender" TEXT,
    "user_type" TEXT NOT NULL DEFAULT 'user',
    "roles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_super_admin" BOOLEAN NOT NULL DEFAULT false,
    "tiktok_link" TEXT,
    "facebook_link" TEXT,
    "user_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "subscription_ads_limit" INTEGER,
    "active_ads_count" INTEGER NOT NULL DEFAULT 0,
    "last_otp_sent_at" TIMESTAMP(3),
    "verification_code" TEXT,
    "verification_expiry" TIMESTAMP(3),
    "admin_comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Countries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Governorates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country_id" INTEGER NOT NULL,

    CONSTRAINT "Governorates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cities" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "governorate_id" INTEGER NOT NULL,

    CONSTRAINT "Cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Areas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "city_id" INTEGER NOT NULL,

    CONSTRAINT "Areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compounds" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "area_id" INTEGER NOT NULL,

    CONSTRAINT "Compounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "SubCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "D_Vacation" (
    "id" SERIAL NOT NULL,
    "ad_id" TEXT NOT NULL,
    "status" "AdStatus" NOT NULL DEFAULT 'PENDING',
    "featured_priority" INTEGER NOT NULL DEFAULT 0,
    "approved_at" TIMESTAMP(3),
    "Users_id" INTEGER,
    "admin_id" INTEGER,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "category" VARCHAR(20) NOT NULL,
    "subcategory" VARCHAR(20) NOT NULL,
    "subcategory_star" INTEGER,
    "display_contact" BOOLEAN NOT NULL DEFAULT true,
    "display_phone" BOOLEAN NOT NULL DEFAULT true,
    "display_whatsapp" BOOLEAN NOT NULL DEFAULT true,
    "display_dawaarly_contact" BOOLEAN NOT NULL DEFAULT false,
    "rent_amount" DECIMAL(12,2),
    "rent_currency" TEXT,
    "rent_frequency" TEXT,
    "deposit_amount" DECIMAL(12,2),
    "min_rent_period" INTEGER,
    "min_rent_period_unit" TEXT,
    "available_from" TIMESTAMP(3),
    "available_to" TIMESTAMP(3),
    "country_id" INTEGER NOT NULL,
    "governorate_id" INTEGER NOT NULL,
    "city_id" INTEGER NOT NULL,
    "area_id" INTEGER,
    "compound_id" INTEGER,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "level" INTEGER,
    "adult_no_max" INTEGER,
    "child_no_max" INTEGER,
    "am_seeview" BOOLEAN NOT NULL DEFAULT false,
    "am_pool" BOOLEAN NOT NULL DEFAULT false,
    "am_balcony" BOOLEAN NOT NULL DEFAULT false,
    "am_private_garden" BOOLEAN NOT NULL DEFAULT false,
    "am_kitchen" BOOLEAN NOT NULL DEFAULT false,
    "am_ac" BOOLEAN NOT NULL DEFAULT false,
    "am_heating" BOOLEAN NOT NULL DEFAULT false,
    "am_elevator" BOOLEAN NOT NULL DEFAULT false,
    "am_gym" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "reach_count" INTEGER NOT NULL DEFAULT 0,
    "favorites_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "usersId" INTEGER,
    "categoriesId" INTEGER,
    "subCategoriesId" INTEGER,

    CONSTRAINT "D_Vacation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdImage" (
    "id" SERIAL NOT NULL,
    "ad_id" INTEGER NOT NULL,
    "public_id" TEXT NOT NULL,
    "secure_url" TEXT NOT NULL,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdRejection" (
    "id" SERIAL NOT NULL,
    "ad_id" INTEGER NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdRejection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdFavorite" (
    "id" SERIAL NOT NULL,
    "ad_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "AdFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdView" (
    "id" SERIAL NOT NULL,
    "ad_id" INTEGER NOT NULL,
    "ip_address" TEXT,
    "user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");

-- CreateIndex
CREATE INDEX "Governorates_country_id_idx" ON "Governorates"("country_id");

-- CreateIndex
CREATE INDEX "Cities_governorate_id_idx" ON "Cities"("governorate_id");

-- CreateIndex
CREATE INDEX "Areas_city_id_idx" ON "Areas"("city_id");

-- CreateIndex
CREATE INDEX "Compounds_area_id_idx" ON "Compounds"("area_id");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "Categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "D_Vacation_ad_id_key" ON "D_Vacation"("ad_id");

-- CreateIndex
CREATE INDEX "D_Vacation_status_idx" ON "D_Vacation"("status");

-- CreateIndex
CREATE INDEX "D_Vacation_city_id_idx" ON "D_Vacation"("city_id");

-- CreateIndex
CREATE INDEX "D_Vacation_governorate_id_idx" ON "D_Vacation"("governorate_id");

-- CreateIndex
CREATE INDEX "D_Vacation_area_id_idx" ON "D_Vacation"("area_id");

-- CreateIndex
CREATE INDEX "D_Vacation_featured_priority_idx" ON "D_Vacation"("featured_priority");

-- CreateIndex
CREATE INDEX "D_Vacation_rent_amount_idx" ON "D_Vacation"("rent_amount");

-- CreateIndex
CREATE UNIQUE INDEX "AdFavorite_ad_id_user_id_key" ON "AdFavorite"("ad_id", "user_id");

-- CreateIndex
CREATE INDEX "AdView_ad_id_idx" ON "AdView"("ad_id");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_user_id_idx" ON "Booking"("user_id");

-- CreateIndex
CREATE INDEX "Booking_ad_id_idx" ON "Booking"("ad_id");

-- AddForeignKey
ALTER TABLE "Governorates" ADD CONSTRAINT "Governorates_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cities" ADD CONSTRAINT "Cities_governorate_id_fkey" FOREIGN KEY ("governorate_id") REFERENCES "Governorates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Areas" ADD CONSTRAINT "Areas_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "Cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compounds" ADD CONSTRAINT "Compounds_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategories" ADD CONSTRAINT "SubCategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "D_Vacation" ADD CONSTRAINT "D_Vacation_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "D_Vacation" ADD CONSTRAINT "D_Vacation_categoriesId_fkey" FOREIGN KEY ("categoriesId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "D_Vacation" ADD CONSTRAINT "D_Vacation_subCategoriesId_fkey" FOREIGN KEY ("subCategoriesId") REFERENCES "SubCategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdImage" ADD CONSTRAINT "AdImage_ad_id_fkey" FOREIGN KEY ("ad_id") REFERENCES "D_Vacation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdRejection" ADD CONSTRAINT "AdRejection_ad_id_fkey" FOREIGN KEY ("ad_id") REFERENCES "D_Vacation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdFavorite" ADD CONSTRAINT "AdFavorite_ad_id_fkey" FOREIGN KEY ("ad_id") REFERENCES "D_Vacation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdView" ADD CONSTRAINT "AdView_ad_id_fkey" FOREIGN KEY ("ad_id") REFERENCES "D_Vacation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_ad_id_fkey" FOREIGN KEY ("ad_id") REFERENCES "D_Vacation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
