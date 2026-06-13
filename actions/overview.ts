'use server';

import { prisma } from '@/lib/prisma';

export async function getOverviewData() {
  try {
    // Fetch counts for statistics
    const totalBlogs = await prisma.blog.count({
      where: { isDeleted: false },
    });

    const totalEvents = await prisma.event.count({
      where: { isDeleted: false },
    });

    const workInAction = await prisma.work.count({
      where: { isDeleted: false },
    });

    // Fetch recent blogs (limit 5)
    const recentBlogs = await prisma.blog.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        category: true,
        image: true,
        createdAt: true,
      },
    });

    // Fetch recent events (limit 5)
    const recentEvents = await prisma.event.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        createdAt: true,
      },
    });

    return {
      success: true,
      data: {
        totalBlogs,
        totalEvents,
        workInAction,
        recentBlogs,
        recentEvents,
      },
    };
  } catch (error) {
    console.error('[v0] Error fetching overview data:', error);
    return {
      success: false,
      error: 'Failed to fetch overview data',
    };
  }
}
