-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "reset_password_code" TEXT,
ADD COLUMN     "reset_password_expiry" TIMESTAMP(3);
