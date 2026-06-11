'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { FacebookInput, facebookSchema } from '@/lib/validations/facebook';
import { createFacebook, updateFacebook } from '@/actions/facebook';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FacebookFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  facebookId?: string;
}

export function FacebookForm({ mode, initialData, facebookId }: FacebookFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FacebookInput>({
    resolver: zodResolver(facebookSchema),
    defaultValues: {
      url: initialData?.url || '',
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmit = async (data: FacebookInput) => {
    setIsLoading(true);
    try {
      let result;
      if (mode === 'edit') {
        result = await updateFacebook(facebookId!, data);
      } else {
        result = await createFacebook(data);
      }

      if (result.success) {
        toast.success(
          `Facebook link ${mode === 'create' ? 'created' : 'updated'} successfully`
        );
        router.replace('/dashboard/social-media/facebook');
      } else {
        toast.error(result.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to save Facebook link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Create Facebook Link' : 'Edit Facebook Link'}
        </CardTitle>
        <CardDescription>
          {mode === 'create'
            ? 'Add a new Facebook page link'
            : 'Update Facebook link details'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              Facebook URL *
            </label>
            <Input
              id="url"
              {...register('url')}
              placeholder="https://facebook.com/yourpage"
              disabled={isLoading}
            />
            {errors.url && (
              <p className="text-sm text-destructive mt-1">{errors.url.message}</p>
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
                  ? 'Create Facebook Link'
                  : 'Update Facebook Link'}
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
