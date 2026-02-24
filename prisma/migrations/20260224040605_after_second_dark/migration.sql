/*
  Warnings:

  - You are about to drop the column `name` on the `Areas` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Categories` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Cities` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Compounds` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Countries` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Governorates` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SubCategories` table. All the data in the column will be lost.
  - Added the required column `name_ar` to the `Areas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Areas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_ar` to the `Categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_ar` to the `Cities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Cities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_ar` to the `Compounds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Compounds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_ar` to the `Countries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Countries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_ar` to the `Governorates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Governorates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_ar` to the `SubCategories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `SubCategories` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Categories_name_key";

-- AlterTable
ALTER TABLE "Areas" DROP COLUMN "name",
ADD COLUMN     "name_ar" TEXT NOT NULL,
ADD COLUMN     "name_en" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Categories" DROP COLUMN "name",
ADD COLUMN     "name_ar" TEXT NOT NULL,
ADD COLUMN     "name_en" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Cities" DROP COLUMN "name",
ADD COLUMN     "name_ar" TEXT NOT NULL,
ADD COLUMN     "name_en" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Compounds" DROP COLUMN "name",
ADD COLUMN     "name_ar" TEXT NOT NULL,
ADD COLUMN     "name_en" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Countries" DROP COLUMN "name",
ADD COLUMN     "name_ar" TEXT NOT NULL,
ADD COLUMN     "name_en" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Governorates" DROP COLUMN "name",
ADD COLUMN     "name_ar" TEXT NOT NULL,
ADD COLUMN     "name_en" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubCategories" DROP COLUMN "name",
ADD COLUMN     "name_ar" TEXT NOT NULL,
ADD COLUMN     "name_en" TEXT NOT NULL;
