/*
  Warnings:

  - You are about to drop the `post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_ibfk_1`;

-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `Profile_ibfk_1`;

-- DropTable
DROP TABLE `post`;

-- DropTable
DROP TABLE `profile`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `Homeowners` (
    `homeOwnerId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `metaAccessToken` VARCHAR(191) NULL,
    `metaAccessTokenExpireDate` DATETIME(3) NULL,
    `fullname` VARCHAR(191) NULL,
    `cittizenId` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`homeOwnerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Homes` (
    `homeId` INTEGER NOT NULL AUTO_INCREMENT,
    `homeOwnerId` INTEGER NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`homeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guests` (
    `guestsId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `fullname` VARCHAR(191) NULL,
    `cittizenId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`guestsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomeContracts` (
    `homeContractsId` INTEGER NOT NULL AUTO_INCREMENT,
    `homeId` INTEGER NOT NULL,
    `guestsId` INTEGER NOT NULL,
    `datePayment` DATETIME(3) NOT NULL,
    `total` DOUBLE NULL,
    `statusPayment` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`homeContractsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceContracts` (
    `serviceContractsId` INTEGER NOT NULL AUTO_INCREMENT,
    `homeId` INTEGER NOT NULL,
    `guestsId` INTEGER NOT NULL,
    `signDate` DATETIME(3) NULL,
    `payCycle` INTEGER NOT NULL,
    `duration` INTEGER NOT NULL,
    `unitCost` DOUBLE NOT NULL,
    `statusPayment` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`serviceContractsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_HomeownersToHomes` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_HomeownersToHomes_AB_unique`(`A`, `B`),
    INDEX `_HomeownersToHomes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HomeContracts` ADD CONSTRAINT `HomeContracts_homeId_fkey` FOREIGN KEY (`homeId`) REFERENCES `Homes`(`homeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeContracts` ADD CONSTRAINT `HomeContracts_guestsId_fkey` FOREIGN KEY (`guestsId`) REFERENCES `Guests`(`guestsId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceContracts` ADD CONSTRAINT `ServiceContracts_homeId_fkey` FOREIGN KEY (`homeId`) REFERENCES `Homes`(`homeId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceContracts` ADD CONSTRAINT `ServiceContracts_guestsId_fkey` FOREIGN KEY (`guestsId`) REFERENCES `Guests`(`guestsId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_HomeownersToHomes` ADD CONSTRAINT `_HomeownersToHomes_A_fkey` FOREIGN KEY (`A`) REFERENCES `Homeowners`(`homeOwnerId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_HomeownersToHomes` ADD CONSTRAINT `_HomeownersToHomes_B_fkey` FOREIGN KEY (`B`) REFERENCES `Homes`(`homeId`) ON DELETE CASCADE ON UPDATE CASCADE;
