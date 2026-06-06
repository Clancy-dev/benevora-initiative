import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogForm } from '@/components/BlogForm';

export const metadata: Metadata = {
  title: 'Create Blog - Admin Dashboard',
  description: 'Create a new blog post',
};

export default function CreateBlogPage() {
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
          <h1 className="text-3xl font-bold text-foreground">Create Blog Post</h1>
          <p className="text-foreground/60 mt-1">Write and publish a new blog post</p>
        </div>
      </div>

      {/* Form */}
      <BlogForm />
    </div>
  );
}
