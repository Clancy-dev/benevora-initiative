'use server';

import { prisma } from '@/lib/prisma';
import { linkedinSchema } from '@/lib/validations/linkedin';
import { revalidatePath } from 'next/cache';

export async function createLinkedin(data: any) {
  try {
    const validated = linkedinSchema.parse(data);

    const linkedin = await prisma.linkedIn.create({
      data: {
        ...validated,
      },
    });

    revalidatePath('/dashboard/social-media/linkedin');

    return { success: true, data: linkedin };
  } catch (error: any) {
    console.error('[v0] Create LinkedIn failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to create LinkedIn link',
    };
  }
}

export async function updateLinkedin(id: string, data: any) {
  try {
    const validated = linkedinSchema.parse(data);

    const linkedin = await prisma.linkedIn.update({
      where: { id },
      data: {
        ...validated,
      },
    });

    revalidatePath('/dashboard/social-media/linkedin');

    return { success: true, data: linkedin };
  } catch (error: any) {
    console.error('[v0] Update LinkedIn failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to update LinkedIn link',
    };
  }
}

export async function getLinkedinLink(id: string) {
  try {
    const linkedin = await prisma.linkedIn.findUnique({
      where: { id, isDeleted: false },
    });

    if (!linkedin) {
      return { success: false, error: 'LinkedIn link not found' };
    }

    return { success: true, data: linkedin };
  } catch (error: any) {
    console.error('[v0] Get LinkedIn link failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get LinkedIn link',
    };
  }
}

export async function getAllLinkedinLinks() {
  try {
    const linkedinLinks = await prisma.linkedIn.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: linkedinLinks };
  } catch (error: any) {
    console.error('[v0] Get all LinkedIn links failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get LinkedIn links',
    };
  }
}

export async function deleteLinkedin(id: string) {
  try {
    const linkedin = await prisma.linkedIn.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    revalidatePath('/dashboard/social-media/linkedin');

    return { success: true, data: linkedin };
  } catch (error: any) {
    console.error('[v0] Delete LinkedIn failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete LinkedIn link',
    };
  }
}

export async function getDeletedLinkedinLinks() {
  try {
    const linkedinLinks = await prisma.linkedIn.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    });

    return { success: true, data: linkedinLinks };
  } catch (error: any) {
    console.error('[v0] Get deleted LinkedIn links failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get deleted LinkedIn links',
    };
  }
}

export async function restoreLinkedin(id: string) {
  try {
    const linkedin = await prisma.linkedIn.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    revalidatePath('/dashboard/social-media/linkedin');

    return { success: true, data: linkedin };
  } catch (error: any) {
    console.error('[v0] Restore LinkedIn failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to restore LinkedIn link',
    };
  }
}

export async function permanentlyDeleteLinkedin(id: string) {
  try {
    const linkedin = await prisma.linkedIn.delete({
      where: { id },
    });

    revalidatePath('/dashboard/social-media/linkedin');

    return { success: true };
  } catch (error: any) {
    console.error('[v0] Permanent delete LinkedIn failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to permanently delete LinkedIn link',
    };
  }
}
