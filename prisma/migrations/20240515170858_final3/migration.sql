/*
  Warnings:

  - You are about to drop the column `cittizen_ngaycap` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `cittizen_noicap` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `cittizenId` on the `homeowners` table. All the data in the column will be lost.
  - You are about to drop the column `cittizen_ngaycap` on the `homeowners` table. All the data in the column will be lost.
  - You are about to drop the column `cittizen_noicap` on the `homeowners` table. All the data in the column will be lost.
  - Added the required column `citizen_ngaycap` to the `Guests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `citizen_noicap` to the `Guests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hometown` to the `Guests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `citizenId` to the `Homeowners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `citizen_ngaycap` to the `Homeowners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `citizen_noicap` to the `Homeowners` table without a default value. This is not possible if the table is not empty.
  - Made the column `signDate` on table `servicecontract` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `guests` DROP COLUMN `cittizen_ngaycap`,
    DROP COLUMN `cittizen_noicap`,
    ADD COLUMN `citizen_ngaycap` DATETIME(3) NOT NULL,
    ADD COLUMN `citizen_noicap` VARCHAR(191) NOT NULL,
    ADD COLUMN `hometown` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `homeowners` DROP COLUMN `cittizenId`,
    DROP COLUMN `cittizen_ngaycap`,
    DROP COLUMN `cittizen_noicap`,
    ADD COLUMN `citizenId` VARCHAR(191) NOT NULL,
    ADD COLUMN `citizen_ngaycap` DATETIME(3) NOT NULL,
    ADD COLUMN `citizen_noicap` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `servicecontract` MODIFY `signDate` DATETIME(3) NOT NULL;
