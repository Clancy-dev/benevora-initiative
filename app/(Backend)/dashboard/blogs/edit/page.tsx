'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { getBlog } from '@/actions/blogs';
import { BlogForm } from '@/components/BlogForm';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  authorFirstName: string;
  authorLastName: string;
  category: string;
  slug: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function EditBlogPage() {
  const searchParams = useSearchParams();
  const blogId = searchParams.get('id');
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId) {
        toast.error('Blog ID not found');
        return;
      }

      try {
        const result = await getBlog(blogId);

        if (result.success && result.data) {
          setBlog(result.data);
        } else {
          toast.error('Blog not found');
        }
      } catch (error) {
        toast.error('Failed to load blog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/blogs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Blog Not Found</h1>
          </div>
        </div>
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
          <h1 className="text-3xl font-bold text-foreground">Edit Blog Post</h1>
          <p className="text-foreground/60 mt-1">Update your blog post</p>
        </div>
      </div>

      {/* Form */}
      <BlogForm initialData={blog} isEditMode={true} />
    </div>
  );
}
