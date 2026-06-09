'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { emailSchema } from '@/lib/validations/email';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createEmail, updateEmail } from '@/actions/email';

type EmailFormData = {
  email: string;
  order: number;
};

interface EmailFormProps {
  initialData?: {
    id: string;
    email: string;
    order?: number;
  };
  isEditMode?: boolean;
}

export function EmailForm({ initialData, isEditMode = false }: EmailFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: initialData || {
      email: '',
      order: 0,
    },
  });

  const onSubmit = async (data: EmailFormData) => {
    setIsLoading(true);

    try {
      let result;
      if (isEditMode && initialData) {
        result = await updateEmail(initialData.id, data);
      } else {
        result = await createEmail(data);
      }

      if (result.success) {
        toast.success(isEditMode ? 'Email updated successfully' : 'Email created successfully');
        router.replace('/dashboard/contact-information/email');
      } else {
        toast.error(result.error || 'Failed to save email');
      }
    } catch (error) {
      toast.error('Failed to save email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Email' : 'Add Email'}</CardTitle>
        <CardDescription>
          {isEditMode ? 'Update email address' : 'Add a new email address'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address *
            </label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="example@email.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
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
              {isLoading ? 'Saving...' : isEditMode ? 'Update Email' : 'Add Email'}
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
