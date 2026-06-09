'use server';

import { prisma } from '@/lib/prisma';
import { phoneNumberSchema } from '@/lib/validations/phone-number';
import { revalidatePath } from 'next/cache';

const CURRENT_USER_ID = 'user_placeholder_id';

export async function createPhoneNumber(data: any) {
  try {
    const validated = phoneNumberSchema.parse(data);

    const phoneNumber = await prisma.phoneNumber.create({
      data: validated,
    });


    return { success: true, data: phoneNumber };
  } catch (error) {
    console.error('[v0] Phone create error:', error);
    return { success: false, error: 'Failed to create phone number' };
  }
}

export async function updatePhoneNumber(id: string, data: any) {
  try {
    const validated = phoneNumberSchema.parse(data);

    const phoneNumber = await prisma.phoneNumber.update({
      where: { id },
      data: validated,
    });

  
    return { success: true, data: phoneNumber };
  } catch (error) {
    console.error('[v0] Phone update error:', error);
    return { success: false, error: 'Failed to update phone number' };
  }
}

export async function getPhoneNumber(id: string) {
  try {
    const phoneNumber = await prisma.phoneNumber.findUnique({ where: { id } });
    if (!phoneNumber || phoneNumber.isDeleted) return { success: false, error: 'Phone number not found' };
    return { success: true, data: phoneNumber };
  } catch (error) {
    console.error('[v0] Phone get error:', error);
    return { success: false, error: 'Failed to get phone number' };
  }
}

export async function getAllPhoneNumbers() {
  try {
    const phoneNumbers = await prisma.phoneNumber.findMany({
      where: { isDeleted: false },
      orderBy: { order: 'asc' },
    });
    return { success: true, data: phoneNumbers };
  } catch (error) {
    console.error('[v0] Phone getAll error:', error);
    return { success: false, error: 'Failed to get phone numbers' };
  }
}

export async function deletePhoneNumber(id: string) {
  try {
    const phoneNumber = await prisma.phoneNumber.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    revalidatePath('/dashboard/contact-information/phone-number');

  

    return { success: true, data: phoneNumber };
  } catch (error) {
    console.error('[v0] Phone delete error:', error);
    return { success: false, error: 'Failed to delete phone number' };
  }
}

export async function getDeletedPhoneNumbers() {
  try {
    const phoneNumbers = await prisma.phoneNumber.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    });
    return { success: true, data: phoneNumbers };
  } catch (error) {
    console.error('[v0] Phone getDeleted error:', error);
    return { success: false, error: 'Failed to get deleted phone numbers' };
  }
}

export async function restorePhoneNumber(id: string) {
  try {
    const phoneNumber = await prisma.phoneNumber.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null },
    });


    return { success: true, data: phoneNumber };
  } catch (error) {
    console.error('[v0] Phone restore error:', error);
    return { success: false, error: 'Failed to restore phone number' };
  }
}

export async function permanentDeletePhoneNumber(id: string) {
  try {
    const phoneNumber = await prisma.phoneNumber.delete({ where: { id } });


    return { success: true, data: phoneNumber };
  } catch (error) {
    console.error('[v0] Phone permanentDelete error:', error);
    return { success: false, error: 'Failed to permanently delete phone number' };
  }
}
