-- AddForeignKey
ALTER TABLE `ServiceContract` ADD CONSTRAINT `ServiceContract_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`serviceId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoicesPayment` ADD CONSTRAINT `InvoicesPayment_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `Receiver`(`receiverId`) ON DELETE RESTRICT ON UPDATE CASCADE;
