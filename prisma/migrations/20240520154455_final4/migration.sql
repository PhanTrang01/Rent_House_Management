/*
  Warnings:

  - You are about to drop the column `homeContractHomeContractsId` on the `servicecontract` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `servicecontract` DROP FOREIGN KEY `ServiceContract_homeContractHomeContractsId_fkey`;

-- AlterTable
ALTER TABLE `servicecontract` DROP COLUMN `homeContractHomeContractsId`;

-- AddForeignKey
ALTER TABLE `ServiceContract` ADD CONSTRAINT `ServiceContract_homeContractsId_fkey` FOREIGN KEY (`homeContractsId`) REFERENCES `HomeContract`(`homeContractsId`) ON DELETE RESTRICT ON UPDATE CASCADE;
