-- CreateTable
CREATE TABLE `AccountAdmin` (
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Homeowners` (
    `homeOwnerId` INTEGER NOT NULL AUTO_INCREMENT,
    `fullname` VARCHAR(191) NOT NULL,
    `birthday` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `metaAccessToken` VARCHAR(191) NULL,
    `metaAccessTokenExpireDate` DATETIME(3) NULL,
    `citizenId` VARCHAR(191) NOT NULL,
    `citizen_ngaycap` DATETIME(3) NOT NULL,
    `citizen_noicap` VARCHAR(191) NOT NULL,
    `TenTK` VARCHAR(191) NOT NULL,
    `STK` VARCHAR(191) NOT NULL,
    `bank` VARCHAR(191) NOT NULL,
    `Note` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`homeOwnerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Homes` (
    `homeId` INTEGER NOT NULL AUTO_INCREMENT,
    `homeOwnerId` INTEGER NULL,
    `address` VARCHAR(191) NOT NULL,
    `Ward` VARCHAR(191) NOT NULL,
    `District` VARCHAR(191) NOT NULL,
    `Province` VARCHAR(191) NOT NULL,
    `apartmentNo` VARCHAR(191) NOT NULL,
    `building` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT false,
    `Note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`homeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Guests` (
    `guestId` INTEGER NOT NULL AUTO_INCREMENT,
    `fullname` VARCHAR(191) NOT NULL,
    `birthday` DATETIME(3) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `hometown` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `citizenId` VARCHAR(191) NOT NULL,
    `citizen_ngaycap` DATETIME(3) NOT NULL,
    `citizen_noicap` VARCHAR(191) NOT NULL,
    `Note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`guestId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomeContract` (
    `homeContractsId` INTEGER NOT NULL AUTO_INCREMENT,
    `homeId` INTEGER NULL,
    `guestId` INTEGER NULL,
    `dateStart` DATETIME(3) NOT NULL,
    `dateEnd` DATETIME(3) NOT NULL,
    `payCycle` INTEGER NOT NULL,
    `duration` INTEGER NOT NULL,
    `rental` DOUBLE NOT NULL,
    `deposit` DOUBLE NOT NULL,
    `status` ENUM('DRAFT', 'ACTIVE', 'FINISH') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`homeContractsId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceContract` (
    `serviceContractId` INTEGER NOT NULL AUTO_INCREMENT,
    `homeContractsId` INTEGER NOT NULL,
    `serviceId` INTEGER NULL,
    `homeId` INTEGER NULL,
    `guestId` INTEGER NULL,
    `signDate` DATETIME(3) NOT NULL,
    `payCycle` INTEGER NOT NULL,
    `duration` INTEGER NOT NULL,
    `dateStart` DATETIME(3) NOT NULL,
    `dateEnd` DATETIME(3) NOT NULL,
    `unitCost` DOUBLE NOT NULL,
    `limit` DOUBLE NULL,
    `statusContract` ENUM('DRAFT', 'ACTIVE', 'FINISH') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`serviceContractId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoicesPayment` (
    `invoiceId` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceContractId` INTEGER NULL,
    `homeContractId` INTEGER NULL,
    `homeId` INTEGER NULL,
    `type` ENUM('SERVICE', 'HOME') NOT NULL,
    `datePaymentRemind` DATETIME(3) NOT NULL,
    `datePaymentExpect` DATETIME(3) NOT NULL,
    `datePaymentReal` DATETIME(3) NOT NULL,
    `dateStart` DATETIME(3) NOT NULL,
    `dateEnd` DATETIME(3) NOT NULL,
    `totalSend` DOUBLE NOT NULL,
    `totalReceiver` DOUBLE NOT NULL,
    `statusPayment` BOOLEAN NOT NULL DEFAULT false,
    `receiverId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`invoiceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Receiver` (
    `receiverId` INTEGER NOT NULL AUTO_INCREMENT,
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
    `serviceId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,

    PRIMARY KEY (`serviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Homes` ADD CONSTRAINT `Homes_homeOwnerId_fkey` FOREIGN KEY (`homeOwnerId`) REFERENCES `Homeowners`(`homeOwnerId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeContract` ADD CONSTRAINT `HomeContract_homeId_fkey` FOREIGN KEY (`homeId`) REFERENCES `Homes`(`homeId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeContract` ADD CONSTRAINT `HomeContract_guestId_fkey` FOREIGN KEY (`guestId`) REFERENCES `Guests`(`guestId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ServiceContract` ADD CONSTRAINT `ServiceContract_homeContractsId_fkey` FOREIGN KEY (`homeContractsId`) REFERENCES `HomeContract`(`homeContractsId`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
