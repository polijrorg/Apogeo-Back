/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Users_name_key";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "pin" TEXT,
ADD COLUMN     "pinExpires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
