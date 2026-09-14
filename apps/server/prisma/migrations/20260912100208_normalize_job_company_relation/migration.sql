/*
  Warnings:

  - You are about to drop the column `company_logo_url` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `company_name` on the `jobs` table. All the data in the column will be lost.
  - Made the column `company_id` on table `jobs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "company_logo_url",
DROP COLUMN "company_name",
ALTER COLUMN "company_id" SET NOT NULL;
