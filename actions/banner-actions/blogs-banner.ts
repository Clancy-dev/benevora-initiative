'use server'

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { blogsBannerSchema } from '@/lib/validations/blogs-banner'
import { getServerSession } from 'next-auth'
import { z } from 'zod'


// LOG ACTIVITY (same safe pattern as home banner)
async function logActivity(userId: string, action: string, metadata?: any) {
  try {
    await prisma.activity.create({
      data: {
        userId,
        action: `BLOGSBANNER_${action}`,
        metadata: metadata || {},
      },
    })
  } catch (error) {
    console.error('Failed to log activity:', error)
  }
}

// CREATE
export async function createBlogsBanner(
  data: z.infer<typeof blogsBannerSchema>
) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    const validated = blogsBannerSchema.parse(data)

    const banner = await prisma.blogsBanner.create({
      data: {
        title: validated.title,
        subtitle: validated.subtitle,
        image: validated.image,
      },
    })

    await logActivity(userId, 'CREATE', {
      bannerId: banner.id,
      title: banner.title,
    })

    return { success: true, data: banner }
  } catch (error) {
    console.error('Create blogs banner error:', error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation failed',
        issues: error.issues,
      }
    }

    return { success: false, error: 'Failed to create banner' }
  }
}

// UPDATE
export async function updateBlogsBanner(
  id: string,
  data: z.infer<typeof blogsBannerSchema>
) {
  try {
    const validated = blogsBannerSchema.parse(data)

    // Check if banner exists and is not deleted
    const existingBanner = await prisma.blogsBanner.findUnique({
      where: { id },
    })

    if (!existingBanner) {
      return { success: false, error: 'Banner not found' }
    }

    if (existingBanner.isDeleted) {
      return { success: false, error: 'Cannot update a deleted banner' }
    }

    // Update the banner
    const banner = await prisma.blogsBanner.update({
      where: { id },
      data: {
        title: validated.title,
        subtitle: validated.subtitle,
        image: validated.image,
      },
    })

    return { success: true, data: banner }
  } catch (error) {
    console.error('[v0] Update blogs banner error:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Validation failed', issues: error.issues }
    }
    return { success: false, error: 'Failed to update banner' }
  }
}

// GET ALL
export async function getAllBlogsBanners() {
  try {
    const banners = await prisma.blogsBanner.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, data: banners }
  } catch (error) {
    console.error('Get all blogs banners error:', error)
    return { success: false, error: 'Failed to fetch banners' }
  }
}

// GET ONE
export async function getBlogsBanner(id: string) {
  try {
    const banner = await prisma.blogsBanner.findFirst({
      where: { id, isDeleted: false },
    })

    if (!banner) {
      return { success: false, error: 'Banner not found' }
    }

    return { success: true, data: banner }
  } catch (error) {
    console.error('Get blogs banner error:', error)
    return { success: false, error: 'Failed to fetch banner' }
  }
}

// SOFT DELETE
export async function deleteBlogsBanner(id: string) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    const existing = await prisma.blogsBanner.findUnique({
      where: { id },
    })

    if (!existing || existing.isDeleted) {
      return { success: false, error: 'Banner not found' }
    }

    const banner = await prisma.blogsBanner.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    await logActivity(userId, 'DELETE', {
      bannerId: banner.id,
      title: banner.title,
    })

    return { success: true, data: banner }
  } catch (error) {
    console.error('Delete blogs banner error:', error)
    return { success: false, error: 'Failed to delete banner' }
  }
}

// RESTORE
export async function restoreBlogsBanner(id: string) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    const existing = await prisma.blogsBanner.findUnique({
      where: { id },
    })

    if (!existing || !existing.isDeleted) {
      return { success: false, error: 'Banner not found' }
    }

    const banner = await prisma.blogsBanner.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    await logActivity(userId, 'RESTORE', {
      bannerId: banner.id,
      title: banner.title,
    })

    return { success: true, data: banner }
  } catch (error) {
    console.error('Restore blogs banner error:', error)
    return { success: false, error: 'Failed to restore banner' }
  }
}

export async function getDeletedBlogsBanners() {
  try {
    const banners = await prisma.blogsBanner.findMany({
      where: {
        isDeleted: true,
      },
      orderBy: {
        deletedAt: 'desc',
      },
    })

    return {
      success: true,
      data: banners,
    }
  } catch (error) {
    console.error('Get deleted blogs banners error:', error)
    return {
      success: false,
      error: 'Failed to fetch deleted banners',
    }
  }
}

// PERMANENT DELETE
export async function permanentDeleteBlogsBanner(id: string) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    if (!userId) {
      return { success: false, error: 'Unauthorized' }
    }

    const existing = await prisma.blogsBanner.findUnique({
      where: { id },
    })

    if (!existing) {
      return { success: false, error: 'Banner not found' }
    }

    await prisma.blogsBanner.delete({
      where: { id },
    })

    await logActivity(userId, 'PERMANENT_DELETE', {
      bannerId: id,
      title: existing.title,
    })

    return { success: true }
  } catch (error) {
    console.error('Permanent delete blogs banner error:', error)
    return { success: false, error: 'Failed to delete banner' }
  }
}