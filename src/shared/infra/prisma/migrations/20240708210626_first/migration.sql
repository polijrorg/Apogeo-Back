/*
  Warnings:

  - You are about to drop the column `cpf` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Users` table. All the data in the column will be lost.
  - Added the required column `language` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "cpf",
DROP COLUMN "phone",
ADD COLUMN     "language" TEXT NOT NULL;
