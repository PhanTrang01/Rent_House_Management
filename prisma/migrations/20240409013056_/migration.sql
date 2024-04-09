/*
  Warnings:

  - Added the required column `duration` to the `HomeContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payCycle` to the `HomeContract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `homecontract` ADD COLUMN `duration` INTEGER NOT NULL,
    ADD COLUMN `payCycle` INTEGER NOT NULL;
