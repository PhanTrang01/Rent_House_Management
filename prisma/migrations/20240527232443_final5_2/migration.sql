-- AlterTable
ALTER TABLE `invoicespayment` ADD COLUMN `serviceContractId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `InvoicesPayment` ADD CONSTRAINT `InvoicesPayment_serviceContractId_fkey` FOREIGN KEY (`serviceContractId`) REFERENCES `ServiceContract`(`serviceContractId`) ON DELETE SET NULL ON UPDATE CASCADE;
