'use server';

import { prisma } from '@/lib/prisma';
import { xSchema } from '@/lib/validations/x';
import { revalidatePath } from 'next/cache';

export async function createX(data: any) {
  try {
    const validated = xSchema.parse(data);

    const x = await prisma.x.create({
      data: {
        ...validated,
      },
    });

    revalidatePath('/dashboard/social-media/x');

    return { success: true, data: x };
  } catch (error: any) {
    console.error('[v0] Create X failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to create X link',
    };
  }
}

export async function updateX(id: string, data: any) {
  try {
    const validated = xSchema.parse(data);

    const x = await prisma.x.update({
      where: { id },
      data: {
        ...validated,
      },
    });

    revalidatePath('/dashboard/social-media/x');

    return { success: true, data: x };
  } catch (error: any) {
    console.error('[v0] Update X failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to update X link',
    };
  }
}

export async function getXLink(id: string) {
  try {
    const x = await prisma.x.findUnique({
      where: { id, isDeleted: false },
    });

    if (!x) {
      return { success: false, error: 'X link not found' };
    }

    return { success: true, data: x };
  } catch (error: any) {
    console.error('[v0] Get X link failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get X link',
    };
  }
}

export async function getAllXLinks() {
  try {
    const xLinks = await prisma.x.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: xLinks };
  } catch (error: any) {
    console.error('[v0] Get all X links failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get X links',
    };
  }
}

export async function deleteX(id: string) {
  try {
    const x = await prisma.x.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    revalidatePath('/dashboard/social-media/x');

    return { success: true, data: x };
  } catch (error: any) {
    console.error('[v0] Delete X failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete X link',
    };
  }
}

export async function getDeletedXLinks() {
  try {
    const xLinks = await prisma.x.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    });

    return { success: true, data: xLinks };
  } catch (error: any) {
    console.error('[v0] Get deleted X links failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get deleted X links',
    };
  }
}

export async function restoreX(id: string) {
  try {
    const x = await prisma.x.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    revalidatePath('/dashboard/social-media/x');

    return { success: true, data: x };
  } catch (error: any) {
    console.error('[v0] Restore X failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to restore X link',
    };
  }
}

export async function permanentlyDeleteX(id: string) {
  try {
    const x = await prisma.x.delete({
      where: { id },
    });

    revalidatePath('/dashboard/social-media/x');

    return { success: true };
  } catch (error: any) {
    console.error('[v0] Permanent delete X failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to permanently delete X link',
    };
  }
}
