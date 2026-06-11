'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { InstagramInput, instagramSchema } from '@/lib/validations/instagram';
import { createInstagram, updateInstagram } from '@/actions/instagram';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface InstagramFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  instagramId?: string;
}

export function InstagramForm({ mode, initialData, instagramId }: InstagramFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InstagramInput>({
    resolver: zodResolver(instagramSchema),
    defaultValues: {
      handle: initialData?.handle || '',
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmit = async (data: InstagramInput) => {
    setIsLoading(true);
    try {
      let result;
      if (mode === 'edit') {
        result = await updateInstagram(instagramId!, data);
      } else {
        result = await createInstagram(data);
      }

      if (result.success) {
        toast.success(
          `Instagram link ${mode === 'create' ? 'created' : 'updated'} successfully`
        );
        router.replace('/dashboard/social-media/instagram');
      } else {
        toast.error(result.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to save Instagram link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Create Instagram Link' : 'Edit Instagram Link'}
        </CardTitle>
        <CardDescription>
          {mode === 'create'
            ? 'Add a new Instagram profile link'
            : 'Update Instagram link details'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Handle */}
          <div>
            <label htmlFor="handle" className="block text-sm font-medium mb-2">
              Instagram Handle *
            </label>
            <Input
              id="handle"
              {...register('handle')}
              placeholder="@yourhandle or username"
              disabled={isLoading}
            />
            {errors.handle && (
              <p className="text-sm text-destructive mt-1">{errors.handle.message}</p>
            )}
          </div>

          {/* Active Status */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Status</label>
            <div className="flex items-center space-x-3 p-4 border border-border rounded-lg bg-background">
              <input
                type="checkbox"
                id="isActive"
                {...register('isActive')}
                className="w-5 h-5 rounded border-border accent-primary"
              />
              <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
                Mark as active
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1 cursor-pointer">
              {isLoading
                ? 'Saving...'
                : mode === 'create'
                  ? 'Create Instagram Link'
                  : 'Update Instagram Link'}
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
