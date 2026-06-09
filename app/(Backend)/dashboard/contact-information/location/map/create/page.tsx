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
import { ChevronLeft } from 'lucide-react';
import { createMap } from '@/actions/map';

type MapFormData = {
  embedUrl: string;
  order: number;
};

export default function CreateMapPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MapFormData>({
    resolver: zodResolver(mapSchema),
    defaultValues: {
      embedUrl: '',
      order: 0,
    },
  });

  const onSubmit = async (data: MapFormData) => {
    setIsLoading(true);
    try {
      const result = await createMap(data);
      if (result.success) {
        toast.success('Map created successfully');
        router.replace('/dashboard/contact-information/location/map');
      } else {
        toast.error(result.error || 'Failed to create map');
      }
    } catch (error) {
      toast.error('Failed to create map');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="h-auto p-0 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create Map</CardTitle>
            <CardDescription>Add a Google Maps embed URL</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="embedUrl" className="block text-sm font-medium mb-2">
              Google Maps Embed URL *
            </label>
            <textarea
              id="embedUrl"
              {...register('embedUrl')}
              placeholder="Paste the Google Maps embed URL here"
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            {errors.embedUrl && (
              <p className="text-sm text-destructive mt-1">{errors.embedUrl.message}</p>
            )}
            <p className="text-xs text-foreground/50 mt-2">
              Get the embed code from Google Maps: Right-click location → Share → Embed a map → Copy iframe src
            </p>
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
              {isLoading ? 'Creating...' : 'Create Map'}
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
      </div>
    </div>
  );
}
