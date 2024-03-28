/*
  Warnings:

  - The primary key for the `guests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `citizenId` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `guestId` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `citizenId` on the `homeowners` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `homeowners` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `homes` table. All the data in the column will be lost.
  - You are about to drop the `_homeownerstohomes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `homecontracts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `homeinvoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `servicecontracts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `guestsId` to the `Guests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Guests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Homeowners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Homeowners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Homeowners` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_homeownerstohomes` DROP FOREIGN KEY `_HomeownersToHomes_A_fkey`;

-- DropForeignKey
ALTER TABLE `_homeownerstohomes` DROP FOREIGN KEY `_HomeownersToHomes_B_fkey`;

-- DropForeignKey
ALTER TABLE `homecontracts` DROP FOREIGN KEY `HomeContracts_guestsId_fkey`;

-- DropForeignKey
ALTER TABLE `homecontracts` DROP FOREIGN KEY `HomeContracts_homeId_fkey`;

-- DropForeignKey
ALTER TABLE `homeinvoice` DROP FOREIGN KEY `HomeInvoices_guestsId_fkey`;

-- DropForeignKey
ALTER TABLE `homeinvoice` DROP FOREIGN KEY `HomeInvoices_homeId_fkey`;

-- DropForeignKey
ALTER TABLE `homeinvoice` DROP FOREIGN KEY `homeInvoice_homeContractsHomeContractsId_fkey`;

-- DropForeignKey
ALTER TABLE `servicecontracts` DROP FOREIGN KEY `ServiceContracts_guestsId_fkey`;

-- DropForeignKey
ALTER TABLE `servicecontracts` DROP FOREIGN KEY `ServiceContracts_homeId_fkey`;

-- AlterTable
ALTER TABLE `guests` DROP PRIMARY KEY,
    DROP COLUMN `citizenId`,
    DROP COLUMN `guestId`,
    ADD COLUMN `cittizenId` VARCHAR(191) NULL,
    ADD COLUMN `guestsId` INTEGER NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    MODIFY `fullname` VARCHAR(191) NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD PRIMARY KEY (`guestsId`);

-- AlterTable
ALTER TABLE `homeowners` DROP COLUMN `citizenId`,
    DROP COLUMN `fullName`,
    ADD COLUMN `cittizenId` VARCHAR(191) NULL,
    ADD COLUMN `fullname` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL,
    MODIFY `homeOwnerId` INTEGER NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `homes` DROP COLUMN `fullName`,
    ADD COLUMN `fullname` VARCHAR(191) NULL,
    MODIFY `homeId` INTEGER NOT NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `_homeownerstohomes`;

-- DropTable
DROP TABLE `homecontracts`;

-- DropTable
DROP TABLE `homeinvoice`;

-- DropTable
DROP TABLE `servicecontracts`;

-- CreateTable
CREATE TABLE `AccountAdmin` (
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomeContract` (
    `homeContractsId` INTEGER NOT NULL,
    `homeId` INTEGER NOT NULL,
    `guestId` INTEGER NOT NULL,
    `datePayment` DATETIME(3) NOT NULL,
    `total` DOUBLE NULL,
    `statusPayment` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`homeContractsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceContract` (
    `serviceContractId` INTEGER NOT NULL,
    `serviceId` INTEGER NOT NULL,
    `homeId` INTEGER NOT NULL,
    `guestsId` INTEGER NOT NULL,
    `signDate` DATETIME(3) NULL,
    `payCycle` INTEGER NOT NULL,
    `duration` INTEGER NOT NULL,
    `unitCost` DOUBLE NOT NULL,
    `statusContract` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`serviceContractId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoicesPayment` (
    `serviceInvoiceId` INTEGER NOT NULL,
    `serviceContractId` INTEGER NOT NULL,
    `homeContractId` INTEGER NOT NULL,
    `homeId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `datePaymentRemind` DATETIME(3) NOT NULL,
    `datePaymentExpect` DATETIME(3) NOT NULL,
    `datePaymentReal` DATETIME(3) NOT NULL,
    `dateStart` DATETIME(3) NOT NULL,
    `dateEnd` DATETIME(3) NOT NULL,
    `total` DOUBLE NULL,
    `limit` DOUBLE NULL,
    `statusPayment` BOOLEAN NOT NULL DEFAULT false,
    `receiverId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`serviceInvoiceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Receiver` (
    `receiverId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `taxcode` VARCHAR(191) NULL,
    `TenTK` VARCHAR(191) NULL,
    `STK` VARCHAR(191) NULL,
    `Nganhang` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `note` VARCHAR(191) NULL,

    PRIMARY KEY (`receiverId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `serviceId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`serviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Homes` ADD CONSTRAINT `Homes_homeOwnerId_fkey` FOREIGN KEY (`homeOwnerId`) REFERENCES `Homeowners`(`homeOwnerId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeContract` ADD CONSTRAINT `HomeContract_homeId_fkey` FOREIGN KEY (`homeId`) REFERENCES `Homes`(`homeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeContract` ADD CONSTRAINT `HomeContract_guestId_fkey` FOREIGN KEY (`guestId`) REFERENCES `Guests`(`guestsId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceContract` ADD CONSTRAINT `ServiceContract_homeId_fkey` FOREIGN KEY (`homeId`) REFERENCES `Homes`(`homeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceContract` ADD CONSTRAINT `ServiceContract_guestsId_fkey` FOREIGN KEY (`guestsId`) REFERENCES `Guests`(`guestsId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoicesPayment` ADD CONSTRAINT `InvoicesPayment_serviceContractId_fkey` FOREIGN KEY (`serviceContractId`) REFERENCES `ServiceContract`(`serviceContractId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoicesPayment` ADD CONSTRAINT `InvoicesPayment_homeContractId_fkey` FOREIGN KEY (`homeContractId`) REFERENCES `HomeContract`(`homeContractsId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoicesPayment` ADD CONSTRAINT `InvoicesPayment_homeId_fkey` FOREIGN KEY (`homeId`) REFERENCES `Homes`(`homeId`) ON DELETE RESTRICT ON UPDATE CASCADE;
