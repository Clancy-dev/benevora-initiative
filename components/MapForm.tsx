'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { mapSchema } from '@/lib/validations/map';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createMap, updateMap } from '@/actions/map';

type MapFormData = {
  embedUrl: string;
  order: number;
};

interface MapFormProps {
  initialData?: {
    id: string;
    embedUrl: string;
    order?: number;
  };
  isEditMode?: boolean;
}

export function MapForm({ initialData, isEditMode = false }: MapFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MapFormData>({
    resolver: zodResolver(mapSchema),
    defaultValues: initialData || {
      embedUrl: '',
      order: 0,
    },
  });

  const onSubmit = async (data: MapFormData) => {
    setIsLoading(true);

    try {
      let result;
      if (isEditMode && initialData) {
        result = await updateMap(initialData.id, data);
      } else {
        result = await createMap(data);
      }

      if (result.success) {
        toast.success(isEditMode ? 'Map updated successfully' : 'Map created successfully');
        router.replace('/dashboard/contact-information/location/map');
      } else {
        toast.error(result.error || 'Failed to save map');
      }
    } catch (error) {
      toast.error('Failed to save map');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Map' : 'Add Map'}</CardTitle>
        <CardDescription>
          {isEditMode ? 'Update map embed URL' : 'Add a Google Maps embed URL'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="embedUrl" className="block text-sm font-medium mb-2">
              Google Maps Embed URL *
            </label>
            <Input
              id="embedUrl"
              {...register('embedUrl')}
              placeholder="https://www.google.com/maps/embed?pb=..."
              disabled={isLoading}
            />
            <p className="text-xs text-foreground/60 mt-2">
              Copy the embed URL from Google Maps share/embed option
            </p>
            {errors.embedUrl && (
              <p className="text-sm text-destructive mt-1">{errors.embedUrl.message}</p>
            )}
          </div>

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

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Saving...' : isEditMode ? 'Update Map' : 'Add Map'}
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
