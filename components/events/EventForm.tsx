'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EventFormInput, eventFormSchema } from '@/lib/validations/lib';
import { createEvent, updateEvent } from '@/actions/events';
import toast from 'react-hot-toast';

interface EventFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  eventId?: string;
}

export function EventForm({ mode, initialData, eventId }: EventFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(initialData?.image || '');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventFormInput>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      image: initialData?.image || '',
      date: initialData?.date || '',
      order: initialData?.order || 0,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'practice');

      const response = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_URL!, {
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
      toast.error(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (formData: EventFormInput) => {
    if (!imageUrl) {
      toast.error('Please upload an image')
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        image: imageUrl,
      };

      let result;
      if (mode === 'create') {
        result = await createEvent(submitData);
      } else {
        result = await updateEvent(eventId!, submitData);
      }

      if (result.success) {
        toast.success( `Event ${mode === 'create' ? 'created' : 'updated'} successfully`)
        router.replace('/dashboard/events');
      } else {
        toast.error(result.error || 'Something went wrong')
    
      }
    } catch (error) {
      toast.error('Failed to save event')
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Create Event' : 'Edit Event'}</CardTitle>
        <CardDescription>
          {mode === 'create' ? 'Create a new event' : 'Update event details'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-3">Event Image *</label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {imageUrl ? (
                <div className="relative w-full max-w-sm mx-auto">
                  <Image
                    src={imageUrl}
                    alt="Event preview"
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
            {errors.image && (
              <p className="text-sm text-destructive mt-2">{errors.image.message}</p>
            )}
            <input type="hidden" {...register('image')} />
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Event Title *
            </label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter event title"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Enter event description"
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-2">
              Event Date *
            </label>
            <Input
              id="date"
              type="date"
              {...register('date')}
              disabled={isLoading}
            />
            {errors.date && (
              <p className="text-sm text-destructive mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Order */}
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
            {errors.order && (
              <p className="text-sm text-destructive mt-1">{errors.order.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : mode === 'create' ? 'Create Event' : 'Update Event'}
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
