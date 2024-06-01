/*
  Warnings:

  - The primary key for the `invoicespayment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `limit` on the `invoicespayment` table. All the data in the column will be lost.
  - You are about to drop the column `serviceContractId` on the `invoicespayment` table. All the data in the column will be lost.
  - You are about to drop the column `serviceInvoiceId` on the `invoicespayment` table. All the data in the column will be lost.
  - The values [EVN] on the enum `InvoicesPayment_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `invoiceId` to the `InvoicesPayment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `invoicespayment` DROP FOREIGN KEY `InvoicesPayment_serviceContractId_fkey`;

-- AlterTable
ALTER TABLE `invoicespayment` DROP PRIMARY KEY,
    DROP COLUMN `limit`,
    DROP COLUMN `serviceContractId`,
    DROP COLUMN `serviceInvoiceId`,
    ADD COLUMN `invoiceId` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `type` ENUM('SERVICE', 'HOME') NOT NULL,
    ADD PRIMARY KEY (`invoiceId`);

-- AlterTable
ALTER TABLE `servicecontract` ADD COLUMN `limit` DOUBLE NULL,
    MODIFY `serviceContractId` INTEGER NOT NULL AUTO_INCREMENT;
