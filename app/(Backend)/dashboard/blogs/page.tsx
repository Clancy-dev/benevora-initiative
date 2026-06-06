import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { getAllBlogs } from '@/actions/blogs';
import { BlogTable } from '@/components/BlogTable';

export const metadata: Metadata = {
  title: 'Blogs - Admin Dashboard',
  description: 'Manage your blog posts',
};

export default async function BlogsDashboardPage() {
  const result = await getAllBlogs();
  const blogs = result.success ? result.data || [] : [];

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blogs</h1>
          <p className="text-foreground/60 mt-1">Manage and publish your blog posts</p>
        </div>

        <div className="flex gap-2">
            <Link href="/dashboard/blogs/trash">
                <Button variant="outline" size="sm" className="cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                 Trash
                </Button>
            </Link>      
            <Link href="/dashboard/blogs/create">
                <Button>
                <Plus className="mr-2 h-4 w-4" />
                 Create Blog
                </Button>
            </Link>           
        </div>
      </div>
    
      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>Manage all your blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <BlogTable blogs={blogs} />
        </CardContent>
      </Card>
    </div>
  );
}
