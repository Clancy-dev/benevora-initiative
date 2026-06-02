'use server';

import { prisma } from '@/lib/prisma';
import { founderSchema } from '@/lib/validations/founder';
import { z } from 'zod';

const CURRENT_USER_ID = 'user_placeholder_id'; // Replace with actual user session

// ========== CREATE ==========
export async function createFounder(data: z.infer<typeof founderSchema>) {
  try {
    const validatedData = founderSchema.parse(data);

    const founder = await prisma.founder.create({
      data: {
        name: validatedData.name,
        role: validatedData.role,
        image: validatedData.image,
        bio: validatedData.bio,
        order: validatedData.order || 0,
      },
    });


    return { success: true, data: founder };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, 
         error: error instanceof z.ZodError
        ? error.errors.map(e => e.message).join(', ')
        : 'Validation failed',
      };
    }
    return { success: false, error: 'Failed to create founder' };
  }
}

// ========== READ ALL (NON-DELETED) ==========
export async function getAllFounders() {
  try {
    const founders = await prisma.founder.findMany({
      where: { isDeleted: false },
      orderBy: { order: 'asc' },
    });

    return { success: true, data: founders };
  } catch (error) {
    return { success: false, error: 'Failed to fetch founders' };
  }
}

// ========== READ SINGLE ==========
export async function getFounder(id: string) {
  try {
    const founder = await prisma.founder.findFirst({
      where: { id, isDeleted: false },
    });

    if (!founder) {
      return { success: false, error: 'Founder not found' };
    }

    return { success: true, data: founder };
  } catch (error) {
    return { success: false, error: 'Failed to fetch founder' };
  }
}

// ========== UPDATE ==========
export async function updateFounder(id: string, data: z.infer<typeof founderSchema>) {
  try {
    const validatedData = founderSchema.parse(data);

    // Check if founder exists and is not deleted
    const existing = await prisma.founder.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existing) {
      return { success: false, error: 'Founder not found' };
    }

    const founder = await prisma.founder.update({
      where: { id },
      data: {
        name: validatedData.name,
        role: validatedData.role,
        image: validatedData.image,
        bio: validatedData.bio,
        order: validatedData.order || 0,
      },
    });

    return { success: true, data: founder };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors };
    }
    return { success: false, error: 'Failed to update founder' };
  }
}

// ========== SOFT DELETE ==========
export async function deleteFounder(id: string) {
  try {
    const existing = await prisma.founder.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existing) {
      return { success: false, error: 'Founder not found' };
    }

    const founder = await prisma.founder.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return { success: true, data: founder };
  } catch (error) {
    return { success: false, error: 'Failed to delete founder' };
  }
}

// ========== GET DELETED (TRASH) ==========
export async function getDeletedFounders() {
  try {
    const founders = await prisma.founder.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    });

    return { success: true, data: founders };
  } catch (error) {
    return { success: false, error: 'Failed to fetch deleted founders' };
  }
}

// ========== RESTORE ==========
export async function restoreFounder(id: string) {
  try {
    const existing = await prisma.founder.findFirst({
      where: { id, isDeleted: true },
    });

    if (!existing) {
      return { success: false, error: 'Deleted founder not found' };
    }

    const founder = await prisma.founder.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });


    return { success: true, data: founder };
  } catch (error) {
    return { success: false, error: 'Failed to restore founder' };
  }
}

// ========== PERMANENT DELETE ==========
export async function permanentDeleteFounder(id: string) {
  try {
    const existing = await prisma.founder.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: 'Founder not found' };
    }

    await prisma.founder.delete({
      where: { id },
    });


    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to permanently delete founder' };
  }
}
