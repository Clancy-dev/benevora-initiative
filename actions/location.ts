'use server';

import { prisma } from '@/lib/prisma';
import { locationSchema } from '@/lib/validations/location';


const CURRENT_USER_ID = 'user_placeholder_id';

export async function createLocation(data: any) {
  try {
    const validated = locationSchema.parse(data);

    const location = await prisma.location.create({
      data: validated,
    });

    return { success: true, data: location };
  } catch (error) {
    console.error('[v0] Location create error:', error);
    return { success: false, error: 'Failed to create location' };
  }
}

export async function updateLocation(id: string, data: any) {
  try {
    const validated = locationSchema.parse(data);

    const location = await prisma.location.update({
      where: { id },
      data: validated,
    });

    return { success: true, data: location };
  } catch (error) {
    console.error('[v0] Location update error:', error);
    return { success: false, error: 'Failed to update location' };
  }
}

export async function getLocation(id: string) {
  try {
    const location = await prisma.location.findUnique({ where: { id } });
    if (!location || location.isDeleted) return { success: false, error: 'Location not found' };
    return { success: true, data: location };
  } catch (error) {
    console.error('[v0] Location get error:', error);
    return { success: false, error: 'Failed to get location' };
  }
}

export async function getAllLocations() {
  try {
    const locations = await prisma.location.findMany({
      where: { isDeleted: false },
      orderBy: { order: 'asc' },
    });
    return { success: true, data: locations };
  } catch (error) {
    console.error('[v0] Location getAll error:', error);
    return { success: false, error: 'Failed to get locations' };
  }
}

export async function deleteLocation(id: string) {
  try {
    const location = await prisma.location.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    return { success: true, data: location };
  } catch (error) {
    console.error('[v0] Location delete error:', error);
    return { success: false, error: 'Failed to delete location' };
  }
}

export async function getDeletedLocations() {
  try {
    const locations = await prisma.location.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    });
    return { success: true, data: locations };
  } catch (error) {
    console.error('[v0] Location getDeleted error:', error);
    return { success: false, error: 'Failed to get deleted locations' };
  }
}

export async function restoreLocation(id: string) {
  try {
    const location = await prisma.location.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null },
    });

    return { success: true, data: location };
  } catch (error) {
    console.error('[v0] Location restore error:', error);
    return { success: false, error: 'Failed to restore location' };
  }
}

export async function permanentDeleteLocation(id: string) {
  try {
    const location = await prisma.location.delete({ where: { id } });

    return { success: true, data: location };
  } catch (error) {
    console.error('[v0] Location permanentDelete error:', error);
    return { success: false, error: 'Failed to permanently delete location' };
  }
}
