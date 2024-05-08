/*
  Warnings:

  - You are about to drop the column `total` on the `invoicespayment` table. All the data in the column will be lost.
  - Added the required column `totalReceiver` to the `InvoicesPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSend` to the `InvoicesPayment` table without a default value. This is not possible if the table is not empty.
  - Made the column `limit` on table `invoicespayment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `invoicespayment` DROP COLUMN `total`,
    ADD COLUMN `totalReceiver` DOUBLE NOT NULL,
    ADD COLUMN `totalSend` DOUBLE NOT NULL,
    MODIFY `limit` DOUBLE NOT NULL;
