'use server';

import { prisma } from '@/lib/prisma';
import { instagramSchema } from '@/lib/validations/instagram';
import { revalidatePath } from 'next/cache';

export async function createInstagram(data: any) {
  try {
    const validated = instagramSchema.parse(data);

    const instagram = await prisma.instagram.create({
      data: {
        ...validated,
      },
    });

    revalidatePath('/dashboard/social-media/instagram');

    return { success: true, data: instagram };
  } catch (error: any) {
    console.error('[v0] Create Instagram failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to create Instagram link',
    };
  }
}

export async function updateInstagram(id: string, data: any) {
  try {
    const validated = instagramSchema.parse(data);

    const instagram = await prisma.instagram.update({
      where: { id },
      data: {
        ...validated,
      },
    });

    revalidatePath('/dashboard/social-media/instagram');

    return { success: true, data: instagram };
  } catch (error: any) {
    console.error('[v0] Update Instagram failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to update Instagram link',
    };
  }
}

export async function getInstagramLink(id: string) {
  try {
    const instagram = await prisma.instagram.findUnique({
      where: { id, isDeleted: false },
    });

    if (!instagram) {
      return { success: false, error: 'Instagram link not found' };
    }

    return { success: true, data: instagram };
  } catch (error: any) {
    console.error('[v0] Get Instagram link failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get Instagram link',
    };
  }
}

export async function getAllInstagramLinks() {
  try {
    const instagramLinks = await prisma.instagram.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: instagramLinks };
  } catch (error: any) {
    console.error('[v0] Get all Instagram links failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get Instagram links',
    };
  }
}

export async function deleteInstagram(id: string) {
  try {
    const instagram = await prisma.instagram.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    revalidatePath('/dashboard/social-media/instagram');

    return { success: true, data: instagram };
  } catch (error: any) {
    console.error('[v0] Delete Instagram failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete Instagram link',
    };
  }
}

export async function getDeletedInstagramLinks() {
  try {
    const instagramLinks = await prisma.instagram.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    });

    return { success: true, data: instagramLinks };
  } catch (error: any) {
    console.error('[v0] Get deleted Instagram links failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get deleted Instagram links',
    };
  }
}

export async function restoreInstagram(id: string) {
  try {
    const instagram = await prisma.instagram.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    revalidatePath('/dashboard/social-media/instagram');

    return { success: true, data: instagram };
  } catch (error: any) {
    console.error('[v0] Restore Instagram failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to restore Instagram link',
    };
  }
}

export async function permanentlyDeleteInstagram(id: string) {
  try {
    const instagram = await prisma.instagram.delete({
      where: { id },
    });

    revalidatePath('/dashboard/social-media/instagram');

    return { success: true };
  } catch (error: any) {
    console.error('[v0] Permanent delete Instagram failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to permanently delete Instagram link',
    };
  }
}
