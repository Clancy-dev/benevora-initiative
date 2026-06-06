'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteBlog, getBlog } from '@/actions/blogs';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  slug: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function BlogDetailPage({ params }: PageProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const result = await getBlog(params.id);

        if (result.success && result.data) {
          setBlog(result.data);
        } else {
          toast.error('Blog not found');
          router.push('/dashboard/blogs');
        }
      } catch (error) {
        toast.error('Failed to load blog');
        router.push('/dashboard/blogs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [params.id, router]);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteBlog(params.id);

      if (result.success) {
        toast.success('Blog deleted and moved to trash');
        router.push('/dashboard/blogs');
      } else {
        toast.error(result.error || 'Failed to delete blog');
      }
    } catch (error) {
      toast.error('Failed to delete blog');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return null;
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
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{blog.title}</h1>
          <p className="text-foreground/60 mt-1">By {blog.author} in {blog.category}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Blog Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <Card>
            <CardContent className="p-8">
              <div className="relative w-full h-96 rounded-lg overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none whitespace-pre-wrap break-words text-foreground/90 leading-relaxed">
                {blog.content}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Blog Info */}
          <Card>
            <CardHeader>
              <CardTitle>Blog Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-foreground/60 mb-1">Slug</p>
                <p className="font-mono text-sm text-foreground">{blog.slug}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60 mb-1">Category</p>
                <p className="text-sm text-foreground">{blog.category}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60 mb-1">Author</p>
                <p className="text-sm text-foreground">{blog.author}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60 mb-1">Created On</p>
                <p className="text-sm text-foreground">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Excerpt */}
          <Card>
            <CardHeader>
              <CardTitle>Excerpt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words leading-relaxed">
                {blog.excerpt}
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              <Link href={`/dashboard/blogs/edit?id=${blog.id}`} className="block">
                <Button className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Blog
                </Button>
              </Link>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Blog
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Blog?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{blog.title}</span>? This action can be undone from the trash.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
