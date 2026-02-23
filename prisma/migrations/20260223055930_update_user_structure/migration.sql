/*
  Warnings:

  - You are about to drop the column `username` on the `SubUser` table. All the data in the column will be lost.
  - Added the required column `full_name` to the `SubUser` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `SubUser` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `SubUser` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "SubUser_username_key";

-- AlterTable
ALTER TABLE "SubUser" DROP COLUMN "username",
ADD COLUMN     "admin_comment" TEXT,
ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "facebook_link" TEXT,
ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "tiktok_link" TEXT,
ADD COLUMN     "verification_code" TEXT,
ADD COLUMN     "verification_expiry" TIMESTAMP(3),
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "user_type" SET DEFAULT 'user';
