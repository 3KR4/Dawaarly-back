/*
  Warnings:

  - You are about to drop the column `category` on the `D_Vacation` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory` on the `D_Vacation` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory_star` on the `D_Vacation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "D_Vacation" DROP COLUMN "category",
DROP COLUMN "subcategory",
DROP COLUMN "subcategory_star";

-- AddForeignKey
ALTER TABLE "D_Vacation" ADD CONSTRAINT "D_Vacation_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "D_Vacation" ADD CONSTRAINT "D_Vacation_subuser_id_fkey" FOREIGN KEY ("subuser_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "D_Vacation" ADD CONSTRAINT "D_Vacation_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "Countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "D_Vacation" ADD CONSTRAINT "D_Vacation_governorate_id_fkey" FOREIGN KEY ("governorate_id") REFERENCES "Governorates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "D_Vacation" ADD CONSTRAINT "D_Vacation_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "Cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "D_Vacation" ADD CONSTRAINT "D_Vacation_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "D_Vacation" ADD CONSTRAINT "D_Vacation_compound_id_fkey" FOREIGN KEY ("compound_id") REFERENCES "Compounds"("id") ON DELETE SET NULL ON UPDATE CASCADE;
