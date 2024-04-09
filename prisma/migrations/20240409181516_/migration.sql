/*
  Warnings:

  - You are about to drop the column `total` on the `homecontract` table. All the data in the column will be lost.
  - Added the required column `rental` to the `HomeContract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `homecontract` DROP COLUMN `total`,
    ADD COLUMN `rental` DOUBLE NOT NULL;
