/*
  Warnings:

  - You are about to drop the column `description` on the `Sliders` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Sliders` table. All the data in the column will be lost.
  - Added the required column `name_ar` to the `Sliders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Sliders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sliders" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "description_ar" TEXT,
ADD COLUMN     "description_en" TEXT,
ADD COLUMN     "name_ar" TEXT NOT NULL,
ADD COLUMN     "name_en" TEXT NOT NULL,
ALTER COLUMN "order" SET DEFAULT 0;
