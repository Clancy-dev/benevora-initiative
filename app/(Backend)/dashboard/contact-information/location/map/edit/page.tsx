'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getMap } from '@/actions/map';
import { MapForm } from '@/components/MapForm';

type MapType = {
  id: string;
  embedUrl: string;
  order: number;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function MapEditPage() {
  const [map, setMap] = useState<MapType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();

  useEffect(() => {
    const fetchMap = async () => {
      if (!id) {
        router.push('/dashboard/contact-information/location/map');
        return;
      }

      try {
        const result = await getMap(id);
        if (result.success && result.data) {
          setMap(result.data);
        }
      } catch (error) {
        console.error('[v0] Error fetching map:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMap();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  if (!map) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-foreground mb-4">Map not found</p>
          <Link href="/dashboard/contact-information/location/map">
            <Button>Back to Maps</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/contact-information/location/map" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Map</h1>
          <p className="text-foreground/60 mt-1">Update map embed URL</p>
        </div>
      </div>

      <MapForm initialData={map} isEditMode={true} />
    </div>
  );
}
