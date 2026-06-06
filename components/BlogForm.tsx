'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { blogSchema } from '@/lib/validations/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createBlog, updateBlog } from '@/actions/blogs';

const PREDEFINED_CATEGORIES = [
  'Education',
  'Impact',
  'Sustainability',
  'Empowerment',
  'Skills',
  'Community',
  'Innovation',
  'Compassion',
  'Excellence',
  'Integrity',
  'Other',
];

type BlogFormData = typeof blogSchema._type;

interface BlogFormProps {
  initialData?: {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    category: string;
    slug: string;
  };
  isEditMode?: boolean;
}

export function BlogForm({ initialData, isEditMode = false }: BlogFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(initialData?.image || '');
  
  // Split author name into first and last for initial values
  const initialFirstName = initialData?.author ? initialData.author.split(' ')[0] : '';
  const initialLastName = initialData?.author ? initialData.author.split(' ').slice(1).join(' ') : '';
  
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialData?.category && PREDEFINED_CATEGORIES.includes(initialData.category)
      ? initialData.category
      : ''
  );
  const [customCategory, setCustomCategory] = useState<string>(
    initialData?.category && !PREDEFINED_CATEGORIES.includes(initialData.category)
      ? initialData.category
      : ''
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      image: initialData?.image || '',
      authorFirstName: initialFirstName,
      authorLastName: initialLastName,
      author: '',
      category: '',
      slug: '',
    },
  });

  const authorFirstName = watch('authorFirstName');
  const authorLastName = watch('authorLastName');

  const titleValue = watch('title');

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'practice');

      const cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;

      if (!cloudinaryUrl) {
        throw new Error('Cloudinary URL is not configured');
      }

      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.secure_url) {
        throw new Error('No image URL returned from Cloudinary');
      }

      const url = data.secure_url;
      setImageUrl(url);
      setValue('image', url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('[v0] Cloudinary upload failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    if (!imageUrl) {
      toast.error('Please upload an image');
      return;
    }

    if (!selectedCategory || selectedCategory === '') {
      toast.error('Please select a category');
      return;
    }

    const finalCategory = selectedCategory === 'Other' ? customCategory : selectedCategory;

    if (selectedCategory === 'Other' && !customCategory.trim()) {
      toast.error('Please enter a custom category');
      return;
    }

    setIsLoading(true);

    try {
      const generatedSlug = generateSlug(data.title);
      const fullAuthor = `${authorFirstName} ${authorLastName}`.trim();
      
      const submitData = {
        ...data,
        image: imageUrl,
        author: fullAuthor,
        category: finalCategory,
        slug: generatedSlug,
      };

      let result;
      if (isEditMode && initialData) {
        result = await updateBlog(initialData.id, submitData);
      } else {
        result = await createBlog(submitData);
      }

      if (result.success) {
        toast.success(isEditMode ? 'Blog updated successfully' : 'Blog created successfully');
        router.replace('/dashboard/blogs');
      } else {
        toast.error(result.error || 'Failed to save blog');
      }
    } catch (error) {
      toast.error('Failed to save blog');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Blog' : 'Create Blog'}</CardTitle>
        <CardDescription>
          {isEditMode ? 'Update blog details' : 'Add a new blog post'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-3">Blog Image *</label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imageUrl ? (
                <div className="relative w-full max-w-sm mx-auto">
                  <Image
                    src={imageUrl}
                    alt="Blog preview"
                    width={400}
                    height={300}
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isLoading}
            />
            <input type="hidden" {...register('image')} value={imageUrl} />
          </div>

          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter blog title"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Author First Name Field */}
          <div>
            <label htmlFor="authorFirstName" className="block text-sm font-medium mb-2">
              Author First Name *
            </label>
            <Input
              id="authorFirstName"
              {...register('authorFirstName')}
              placeholder="Enter author first name"
              disabled={isLoading}
            />
            {errors.authorFirstName && (
              <p className="text-sm text-destructive mt-1">{errors.authorFirstName.message}</p>
            )}
          </div>

          {/* Author Last Name Field */}
          <div>
            <label htmlFor="authorLastName" className="block text-sm font-medium mb-2">
              Author Last Name *
            </label>
            <Input
              id="authorLastName"
              {...register('authorLastName')}
              placeholder="Enter author last name"
              disabled={isLoading}
            />
            {errors.authorLastName && (
              <p className="text-sm text-destructive mt-1">{errors.authorLastName.message}</p>
            )}
          </div>

          {/* Category Field with Dropdown */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category *
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                if (e.target.value !== 'Other') {
                  setCustomCategory('');
                }
              }}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a Category</option>
              {PREDEFINED_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Custom Category Input - Only shows if "Other" is selected */}
          {selectedCategory === 'Other' && (
            <div>
              <label htmlFor="customCategory" className="block text-sm font-medium mb-2">
                Custom Category *
              </label>
              <Input
                id="customCategory"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter your custom category"
                disabled={isLoading}
              />
              {!customCategory && (
                <p className="text-sm text-destructive mt-1">Please enter a custom category</p>
              )}
            </div>
          )}

          {/* Excerpt Field - with whitespace preservation */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
              Article Summary *
            </label>
            <textarea
              id="excerpt"
              {...register('excerpt')}
              placeholder="Enter blog summary (max 500 characters)"
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none whitespace-pre-wrap break-words"
              disabled={isLoading}
            />
            {errors.excerpt && (
              <p className="text-sm text-destructive mt-1">{errors.excerpt.message}</p>
            )}
          </div>

          {/* Content Field - with whitespace preservation */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Content *
            </label>
            <textarea
              id="content"
              {...register('content')}
              placeholder="Enter full blog content (max 10000 characters)"
              rows={10}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none whitespace-pre-wrap break-words"
              disabled={isLoading}
            />
            {errors.content && (
              <p className="text-sm text-destructive mt-1">{errors.content.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : isEditMode ? 'Update Blog' : 'Create Blog'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
