'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { WhatsappInput, whatsappSchema } from '@/lib/validations/whatsapp';
import { createWhatsapp, updateWhatsapp } from '@/actions/whatsapp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface WhatsappFormProps {
  mode: 'create' | 'edit';
  initialData?: any;
  whatsappId?: string;
}

export function WhatsappForm({ mode, initialData, whatsappId }: WhatsappFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WhatsappInput>({
    resolver: zodResolver(whatsappSchema),
    defaultValues: {
      phoneNumber: initialData?.phoneNumber || '',
      isActive: initialData?.isActive ?? true,
    },
  });

  const onSubmit = async (data: WhatsappInput) => {
    setIsLoading(true);
    try {
      let result;
      if (mode === 'edit') {
        result = await updateWhatsapp(whatsappId!, data);
      } else {
        result = await createWhatsapp(data);
      }

      if (result.success) {
        toast.success(
          `WhatsApp link ${mode === 'create' ? 'created' : 'updated'} successfully`
        );
        router.replace('/dashboard/social-media/whatsapp');
      } else {
        toast.error(result.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to save WhatsApp link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Create WhatsApp Link' : 'Edit WhatsApp Link'}
        </CardTitle>
        <CardDescription>
          {mode === 'create'
            ? 'Add a new WhatsApp contact link'
            : 'Update WhatsApp link details'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
              Phone Number *
            </label>
            <Input
              id="phoneNumber"
              {...register('phoneNumber')}
              placeholder="+1234567890"
              disabled={isLoading}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive mt-1">{errors.phoneNumber.message}</p>
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
                  ? 'Create WhatsApp Link'
                  : 'Update WhatsApp Link'}
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
