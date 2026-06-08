'use server';

import { prisma } from '@/lib/prisma';
import { officePhotoSchema } from '@/lib/validations/office-photo';
import { z } from 'zod';

const CURRENT_USER_ID = 'user_placeholder_id';

type OfficePhotoData = z.infer<typeof officePhotoSchema>;

export async function createOfficePhoto(data: OfficePhotoData) {
  try {
    const validated = officePhotoSchema.parse(data);

    const photo = await prisma.officePhoto.create({
      data: {
        ...validated,
      },
    });


    return { success: true, data: photo };
  } catch (error) {
    console.error('[v0] Create office photo error:', error);
    return {
      success: false,
      error: error instanceof z.ZodError ? error.errors[0].message : 'Failed to create office photo',
    };
  }
}

export async function updateOfficePhoto(id: string, data: OfficePhotoData) {
  try {
    const validated = officePhotoSchema.parse(data);

    const photo = await prisma.officePhoto.update({
      where: { id },
      data: validated,
    });

    return { success: true, data: photo };
  } catch (error) {
    console.error('[v0] Update office photo error:', error);
    return {
      success: false,
      error: error instanceof z.ZodError ? error.errors[0].message : 'Failed to update office photo',
    };
  }
}

export async function getOfficePhoto(id: string) {
  try {
    const photo = await prisma.officePhoto.findUnique({
      where: { id, isDeleted: false },
    });

    if (!photo) {
      return { success: false, error: 'Office photo not found' };
    }

    return { success: true, data: photo };
  } catch (error) {
    console.error('[v0] Get office photo error:', error);
    return { success: false, error: 'Failed to get office photo' };
  }
}

export async function getAllOfficePhotos() {
  try {
    const photos = await prisma.officePhoto.findMany({
      where: { isDeleted: false },
      orderBy: { order: 'asc' },
    });

    return { success: true, data: photos };
  } catch (error) {
    console.error('[v0] Get all office photos error:', error);
    return { success: false, error: 'Failed to get office photos' };
  }
}

export async function deleteOfficePhoto(id: string) {
  try {
    const photo = await prisma.officePhoto.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('[v0] Delete office photo error:', error);
    return { success: false, error: 'Failed to delete office photo' };
  }
}

export async function getDeletedOfficePhotos() {
  try {
    const photos = await prisma.officePhoto.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    });

    return { success: true, data: photos };
  } catch (error) {
    console.error('[v0] Get deleted office photos error:', error);
    return { success: false, error: 'Failed to get deleted office photos' };
  }
}

export async function restoreOfficePhoto(id: string) {
  try {
    const photo = await prisma.officePhoto.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('[v0] Restore office photo error:', error);
    return { success: false, error: 'Failed to restore office photo' };
  }
}

export async function permanentDeleteOfficePhoto(id: string) {
  try {
    await prisma.officePhoto.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error('[v0] Permanent delete office photo error:', error);
    return { success: false, error: 'Failed to permanently delete office photo' };
  }
}
