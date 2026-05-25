-- CreateEnum
CREATE TYPE "BannerSection" AS ENUM ('HOME', 'ABOUT', 'EVENTS', 'BLOGS', 'MEMBERSHIP', 'CONTACT', 'DONATE');

-- CreateEnum
CREATE TYPE "BannerType" AS ENUM ('HERO', 'MINI_HERO');

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "section" "BannerSection" NOT NULL,
    "type" "BannerType" NOT NULL DEFAULT 'HERO',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "cloudinaryPublicId" TEXT,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Banner_section_idx" ON "Banner"("section");

-- CreateIndex
CREATE INDEX "Banner_section_type_idx" ON "Banner"("section", "type");
