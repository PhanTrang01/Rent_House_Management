/*
  Warnings:

  - Added the required column `homeContractHomeContractsId` to the `ServiceContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `homeContractsId` to the `ServiceContract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `servicecontract` ADD COLUMN `homeContractHomeContractsId` INTEGER NOT NULL,
    ADD COLUMN `homeContractsId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ServiceContract` ADD CONSTRAINT `ServiceContract_homeContractHomeContractsId_fkey` FOREIGN KEY (`homeContractHomeContractsId`) REFERENCES `HomeContract`(`homeContractsId`) ON DELETE RESTRICT ON UPDATE CASCADE;
