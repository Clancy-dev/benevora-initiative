'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Trash2, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getDeletedBlogs, permanentDeleteBlog, restoreBlog } from '@/actions/blogs';

interface Blog {
  id: string;
  title: string;
  image: string;
  author: string;
  category: string;
  deletedAt: Date;
}

export default function BlogsTrashPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blogToRestore, setBlogToRestore] = useState<Blog | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchDeletedBlogs = async () => {
      try {
        const result = await getDeletedBlogs();

        if (result.success && result.data) {
          setBlogs(result.data as Blog[]);
        } else {
          toast.error('Failed to load deleted blogs');
        }
      } catch (error) {
        toast.error('Failed to load deleted blogs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeletedBlogs();
  }, []);

  const handleRestore = async (blog: Blog) => {
    setIsRestoring(true);

    try {
      const result = await restoreBlog(blog.id);

      if (result.success) {
        toast.success('Blog restored successfully');
        setBlogs(blogs.filter((b) => b.id !== blog.id));
      } else {
        toast.error(result.error || 'Failed to restore blog');
      }
    } catch (error) {
      toast.error('Failed to restore blog');
    } finally {
      setIsRestoring(false);
      setBlogToRestore(null);
    }
  };

  const handlePermanentDelete = async (blog: Blog) => {
    setIsDeleting(true);

    try {
      const result = await permanentDeleteBlog(blog.id);

      if (result.success) {
        toast.success('Blog permanently deleted');
        setBlogs(blogs.filter((b) => b.id !== blog.id));
      } else {
        toast.error(result.error || 'Failed to permanently delete blog');
      }
    } catch (error) {
      toast.error('Failed to permanently delete blog');
    } finally {
      setIsDeleting(false);
      setBlogToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/blogs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trash</h1>
          <p className="text-foreground/60 mt-1">Restore or permanently delete blogs</p>
        </div>
      </div>

      {/* Table or Empty State */}
      {blogs.length === 0 ? (
        <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground mb-2">No Deleted Blogs</p>
            <p className="text-sm text-foreground/60">The trash is empty</p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden bg-background">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Author</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Deleted On</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border">
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{blog.title}</td>
                    <td className="px-6 py-4 text-sm text-foreground/80">{blog.author}</td>
                    <td className="px-6 py-4 text-sm text-foreground/80">{blog.category}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {new Date(blog.deletedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setBlogToRestore(blog)}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setBlogToDelete(blog)}
                            className="text-red-600 focus:bg-red-50 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Permanently Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={!!blogToRestore} onOpenChange={(open) => !open && setBlogToRestore(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Restore Blog?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to restore <span className="font-semibold">{blogToRestore?.title}</span>? It will be added back to your blogs list.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => blogToRestore && handleRestore(blogToRestore)}
              disabled={isRestoring}
              className="cursor-pointer"
            >
              {isRestoring ? 'Restoring...' : 'Restore'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Confirmation Dialog */}
      <AlertDialog open={!!blogToDelete} onOpenChange={(open) => !open && setBlogToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Permanently Delete Blog?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete <span className="font-semibold">{blogToDelete?.title}</span>? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => blogToDelete && handlePermanentDelete(blogToDelete)}
              disabled={isDeleting}
              className="bg-destructive text-background hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting ? 'Deleting...' : 'Permanently Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
