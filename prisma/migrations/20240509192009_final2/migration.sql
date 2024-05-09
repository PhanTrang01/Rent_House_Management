/*
  Warnings:

  - You are about to drop the column `name` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `homeowners` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `homeowners` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `homeowners` table. All the data in the column will be lost.
  - You are about to drop the column `fullname` on the `homes` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `invoicespayment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - You are about to alter the column `statusContract` on the `servicecontract` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Enum(EnumId(1))`.
  - Added the required column `birthday` to the `Guests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cittizen_ngaycap` to the `Guests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cittizen_noicap` to the `Guests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Guests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `STK` to the `Homeowners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TenTK` to the `Homeowners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bank` to the `Homeowners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthday` to the `Homeowners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cittizen_ngaycap` to the `Homeowners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cittizen_noicap` to the `Homeowners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Homeowners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `District` to the `Homes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Province` to the `Homes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Ward` to the `Homes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apartmentNo` to the `Homes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `guests` DROP COLUMN `name`,
    ADD COLUMN `Note` VARCHAR(191) NULL,
    ADD COLUMN `birthday` DATETIME(3) NOT NULL,
    ADD COLUMN `cittizen_ngaycap` DATETIME(3) NOT NULL,
    ADD COLUMN `cittizen_noicap` VARCHAR(191) NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `homeowners` DROP COLUMN `name`,
    DROP COLUMN `password`,
    DROP COLUMN `username`,
    ADD COLUMN `Note` VARCHAR(191) NULL,
    ADD COLUMN `STK` VARCHAR(191) NOT NULL,
    ADD COLUMN `TenTK` VARCHAR(191) NOT NULL,
    ADD COLUMN `bank` VARCHAR(191) NOT NULL,
    ADD COLUMN `birthday` DATETIME(3) NOT NULL,
    ADD COLUMN `cittizen_ngaycap` DATETIME(3) NOT NULL,
    ADD COLUMN `cittizen_noicap` VARCHAR(191) NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `homes` DROP COLUMN `fullname`,
    ADD COLUMN `District` VARCHAR(191) NOT NULL,
    ADD COLUMN `Note` VARCHAR(191) NULL,
    ADD COLUMN `Province` VARCHAR(191) NOT NULL,
    ADD COLUMN `Ward` VARCHAR(191) NOT NULL,
    ADD COLUMN `apartmentNo` VARCHAR(191) NOT NULL,
    ADD COLUMN `building` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `invoicespayment` MODIFY `type` ENUM('SERVICE', 'EVN') NOT NULL,
    MODIFY `limit` DOUBLE NULL;

-- AlterTable
ALTER TABLE `servicecontract` MODIFY `statusContract` ENUM('DRAFT', 'ACTIVE', 'FINISH') NOT NULL;
