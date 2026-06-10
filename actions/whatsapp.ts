'use server';

import { prisma } from '@/lib/prisma';
import { whatsappSchema } from '@/lib/validations/whatsapp';
import { revalidatePath } from 'next/cache';

export async function createWhatsapp(data: any) {
  try {
    const validated = whatsappSchema.parse(data);

    const whatsapp = await prisma.whatsapp.create({
      data: {
        ...validated,
      },
    });

    revalidatePath('/dashboard/social-media/whatsapp');

    return { success: true, data: whatsapp };
  } catch (error: any) {
    console.error('[v0] Create WhatsApp failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to create WhatsApp link',
    };
  }
}

export async function updateWhatsapp(id: string, data: any) {
  try {
    const validated = whatsappSchema.parse(data);

    const whatsapp = await prisma.whatsapp.update({
      where: { id },
      data: {
        ...validated,
      },
    });

    revalidatePath('/dashboard/social-media/whatsapp');

    return { success: true, data: whatsapp };
  } catch (error: any) {
    console.error('[v0] Update WhatsApp failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to update WhatsApp link',
    };
  }
}

export async function getWhatsappLink(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error: 'Invalid WhatsApp ID',
      };
    }

    const whatsapp = await prisma.whatsapp.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!whatsapp) {
      return {
        success: false,
        error: 'WhatsApp link not found',
      };
    }

    return { success: true, data: whatsapp };
  } catch (error: any) {
    console.error('[v0] Get WhatsApp link failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get WhatsApp link',
    };
  }
}

export async function getAllWhatsappLinks() {
  try {
    const whatsappLinks = await prisma.whatsapp.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: whatsappLinks };
  } catch (error: any) {
    console.error('[v0] Get all WhatsApp links failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get WhatsApp links',
    };
  }
}

export async function deleteWhatsapp(id: string) {
  try {
    const whatsapp = await prisma.whatsapp.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    revalidatePath('/dashboard/social-media/whatsapp');

    return { success: true, data: whatsapp };
  } catch (error: any) {
    console.error('[v0] Delete WhatsApp failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete WhatsApp link',
    };
  }
}

export async function getDeletedWhatsappLinks() {
  try {
    const whatsappLinks = await prisma.whatsapp.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    });

    return { success: true, data: whatsappLinks };
  } catch (error: any) {
    console.error('[v0] Get deleted WhatsApp links failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get deleted WhatsApp links',
    };
  }
}

export async function restoreWhatsapp(id: string) {
  try {
    const whatsapp = await prisma.whatsapp.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    revalidatePath('/dashboard/social-media/whatsapp');

    return { success: true, data: whatsapp };
  } catch (error: any) {
    console.error('[v0] Restore WhatsApp failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to restore WhatsApp link',
    };
  }
}

export async function permanentlyDeleteWhatsapp(id: string) {
  try {
    const whatsapp = await prisma.whatsapp.delete({
      where: { id },
    });

    revalidatePath('/dashboard/social-media/whatsapp');

    return { success: true };
  } catch (error: any) {
    console.error('[v0] Permanent delete WhatsApp failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to permanently delete WhatsApp link',
    };
  }
}
