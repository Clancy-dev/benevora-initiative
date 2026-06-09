'use server';

import { prisma } from '@/lib/prisma';
import { mapSchema } from '@/lib/validations/map';

const CURRENT_USER_ID = 'user_placeholder_id';

export async function createMap(data: any) {
  try {
    const validated = mapSchema.parse(data);

    const map = await prisma.mapEmbed.create({
      data: validated,
    });

    return { success: true, data: map };
  } catch (error) {
    console.error('[v0] Map create error:', error);
    return { success: false, error: 'Failed to create map' };
  }
}

export async function updateMap(id: string, data: any) {
  try {
    const validated = mapSchema.parse(data);

    const map = await prisma.mapEmbed.update({
      where: { id },
      data: validated,
    });

    return { success: true, data: map };
  } catch (error) {
    console.error('[v0] Map update error:', error);
    return { success: false, error: 'Failed to update map' };
  }
}

export async function getMap(id: string) {
  try {
    const map = await prisma.mapEmbed.findUnique({ where: { id } });
    if (!map || map.isDeleted) return { success: false, error: 'Map not found' };
    return { success: true, data: map };
  } catch (error) {
    console.error('[v0] Map get error:', error);
    return { success: false, error: 'Failed to get map' };
  }
}

export async function getAllMaps() {
  try {
    const maps = await prisma.mapEmbed.findMany({
      where: { isDeleted: false },
      orderBy: { order: 'asc' },
    });
    return { success: true, data: maps };
  } catch (error) {
    console.error('[v0] Map getAll error:', error);
    return { success: false, error: 'Failed to get maps' };
  }
}

export async function deleteMap(id: string) {
  try {
    const map = await prisma.mapEmbed.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });


    return { success: true, data: map };
  } catch (error) {
    console.error('[v0] Map delete error:', error);
    return { success: false, error: 'Failed to delete map' };
  }
}

export async function getDeletedMaps() {
  try {
    const maps = await prisma.mapEmbed.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    });
    return { success: true, data: maps };
  } catch (error) {
    console.error('[v0] Map getDeleted error:', error);
    return { success: false, error: 'Failed to get deleted maps' };
  }
}

export async function restoreMap(id: string) {
  try {
    const map = await prisma.mapEmbed.update({
      where: { id },
      data: { isDeleted: false, deletedAt: null },
    });

    return { success: true, data: map };
  } catch (error) {
    console.error('[v0] Map restore error:', error);
    return { success: false, error: 'Failed to restore map' };
  }
}

export async function permanentDeleteMap(id: string) {
  try {
    const map = await prisma.mapEmbed.delete({ where: { id } });

    return { success: true, data: map };
  } catch (error) {
    console.error('[v0] Map permanentDelete error:', error);
    return { success: false, error: 'Failed to permanently delete map' };
  }
}
