/*
  Warnings:

  - The values [SOLD,BOOKED] on the enum `AdStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdStatus_new" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'DISABLED');
ALTER TABLE "D_Vacation" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "D_Vacation" ALTER COLUMN "status" TYPE "AdStatus_new" USING ("status"::text::"AdStatus_new");
ALTER TYPE "AdStatus" RENAME TO "AdStatus_old";
ALTER TYPE "AdStatus_new" RENAME TO "AdStatus";
DROP TYPE "AdStatus_old";
ALTER TABLE "D_Vacation" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
