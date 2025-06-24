/*
  Warnings:

  - You are about to drop the column `passwordResetTokeExpires` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `passwordResetTokeExpires`,
    ADD COLUMN `passwordResetTokenExpires` DATETIME(3) NULL;
