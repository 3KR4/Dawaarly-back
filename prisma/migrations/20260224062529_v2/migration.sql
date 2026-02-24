/*
  Warnings:

  - You are about to drop the column `categoriesId` on the `D_Vacation` table. All the data in the column will be lost.
  - You are about to drop the column `subCategoriesId` on the `D_Vacation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "D_Vacation" DROP CONSTRAINT "D_Vacation_categoriesId_fkey";

-- DropForeignKey
ALTER TABLE "D_Vacation" DROP CONSTRAINT "D_Vacation_subCategoriesId_fkey";

-- AlterTable
ALTER TABLE "D_Vacation" DROP COLUMN "categoriesId",
DROP COLUMN "subCategoriesId",
ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "subCategoryId" INTEGER;

-- AddForeignKey
ALTER TABLE "D_Vacation" ADD CONSTRAINT "D_Vacation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "D_Vacation" ADD CONSTRAINT "D_Vacation_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
