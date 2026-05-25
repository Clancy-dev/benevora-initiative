/*
  Warnings:

  - You are about to drop the column `section` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Banner` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Banner_section_idx";

-- DropIndex
DROP INDEX "Banner_section_type_idx";

-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "section",
DROP COLUMN "type",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "order" INTEGER;

-- DropEnum
DROP TYPE "BannerSection";

-- DropEnum
DROP TYPE "BannerType";
