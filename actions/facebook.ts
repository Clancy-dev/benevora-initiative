'use server';

import { prisma } from '@/lib/prisma';
import { facebookSchema } from '@/lib/validations/facebook';
import { revalidatePath } from 'next/cache';

export async function createFacebook(data: any) {
  try {
    const validated = facebookSchema.parse(data);

    const facebook = await prisma.facebook.create({
      data: {
        ...validated,
      },
    });

    revalidatePath('/dashboard/social-media/facebook');

    return { success: true, data: facebook };
  } catch (error: any) {
    console.error('[v0] Create Facebook failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to create Facebook link',
    };
  }
}

export async function updateFacebook(id: string, data: any) {
  try {
    const validated = facebookSchema.parse(data);

    const facebook = await prisma.facebook.update({
      where: { id },
      data: {
        ...validated,
      },
    });

    revalidatePath('/dashboard/social-media/facebook');

    return { success: true, data: facebook };
  } catch (error: any) {
    console.error('[v0] Update Facebook failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to update Facebook link',
    };
  }
}

export async function getFacebookLink(id: string) {
  try {
    const facebook = await prisma.facebook.findUnique({
      where: { id, isDeleted: false },
    });

    if (!facebook) {
      return { success: false, error: 'Facebook link not found' };
    }

    return { success: true, data: facebook };
  } catch (error: any) {
    console.error('[v0] Get Facebook link failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get Facebook link',
    };
  }
}

export async function getAllFacebookLinks() {
  try {
    const facebookLinks = await prisma.facebook.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: facebookLinks };
  } catch (error: any) {
    console.error('[v0] Get all Facebook links failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get Facebook links',
    };
  }
}

export async function deleteFacebook(id: string) {
  try {
    const facebook = await prisma.facebook.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    revalidatePath('/dashboard/social-media/facebook');

    return { success: true, data: facebook };
  } catch (error: any) {
    console.error('[v0] Delete Facebook failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete Facebook link',
    };
  }
}

export async function getDeletedFacebookLinks() {
  try {
    const facebookLinks = await prisma.facebook.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    });

    return { success: true, data: facebookLinks };
  } catch (error: any) {
    console.error('[v0] Get deleted Facebook links failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get deleted Facebook links',
    };
  }
}

export async function restoreFacebook(id: string) {
  try {
    const facebook = await prisma.facebook.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    revalidatePath('/dashboard/social-media/facebook');

    return { success: true, data: facebook };
  } catch (error: any) {
    console.error('[v0] Restore Facebook failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to restore Facebook link',
    };
  }
}

export async function permanentlyDeleteFacebook(id: string) {
  try {
    const facebook = await prisma.facebook.delete({
      where: { id },
    });

    revalidatePath('/dashboard/social-media/facebook');

    return { success: true };
  } catch (error: any) {
    console.error('[v0] Permanent delete Facebook failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to permanently delete Facebook link',
    };
  }
}
