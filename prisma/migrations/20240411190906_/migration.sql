/*
  Warnings:

  - You are about to drop the column `datePayment` on the `homecontract` table. All the data in the column will be lost.
  - You are about to drop the column `statusPayment` on the `homecontract` table. All the data in the column will be lost.
  - Added the required column `dateEnd` to the `HomeContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateStart` to the `HomeContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deposit` to the `HomeContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `HomeContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateEnd` to the `ServiceContract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateStart` to the `ServiceContract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `homecontract` DROP COLUMN `datePayment`,
    DROP COLUMN `statusPayment`,
    ADD COLUMN `dateEnd` DATETIME(3) NOT NULL,
    ADD COLUMN `dateStart` DATETIME(3) NOT NULL,
    ADD COLUMN `deposit` DOUBLE NOT NULL,
    ADD COLUMN `status` ENUM('DRAFT', 'ACTIVE', 'FINISH') NOT NULL;

-- AlterTable
ALTER TABLE `servicecontract` ADD COLUMN `dateEnd` DATETIME(3) NOT NULL,
    ADD COLUMN `dateStart` DATETIME(3) NOT NULL,
    ALTER COLUMN `statusContract` DROP DEFAULT;
