'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { XInput, xSchema } from '@/lib/validations/x';
import { createX, updateX } from '@/actions/x';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface XFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  xId?: string;
}

export function XForm({ mode, initialData, xId }: XFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<XInput>({
    resolver: zodResolver(xSchema),
    defaultValues: {
      handle: initialData?.handle || '',
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmit = async (data: XInput) => {
    setIsLoading(true);
    try {
      let result;
      if (mode === 'edit') {
        result = await updateX(xId!, data);
      } else {
        result = await createX(data);
      }

      if (result.success) {
        toast.success(
          `X link ${mode === 'create' ? 'created' : 'updated'} successfully`
        );
        router.replace('/dashboard/social-media/x');
      } else {
        toast.error(result.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to save X link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Create X Link' : 'Edit X Link'}
        </CardTitle>
        <CardDescription>
          {mode === 'create'
            ? 'Add a new X (Twitter) profile link'
            : 'Update X link details'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Handle */}
          <div>
            <label htmlFor="handle" className="block text-sm font-medium mb-2">
              X Handle *
            </label>
            <Input
              id="handle"
              {...register('handle')}
              placeholder="@yourhandle"
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
                  ? 'Create X Link'
                  : 'Update X Link'}
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
