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
import { createLocation, updateLocation } from '@/actions/location';

type LocationFormData = {
  organizationName: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  country: string;
  order: number;
};

interface LocationFormProps {
  initialData?: {
    id: string;
    organizationName: string;
    addressLine1: string;
    addressLine2: string;
    postalCode: string;
    city: string;
    country: string;
    order?: number;
  };
  isEditMode?: boolean;
}

export function LocationForm({ initialData, isEditMode = false }: LocationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: initialData || {
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
      let result;
      if (isEditMode && initialData) {
        result = await updateLocation(initialData.id, data);
      } else {
        result = await createLocation(data);
      }

      if (result.success) {
        toast.success(isEditMode ? 'Location updated successfully' : 'Location created successfully');
        router.replace('/dashboard/contact-information/location/location-address');
      } else {
        toast.error(result.error || 'Failed to save location');
      }
    } catch (error) {
      toast.error('Failed to save location');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Location' : 'Add Location'}</CardTitle>
        <CardDescription>
          {isEditMode ? 'Update location details' : 'Add a new location'}
        </CardDescription>
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
              placeholder="Organization name"
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
              placeholder="Street address"
              disabled={isLoading}
            />
            {errors.addressLine1 && (
              <p className="text-sm text-destructive mt-1">{errors.addressLine1.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="addressLine2" className="block text-sm font-medium mb-2">
              Address Line 2
            </label>
            <Input
              id="addressLine2"
              {...register('addressLine2')}
              placeholder="Additional address"
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
                placeholder="City"
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
                placeholder="Postal code"
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
              placeholder="Country"
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
              {isLoading ? 'Saving...' : isEditMode ? 'Update Location' : 'Add Location'}
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
