/*
  Warnings:

  - Added the required column `city_id` to the `Compounds` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Compounds" DROP CONSTRAINT "Compounds_area_id_fkey";

-- AlterTable
ALTER TABLE "Compounds" ADD COLUMN     "city_id" INTEGER NOT NULL,
ALTER COLUMN "area_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Compounds_city_id_idx" ON "Compounds"("city_id");

-- AddForeignKey
ALTER TABLE "Compounds" ADD CONSTRAINT "Compounds_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "Cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compounds" ADD CONSTRAINT "Compounds_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
