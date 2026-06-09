'use server';

import { prisma } from '@/lib/prisma';
import { emailSchema } from '@/lib/validations/email';

const CURRENT_USER_ID = 'user_placeholder_id';

export async function createEmail(data: any) {
  try {
    const validated = emailSchema.parse(data);

    const email = await prisma.email.create({
      data: validated,
    });


    return { success: true, data: email };
  } catch (error) {
    console.error('[v0] Email create error:', error);
    return { success: false, error: 'Failed to create email' };
  }
}

export async function updateEmail(id: string, data: any) {
  try {
    const validated = emailSchema.parse(data);

    const email = await prisma.email.update({
      where: { id },
      data: validated,
    });

    return { success: true, data: email };
  } catch (error) {
    console.error('[v0] Email update error:', error);
    return { success: false, error: 'Failed to update email' };
  }
}

export async function getEmail(id: string) {
  try {
    const email = await prisma.email.findUnique({ where: { id } });
    if (!email || email.isDeleted) return { success: false, error: 'Email not found' };
    return { success: true, data: email };
  } catch (error) {
    console.error('[v0] Email get error:', error);
    return { success: false, error: 'Failed to get email' };
  }
}

export async function getAllEmails() {
  try {
    const emails = await prisma.email.findMany({
      where: { isDeleted: false },
      orderBy: { order: 'asc' },
    });
    return { success: true, data: emails };
  } catch (error) {
    console.error('[v0] Email getAll error:', error);
    return { success: false, error: 'Failed to get emails' };
  }
}

export async function deleteEmail(id: string) {
  try {
    const email = await prisma.email.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    return { success: true, data: email };
  } catch (error) {
    console.error('[v0] Email delete error:', error);
    return { success: false, error: 'Failed to delete email' };
  }
}

export async function getDeletedEmails() {
  try {
    const emails = await prisma.email.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    });
    return { success: true, data: emails };
  } catch (error) {
    console.error('[v0] Email getDeleted error:', error);
    return { success: false, error: 'Failed to get deleted emails' };
  }
}

export async function restoreEmail(id: string) {
  try {
    const email = await prisma.email.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null },
    });

    return { success: true, data: email };
  } catch (error) {
    console.error('[v0] Email restore error:', error);
    return { success: false, error: 'Failed to restore email' };
  }
}

export async function permanentDeleteEmail(id: string) {
  try {
    const email = await prisma.email.delete({ where: { id } });

    return { success: true, data: email };
  } catch (error) {
    console.error('[v0] Email permanentDelete error:', error);
    return { success: false, error: 'Failed to permanently delete email' };
  }
}
