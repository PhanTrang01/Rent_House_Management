/*
  Warnings:

  - The primary key for the `guests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cittizenId` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `guestsId` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `datePayment` on the `homecontracts` table. All the data in the column will be lost.
  - You are about to drop the column `guestsId` on the `homecontracts` table. All the data in the column will be lost.
  - You are about to drop the column `statusPayment` on the `homecontracts` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `homecontracts` table. All the data in the column will be lost.
  - You are about to drop the column `cittizenId` on the `homeowners` table. All the data in the column will be lost.
  - You are about to drop the column `fullname` on the `homeowners` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `homeowners` table. All the data in the column will be lost.
  - You are about to drop the column `fullname` on the `homes` table. All the data in the column will be lost.
  - You are about to drop the column `guestsId` on the `servicecontracts` table. All the data in the column will be lost.
  - Added the required column `guestId` to the `guests` table without a default value. This is not possible if the table is not empty.
  - Made the column `fullname` on table `guests` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `cyclePayment` to the `homeContracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateRent` to the `homeContracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestId` to the `homeContracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `homeowners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestId` to the `serviceContracts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `homecontracts` DROP FOREIGN KEY `HomeContracts_guestsId_fkey`;

-- DropForeignKey
ALTER TABLE `servicecontracts` DROP FOREIGN KEY `ServiceContracts_guestsId_fkey`;

-- AlterTable
ALTER TABLE `guests` DROP PRIMARY KEY,
    DROP COLUMN `cittizenId`,
    DROP COLUMN `guestsId`,
    DROP COLUMN `name`,
    ADD COLUMN `citizenId` VARCHAR(191) NULL,
    ADD COLUMN `guestId` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `fullname` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`guestId`);

-- AlterTable
ALTER TABLE `homecontracts` DROP COLUMN `datePayment`,
    DROP COLUMN `guestsId`,
    DROP COLUMN `statusPayment`,
    DROP COLUMN `total`,
    ADD COLUMN `cyclePayment` INTEGER NOT NULL,
    ADD COLUMN `dateRent` DATETIME(3) NOT NULL,
    ADD COLUMN `guestId` INTEGER NOT NULL,
    ADD COLUMN `rental` DOUBLE NULL;

-- AlterTable
ALTER TABLE `homeowners` DROP COLUMN `cittizenId`,
    DROP COLUMN `fullname`,
    DROP COLUMN `name`,
    ADD COLUMN `citizenId` VARCHAR(191) NULL,
    ADD COLUMN `fullName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `homes` DROP COLUMN `fullname`,
    ADD COLUMN `fullName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `servicecontracts` DROP COLUMN `guestsId`,
    ADD COLUMN `guestId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `homeInvoice` (
    `homeInvoiceId` INTEGER NOT NULL AUTO_INCREMENT,
    `homeId` INTEGER NOT NULL,
    `guestId` INTEGER NOT NULL,
    `datePayment` DATETIME(3) NOT NULL,
    `totalPayment` DOUBLE NULL,
    `cyclePayment` INTEGER NOT NULL,
    `statusPayment` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `homeContractsHomeContractsId` INTEGER NULL,

    INDEX `HomeInvoices_guestsId_fkey`(`guestId`),
    INDEX `HomeInvoices_homeId_fkey`(`homeId`),
    PRIMARY KEY (`homeInvoiceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `HomeContracts_guestId_fkey` ON `homeContracts`(`guestId`);

-- CreateIndex
CREATE INDEX `ServiceContracts_guestsId_fkey` ON `serviceContracts`(`guestId`);

-- AddForeignKey
ALTER TABLE `homeContracts` ADD CONSTRAINT `HomeContracts_guestsId_fkey` FOREIGN KEY (`guestId`) REFERENCES `guests`(`guestId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `homeInvoice` ADD CONSTRAINT `HomeInvoices_guestsId_fkey` FOREIGN KEY (`guestId`) REFERENCES `guests`(`guestId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `homeInvoice` ADD CONSTRAINT `HomeInvoices_homeId_fkey` FOREIGN KEY (`homeId`) REFERENCES `homes`(`homeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `homeInvoice` ADD CONSTRAINT `homeInvoice_homeContractsHomeContractsId_fkey` FOREIGN KEY (`homeContractsHomeContractsId`) REFERENCES `homeContracts`(`homeContractsId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serviceContracts` ADD CONSTRAINT `ServiceContracts_guestsId_fkey` FOREIGN KEY (`guestId`) REFERENCES `guests`(`guestId`) ON DELETE RESTRICT ON UPDATE CASCADE;
