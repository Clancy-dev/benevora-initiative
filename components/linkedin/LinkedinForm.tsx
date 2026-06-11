'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { LinkedinInput, linkedinSchema } from '@/lib/validations/linkedin';
import { createLinkedin, updateLinkedin } from '@/actions/linkedin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LinkedinFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  linkedinId?: string;
}

export function LinkedinForm({ mode, initialData, linkedinId }: LinkedinFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LinkedinInput>({
    resolver: zodResolver(linkedinSchema),
    defaultValues: {
      url: initialData?.url || '',
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmit = async (data: LinkedinInput) => {
    setIsLoading(true);
    try {
      let result;
      if (mode === 'edit') {
        result = await updateLinkedin(linkedinId!, data);
      } else {
        result = await createLinkedin(data);
      }

      if (result.success) {
        toast.success(
          `LinkedIn link ${mode === 'create' ? 'created' : 'updated'} successfully`
        );
        router.replace('/dashboard/social-media/linkedin');
      } else {
        toast.error(result.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to save LinkedIn link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Create LinkedIn Link' : 'Edit LinkedIn Link'}
        </CardTitle>
        <CardDescription>
          {mode === 'create'
            ? 'Add a new LinkedIn profile link'
            : 'Update LinkedIn link details'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              LinkedIn URL *
            </label>
            <Input
              id="url"
              {...register('url')}
              placeholder="https://linkedin.com/in/yourprofile"
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
                  ? 'Create LinkedIn Link'
                  : 'Update LinkedIn Link'}
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
