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
import { ChevronLeft } from 'lucide-react';
import { createPhoneNumber } from '@/actions/phone-number';

type PhoneNumberFormData = {
  phoneNumber: string;
  order: number;
};

export default function CreatePhoneNumberPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneNumberFormData>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumber: '',
      order: 0,
    },
  });

  const onSubmit = async (data: PhoneNumberFormData) => {
    setIsLoading(true);
    try {
      const result = await createPhoneNumber(data);
      if (result.success) {
        toast.success('Phone number created successfully');
        router.replace('/dashboard/contact-information/phone-number');
      } else {
        toast.error(result.error || 'Failed to create phone number');
      }
    } catch (error) {
      toast.error('Failed to create phone number');
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
            <CardTitle>Create Phone Number</CardTitle>
            <CardDescription>Add a new contact phone number</CardDescription>
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
              placeholder="+256 707015676"
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
              {isLoading ? 'Creating...' : 'Create Phone Number'}
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
