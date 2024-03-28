/*
  Warnings:

  - The primary key for the `guests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cittizenId` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `guestsId` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `guestsId` on the `servicecontract` table. All the data in the column will be lost.
  - Added the required column `guestId` to the `Guests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `homecontract` DROP FOREIGN KEY `HomeContract_guestId_fkey`;

-- DropForeignKey
ALTER TABLE `homecontract` DROP FOREIGN KEY `HomeContract_homeId_fkey`;

-- DropForeignKey
ALTER TABLE `homes` DROP FOREIGN KEY `Homes_homeOwnerId_fkey`;

-- DropForeignKey
ALTER TABLE `invoicespayment` DROP FOREIGN KEY `InvoicesPayment_homeContractId_fkey`;

-- DropForeignKey
ALTER TABLE `invoicespayment` DROP FOREIGN KEY `InvoicesPayment_homeId_fkey`;

-- DropForeignKey
ALTER TABLE `invoicespayment` DROP FOREIGN KEY `InvoicesPayment_receiverId_fkey`;

-- DropForeignKey
ALTER TABLE `invoicespayment` DROP FOREIGN KEY `InvoicesPayment_serviceContractId_fkey`;

-- DropForeignKey
ALTER TABLE `servicecontract` DROP FOREIGN KEY `ServiceContract_guestsId_fkey`;

-- DropForeignKey
ALTER TABLE `servicecontract` DROP FOREIGN KEY `ServiceContract_homeId_fkey`;

-- DropForeignKey
ALTER TABLE `servicecontract` DROP FOREIGN KEY `ServiceContract_serviceId_fkey`;

-- AlterTable
ALTER TABLE `guests` DROP PRIMARY KEY,
    DROP COLUMN `cittizenId`,
    DROP COLUMN `guestsId`,
    ADD COLUMN `citizenId` VARCHAR(191) NULL,
    ADD COLUMN `guestId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`guestId`);

-- AlterTable
ALTER TABLE `homecontract` MODIFY `homeContractsId` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `homeId` INTEGER NULL,
    MODIFY `guestId` INTEGER NULL;

-- AlterTable
ALTER TABLE `homeowners` MODIFY `homeOwnerId` INTEGER NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `homes` MODIFY `homeId` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `homeOwnerId` INTEGER NULL;

-- AlterTable
ALTER TABLE `invoicespayment` MODIFY `serviceInvoiceId` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `serviceContractId` INTEGER NULL,
    MODIFY `homeContractId` INTEGER NULL,
    MODIFY `homeId` INTEGER NULL,
    MODIFY `receiverId` INTEGER NULL;

-- AlterTable
ALTER TABLE `receiver` MODIFY `receiverId` INTEGER NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `service` MODIFY `serviceId` INTEGER NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `servicecontract` DROP COLUMN `guestsId`,
    ADD COLUMN `guestId` INTEGER NULL,
    MODIFY `serviceId` INTEGER NULL,
    MODIFY `homeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Homes` ADD CONSTRAINT `Homes_homeOwnerId_fkey` FOREIGN KEY (`homeOwnerId`) REFERENCES `Homeowners`(`homeOwnerId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeContract` ADD CONSTRAINT `HomeContract_homeId_fkey` FOREIGN KEY (`homeId`) REFERENCES `Homes`(`homeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeContract` ADD CONSTRAINT `HomeContract_guestId_fkey` FOREIGN KEY (`guestId`) REFERENCES `Guests`(`guestId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceContract` ADD CONSTRAINT `ServiceContract_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`serviceId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceContract` ADD CONSTRAINT `ServiceContract_homeId_fkey` FOREIGN KEY (`homeId`) REFERENCES `Homes`(`homeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceContract` ADD CONSTRAINT `ServiceContract_guestId_fkey` FOREIGN KEY (`guestId`) REFERENCES `Guests`(`guestId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoicesPayment` ADD CONSTRAINT `InvoicesPayment_serviceContractId_fkey` FOREIGN KEY (`serviceContractId`) REFERENCES `ServiceContract`(`serviceContractId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoicesPayment` ADD CONSTRAINT `InvoicesPayment_homeContractId_fkey` FOREIGN KEY (`homeContractId`) REFERENCES `HomeContract`(`homeContractsId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoicesPayment` ADD CONSTRAINT `InvoicesPayment_homeId_fkey` FOREIGN KEY (`homeId`) REFERENCES `Homes`(`homeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoicesPayment` ADD CONSTRAINT `InvoicesPayment_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `Receiver`(`receiverId`) ON DELETE SET NULL ON UPDATE CASCADE;
