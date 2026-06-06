'use server';

import { prisma } from '@/lib/prisma';
import { blogSchema } from '@/lib/validations/blog';
import { z } from 'zod';

const CURRENT_USER_ID = 'user_placeholder_id';

type BlogData = z.infer<typeof blogSchema>;

export async function createBlog(data: BlogData) {
  try {
    const validated = blogSchema.parse(data);

    const blog = await prisma.blog.create({
      data: {
        ...validated,
      },
    });

    return { success: true, data: blog };
  } catch (error) {
    console.error('[v0] Create blog error:', error);
    return {
      success: false,
      error: error instanceof z.ZodError ? error.errors[0].message : 'Failed to create blog',
    };
  }
}

export async function updateBlog(id: string, data: BlogData) {
  try {
    const validated = blogSchema.parse(data);

    const blog = await prisma.blog.update({
      where: { id },
      data: validated,
    });

    return { success: true, data: blog };
  } catch (error) {
    console.error('[v0] Update blog error:', error);
    return {
      success: false,
      error: error instanceof z.ZodError ? error.errors[0].message : 'Failed to update blog',
    };
  }
}

export async function getBlog(id: string) {
  try {
    const blog = await prisma.blog.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!blog) {
      return { success: false, error: 'Blog not found' };
    }

    return { success: true, data: blog };
  } catch (error) {
    console.error('[v0] Get blog error:', error);
    return { success: false, error: 'Failed to get blog' };
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const blog = await prisma.blog.findFirst({
       where: {
            slug,
            isDeleted: false,
        },
     });

    if (!blog) {
      return { success: false, error: 'Blog not found' };
    }

    return { success: true, data: blog };
  } catch (error) {
    console.error('[v0] Get blog by slug error:', error);
    return { success: false, error: 'Failed to get blog' };
  }
}

export async function getAllBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: blogs };
  } catch (error) {
    console.error('[v0] Get all blogs error:', error);
    return { success: false, error: 'Failed to get blogs' };
  }
}

export async function deleteBlog(id: string) {
  try {
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('[v0] Delete blog error:', error);
    return { success: false, error: 'Failed to delete blog' };
  }
}

export async function getDeletedBlogs() {
  try {
    const blogs = await prisma.blog.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    });

    return { success: true, data: blogs };
  } catch (error) {
    console.error('[v0] Get deleted blogs error:', error);
    return { success: false, error: 'Failed to get deleted blogs' };
  }
}

export async function restoreBlog(id: string) {
  try {
    const blog = await prisma.blog.update({
      where: { id },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('[v0] Restore blog error:', error);
    return { success: false, error: 'Failed to restore blog' };
  }
}

export async function permanentDeleteBlog(id: string) {
  try {
    await prisma.blog.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error('[v0] Permanent delete blog error:', error);
    return { success: false, error: 'Failed to permanently delete blog' };
  }
}
