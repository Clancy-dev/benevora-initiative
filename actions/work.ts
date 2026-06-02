'use server';

import { Work } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { workSchema } from '@/lib/validations/work';
import { z } from 'zod';

const CURRENT_USER_ID = 'user_placeholder_id';

type WorkData = z.infer<typeof workSchema>;

export async function getAllWorks() {
  try {
    const works = await prisma.work.findMany({
      where: { isDeleted: false },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return { success: true, data: works };
  } catch (error) {
    console.error('[v0] Error fetching works:', error);
    return { success: false, error: 'Failed to fetch works' };
  }
}

export async function getWork(id: string): Promise<{
  success: boolean;
  data: Work | null;
  error?: string;
}> {
  try {
    const work = await prisma.work.findUnique({
      where: { id },
    });

    if (!work) {
      return { success: false, error: 'Work not found', data: null };
    }

    return { success: true, data: work };
  } catch (error) {
    console.error('[v0] Error fetching work:', error);
    return { success: false, error: 'Failed to fetch work' , data: null};
  }
}

export async function createWork(data: WorkData) {
  try {
    const validated = workSchema.parse(data);

    const work = await prisma.work.create({
      data: {
        caption: validated.caption,
        image: validated.image,
        order: validated.order || 0,
      },
    });

    return { success: true, data: work };
  } catch (error) {
    console.error('[v0] Error creating work:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Failed to create work' };
  }
}

export async function updateWork(id: string, data: WorkData) {
  try {
    const validated = workSchema.parse(data);

    const work = await prisma.work.update({
      where: { id },
      data: {
        caption: validated.caption,
        image: validated.image,
        order: validated.order || 0,
      },
    });

    return { success: true, data: work };
  } catch (error) {
    console.error('[v0] Error updating work:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Failed to update work' };
  }
}

export async function deleteWork(id: string) {
  try {
    const work = await prisma.work.findUnique({
      where: { id },
    });

    if (!work) {
      return { success: false, error: 'Work not found' };
    }

    await prisma.work.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('[v0] Error deleting work:', error);
    return { success: false, error: 'Failed to delete work' };
  }
}

export async function getDeletedWorks() {
  try {
    const works = await prisma.work.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    });

    return { success: true, data: works };
  } catch (error) {
    console.error('[v0] Error fetching deleted works:', error);
    return { success: false, error: 'Failed to fetch deleted works' };
  }
}

export async function restoreWork(id: string) {
  try {
    const work = await prisma.work.findUnique({
      where: { id },
    });

    if (!work) {
      return { success: false, error: 'Work not found' };
    }

    await prisma.work.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });


    return { success: true };
  } catch (error) {
    console.error('[v0] Error restoring work:', error);
    return { success: false, error: 'Failed to restore work' };
  }
}

export async function permanentDeleteWork(id: string) {
  try {
    const work = await prisma.work.findUnique({
      where: { id },
    });

    if (!work) {
      return { success: false, error: 'Work not found' };
    }

    await prisma.work.delete({
      where: { id },
    });


    return { success: true };
  } catch (error) {
    console.error('[v0] Error permanently deleting work:', error);
    return { success: false, error: 'Failed to permanently delete work' };
  }
}
