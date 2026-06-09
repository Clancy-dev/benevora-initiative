'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getLocation } from '@/actions/location';
import { LocationForm } from '@/components/LocationForm';

type LocationType = {
  id: string;
  organizationName: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  country: string;
  order: number;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};



export default function LocationEditPage() {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();

  useEffect(() => {
    const fetchLocation = async () => {
      if (!id) {
        router.push('/dashboard/contact-information/location/location-address');
        return;
      }

      try {
        const result = await getLocation(id);
        if (result.success && result.data) {
          setLocation(result.data);
        }
      } catch (error) {
        console.error('[v0] Error fetching location:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-foreground mb-4">Location not found</p>
          <Link href="/dashboard/contact-information/location/location-address">
            <Button>Back to Locations</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/contact-information/location/location-address" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Location</h1>
          <p className="text-foreground/60 mt-1">Update location details</p>
        </div>
      </div>

      <LocationForm initialData={location} isEditMode={true} />
    </div>
  );
}
