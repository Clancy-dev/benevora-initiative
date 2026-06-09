'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { locationSchema } from '@/lib/validations/location';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { createLocation } from '@/actions/location';

type LocationFormData = {
  organizationName: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  country: string;
  order: number;
};

export default function CreateLocationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      organizationName: '',
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
      city: '',
      country: '',
      order: 0,
    },
  });

  const onSubmit = async (data: LocationFormData) => {
    setIsLoading(true);
    try {
      const result = await createLocation(data);
      if (result.success) {
        toast.success('Location created successfully');
        router.replace('/dashboard/contact-information/location/location-address');
      } else {
        toast.error(result.error || 'Failed to create location');
      }
    } catch (error) {
      toast.error('Failed to create location');
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
            <CardTitle>Create Location</CardTitle>
            <CardDescription>Add a new office location</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="organizationName" className="block text-sm font-medium mb-2">
              Organization Name *
            </label>
            <Input
              id="organizationName"
              {...register('organizationName')}
              placeholder="Benevora Initiative"
              disabled={isLoading}
            />
            {errors.organizationName && (
              <p className="text-sm text-destructive mt-1">{errors.organizationName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="addressLine1" className="block text-sm font-medium mb-2">
              Address Line 1 *
            </label>
            <Input
              id="addressLine1"
              {...register('addressLine1')}
              placeholder="Plot 27, Kasingo Road"
              disabled={isLoading}
            />
            {errors.addressLine1 && (
              <p className="text-sm text-destructive mt-1">{errors.addressLine1.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="addressLine2" className="block text-sm font-medium mb-2">
              Address Line 2 *
            </label>
            <Input
              id="addressLine2"
              {...register('addressLine2')}
              placeholder="P.O. Box 1045"
              disabled={isLoading}
            />
            {errors.addressLine2 && (
              <p className="text-sm text-destructive mt-1">{errors.addressLine2.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2">
                City *
              </label>
              <Input
                id="city"
                {...register('city')}
                placeholder="Hoima"
                disabled={isLoading}
              />
              {errors.city && (
                <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium mb-2">
                Postal Code *
              </label>
              <Input
                id="postalCode"
                {...register('postalCode')}
                placeholder="00256"
                disabled={isLoading}
              />
              {errors.postalCode && (
                <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-2">
              Country *
            </label>
            <Input
              id="country"
              {...register('country')}
              placeholder="Uganda"
              disabled={isLoading}
            />
            {errors.country && (
              <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
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
              {isLoading ? 'Creating...' : 'Create Location'}
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
