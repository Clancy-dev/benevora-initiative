"use server";

import { prisma } from "@/lib/prisma";
import { bannerFormSchema } from "@/lib/validations/banner";

import { z } from "zod";



// Log banner activity
async function logActivity(userId: string, action: string, metadata?: any) {
  try {
    await prisma.activity.create({
      data: {
        userId,
        action: `BANNER_${action}`,
        metadata: metadata || {},
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

// Create banner
export async function createBanner(
  userId: string,
  data: z.infer<typeof bannerFormSchema>
) {
  try {
    const validated = bannerFormSchema.parse(data);

    const banner = await prisma.banner.create({
      data: {
        title: validated.title,
        description: validated.description,
        imageUrl: validated.imageUrl,
        order: validated.order,
      },
    });

    // Log activity
    await logActivity(userId, "CREATE", {
      bannerId: banner.id,
      title: banner.title,
    });

    return { success: true, data: banner };
  } catch (error) {
    console.error("Failed to create banner:", error);
    return { success: false, error: "Failed to create banner" };
  }
}

// Update banner
export async function updateBanner(
  userId: string,
  bannerId: string,
  data: z.infer<typeof bannerFormSchema>
) {
  try {
    const validated = bannerFormSchema.parse(data);

    const banner = await prisma.banner.update({
      where: { id: bannerId },
      data: {
        title: validated.title,
        description: validated.description,
        imageUrl: validated.imageUrl,
        order: validated.order,
      },
    });

    // Log activity
    await logActivity(userId, "UPDATE", {
      bannerId: banner.id,
      title: banner.title,
    });

    return { success: true, data: banner };
  } catch (error) {
    console.error("Failed to update banner:", error);
    return { success: false, error: "Failed to update banner" };
  }
}

// Get single banner (non-deleted)
export async function getBanner(bannerId: string) {
  try {
    const banner = await prisma.banner.findFirst({
      where: {
        id: bannerId,
        isDeleted: false,
      },
    });

    if (!banner) {
      return { success: false, error: "Banner not found" };
    }

    return { success: true, data: banner };
  } catch (error) {
    console.error("Failed to fetch banner:", error);
    return { success: false, error: "Failed to fetch banner" };
  }
}

// Get all banners (non-deleted)
export async function getAllBanners() {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        order: "asc",
      },
    });

    return { success: true, data: banners };
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return { success: false, error: "Failed to fetch banners" };
  }
}

// Get deleted banners (for trash page)
export async function getDeletedBanners() {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        isDeleted: true,
      },
      orderBy: {
        deletedAt: "desc",
      },
    });

    return { success: true, data: banners };
  } catch (error) {
    console.error("Failed to fetch deleted banners:", error);
    return { success: false, error: "Failed to fetch deleted banners" };
  }
}

// Soft delete banner
export async function deleteBanner(userId: string, bannerId: string) {
  try {
    const banner = await prisma.banner.update({
      where: { id: bannerId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    // Log activity
    await logActivity(userId, "DELETE", {
      bannerId: banner.id,
      title: banner.title,
    });

    return { success: true, data: banner };
  } catch (error) {
    console.error("Failed to delete banner:", error);
    return { success: false, error: "Failed to delete banner" };
  }
}

// Restore soft-deleted banner
export async function restoreBanner(userId: string, bannerId: string) {
  try {
    const banner = await prisma.banner.update({
      where: { id: bannerId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    // Log activity
    await logActivity(userId, "RESTORE", {
      bannerId: banner.id,
      title: banner.title,
    });

    return { success: true, data: banner };
  } catch (error) {
    console.error("Failed to restore banner:", error);
    return { success: false, error: "Failed to restore banner" };
  }
}

// Permanently delete banner from database
export async function permanentDeleteBanner(userId: string, bannerId: string) {
  try {
    const banner = await prisma.banner.delete({
      where: { id: bannerId },
    });

    // Log activity
    await logActivity(userId, "PERMANENT_DELETE", {
      bannerId: banner.id,
      title: banner.title,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to permanently delete banner:", error);
    return { success: false, error: "Failed to permanently delete banner" };
  }
}
