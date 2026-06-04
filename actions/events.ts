'use server';

import { prisma } from '@/lib/prisma';
import { eventFormSchema } from '@/lib/validations/lib';
import { revalidatePath } from 'next/cache';

const CURRENT_USER_ID = 'user_placeholder_id';

export async function createEvent(data: any) {
  try {
    const validated = eventFormSchema.parse(data);

    const event = await prisma.event.create({
      data: {
        ...validated,
      },
    });

    return { success: true, data: event };
  } catch (error: any) {
    console.error('[v0] Create event failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to create event',
    };
  }
}

export async function updateEvent(id: string, data: any) {
  try {
    const validated = eventFormSchema.parse(data);

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...validated,
      },
    });

    return { success: true, data: event };
  } catch (error: any) {
    console.error('[v0] Update event failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to update event',
    };
  }
}

export async function getEvent(id: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id, isDeleted: false },
    });

    if (!event) {
      return { success: false, error: 'Event not found' };
    }

    return { success: true, data: event };
  } catch (error: any) {
    console.error('[v0] Get event failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get event',
    };
  }
}

export async function getAllEvents() {
  try {
    const events = await prisma.event.findMany({
      where: { isDeleted: false },
      orderBy: { order: 'asc' },
    });

    return { success: true, data: events };
  } catch (error: any) {
    console.error('[v0] Get all events failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get events',
    };
  }
}

export async function deleteEvent(id: string) {
  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    revalidatePath('/dashboard/events');

    return { success: true, data: event };
  } catch (error: any) {
    console.error('[v0] Delete event failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete event',
    };
  }
}

export async function getDeletedEvents() {
  try {
    const events = await prisma.event.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    });

    return { success: true, data: events };
  } catch (error: any) {
    console.error('[v0] Get deleted events failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to get deleted events',
    };
  }
}

export async function restoreEvent(id: string) {
  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });


    return { success: true, data: event };
  } catch (error: any) {
    console.error('[v0] Restore event failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to restore event',
    };
  }
}

export async function permanentDeleteEvent(id: string) {
  try {
    const event = await prisma.event.delete({
      where: { id },
    });

    return { success: true };
  } catch (error: any) {
    console.error('[v0] Permanent delete event failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to permanently delete event',
    };
  }
}
