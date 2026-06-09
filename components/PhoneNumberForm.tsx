'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { phoneNumberSchema } from '@/lib/validations/phone-number';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createPhoneNumber, updatePhoneNumber } from '@/actions/phone-number';

type PhoneNumberFormData = {
  phoneNumber: string;
  order: number;
};

interface PhoneNumberFormProps {
  initialData?: {
    id: string;
    phoneNumber: string;
    order?: number;
  };
  isEditMode?: boolean;
}

export function PhoneNumberForm({ initialData, isEditMode = false }: PhoneNumberFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneNumberFormData>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: initialData || {
      phoneNumber: '',
      order: 0,
    },
  });

  const onSubmit = async (data: PhoneNumberFormData) => {
    setIsLoading(true);

    try {
      let result;
      if (isEditMode && initialData) {
        result = await updatePhoneNumber(initialData.id, data);
      } else {
        result = await createPhoneNumber(data);
      }

      if (result.success) {
        toast.success(isEditMode ? 'Phone number updated successfully' : 'Phone number created successfully');
        router.replace('/dashboard/contact-information/phone-number');
      } else {
        toast.error(result.error || 'Failed to save phone number');
      }
    } catch (error) {
      toast.error('Failed to save phone number');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Phone Number' : 'Add Phone Number'}</CardTitle>
        <CardDescription>
          {isEditMode ? 'Update phone number' : 'Add a new phone number'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
              Phone Number *
            </label>
            <Input
              id="phoneNumber"
              {...register('phoneNumber')}
              placeholder="+256 707 015 676"
              disabled={isLoading}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive mt-1">{errors.phoneNumber.message}</p>
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
              {isLoading ? 'Saving...' : isEditMode ? 'Update Phone Number' : 'Add Phone Number'}
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
