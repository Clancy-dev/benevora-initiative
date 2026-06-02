'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { workSchema } from '@/lib/validations/work';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createWork, updateWork } from '@/actions/work';
import toast from 'react-hot-toast';

type WorkFormData = typeof workSchema._type;

interface WorkFormProps {
  initialData?: {
    id: string;
    caption: string;
    image: string;
    order?: number;
  };
  isEditMode?: boolean;
}

export function WorkForm({ initialData, isEditMode = false }: WorkFormProps) {
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
  } = useForm<WorkFormData>({
    resolver: zodResolver(workSchema),
    defaultValues: initialData || {
      caption: '',
      image: '',
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

  const onSubmit = async (data: WorkFormData) => {
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
        result = await updateWork(initialData.id, submitData);
      } else {
        result = await createWork(submitData);
      }

      if (result.success) {
        toast.success(isEditMode ? 'Work has been updated successfully.' : 'Work has been created successfully.')
        router.replace('/dashboard/work');
      } else {
        toast.error(typeof result.error === 'string' ? result.error : 'Something went wrong')
      }
    } catch (error) {
      toast.error('Failed to save work')
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Our Work' : 'Create Our Work'}</CardTitle>
        <CardDescription>
          {isEditMode ? 'Update work details' : 'Add a new work/gallery item'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-3">Work Image *</label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imageUrl ? (
                <div className="relative w-full max-w-sm mx-auto">
                  <Image
                    src={imageUrl}
                    alt="Work preview"
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
            <input type="hidden" value={imageUrl} {...register('image')}/>
            {errors.image && <p className="text-sm text-destructive mt-2">{errors.image}</p>}
            {validationErrors.image && (
              <p className="text-sm text-destructive mt-2">{validationErrors.image.message}</p>
            )}
          </div>

          {/* Caption Field */}
          <div>
            <label htmlFor="caption" className="block text-sm font-medium mb-2">
              Caption *
            </label>
            <Input
              id="caption"
              {...register('caption')}
              placeholder="e.g., Community Outreach Program"
              disabled={isLoading}
            />
            {validationErrors.caption && (
              <p className="text-sm text-destructive mt-1">{validationErrors.caption.message}</p>
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
            <Button type="submit" disabled={isLoading} className="flex-1 cursor-pointer">
              {isLoading ? 'Saving...' : isEditMode ? 'Update Work' : 'Create Work'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
