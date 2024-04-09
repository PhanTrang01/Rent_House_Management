/*
  Warnings:

  - Made the column `phone` on table `guests` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fullname` on table `guests` required. This step will fail if there are existing NULL values in that column.
  - Made the column `citizenId` on table `guests` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `homeowners` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cittizenId` on table `homeowners` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fullname` on table `homeowners` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `guests` MODIFY `phone` VARCHAR(191) NOT NULL,
    MODIFY `fullname` VARCHAR(191) NOT NULL,
    MODIFY `citizenId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `homeowners` MODIFY `phone` VARCHAR(191) NOT NULL,
    MODIFY `cittizenId` VARCHAR(191) NOT NULL,
    MODIFY `fullname` VARCHAR(191) NOT NULL;
