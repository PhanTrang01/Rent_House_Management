/*
  Warnings:

  - Added the required column `duration` to the `homeContracts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `homecontracts` ADD COLUMN `duration` INTEGER NOT NULL;
