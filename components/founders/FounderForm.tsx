'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { founderSchema } from '@/lib/validations/founder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createFounder, updateFounder } from '@/actions/founders';
import toast from 'react-hot-toast';

type FounderFormData = typeof founderSchema._type;

interface FounderFormProps {
  initialData?: {
    id: string;
    name: string;
    role: string;
    image: string;
    bio: string;
    order?: number;
  };
  isEditMode?: boolean;
}

export function FounderForm({ initialData, isEditMode = false }: FounderFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(initialData?.image || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors: validationErrors },
  } = useForm<FounderFormData>({
    resolver: zodResolver(founderSchema),
    defaultValues: initialData || {
      name: '',
      role: '',
      image: '',
      bio: '',
      order: 0,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setErrors({});
      
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
      toast.success('Image uploaded successfully')
     
    } catch (error) {
      console.error('[v0] Cloudinary upload failed:', error);
      setErrors({ image: error instanceof Error ? error.message : 'Failed to upload image' });
      toast.error(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: FounderFormData) => {
    if (!imageUrl) {
      setErrors({ image: 'Please upload an image' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const submitData = {
        ...data,
        image: imageUrl,
      };

      let result;
      if (isEditMode && initialData) {
        result = await updateFounder(initialData.id, submitData);
      } else {
        result = await createFounder(submitData);
      }

      if (result.success) {
        toast.success(isEditMode ? 'Founder has been updated successfully.' : 'Founder has been created successfully.')
        router.replace('/dashboard/founders');
      } else {
        toast.error(typeof result.error === 'string' ? result.error : 'Something went wrong')
      }
    } catch (error) {
      toast.error('Failed to save founder')
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Founder' : 'Create Founder'}</CardTitle>
        <CardDescription>
          {isEditMode ? 'Update founder details' : 'Add a new founder to your team'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-3">Founder Image *</label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imageUrl ? (
                <div className="relative w-full max-w-sm mx-auto">
                  <Image
                    src={imageUrl}
                    alt="Founder preview"
                    width={400}
                    height={400}
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
             <input type="hidden" {...register('image')} />
            {errors.image && <p className="text-sm text-destructive mt-2">{errors.image}</p>}
            {validationErrors.image && (
              <p className="text-sm text-destructive mt-2">{validationErrors.image.message}</p>
            )}
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name *
            </label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter founder name"
              disabled={isLoading}
            />
            {validationErrors.name && (
              <p className="text-sm text-destructive mt-1">{validationErrors.name.message}</p>
            )}
          </div>

          {/* Role Field */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-2">
              Role *
            </label>
            <Input
              id="role"
              {...register('role')}
              placeholder="e.g., Founder & CEO"
              disabled={isLoading}
            />
            {validationErrors.role && (
              <p className="text-sm text-destructive mt-1">{validationErrors.role.message}</p>
            )}
          </div>

          {/* Bio Field */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium mb-2">
              Biography *
            </label>
            <textarea
              id="bio"
              {...register('bio')}
              placeholder="Enter founder biography (max 500 characters)"
              rows={8}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              disabled={isLoading}
            />
            {validationErrors.bio && (
              <p className="text-sm text-destructive mt-1">{validationErrors.bio.message}</p>
            )}
          </div>

          {/* Order Field */}
          <div>
            <label htmlFor="order" className="block text-sm font-medium mb-2">
              Display Order
            </label>
            <Input
              id="order"
              type="number"
              {...register('order', { valueAsNumber: true })}
              placeholder="0"
              min="0"
              disabled={isLoading}
            />
            {validationErrors.order && (
              <p className="text-sm text-destructive mt-1">{validationErrors.order.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : isEditMode ? 'Update Founder' : 'Create Founder'}
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
