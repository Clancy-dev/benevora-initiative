import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { getAllLocations } from '@/actions/location';
import { LocationTable } from '@/components/LocationTable';
import Link from 'next/link';

interface Location {
  id: string;
  organizationName: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  country: string;
  order: number;
}

export default async function LocationPage() {
  const result = await getAllLocations();

  const locations: Location[] =
    result?.success ? (result.data as Location[]) : [];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Office Locations
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your office locations
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard/contact-information/location/location-address/trash">
              <Button variant="outline" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Trash
              </Button>
            </Link>

            <Link href="/dashboard/contact-information/location/location-address/create">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Location
              </Button>
            </Link>
          </div>
        </div>

        {/* Location Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>All Locations</CardTitle>
            <CardDescription>
              {locations.length} location{locations.length !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>

          <CardContent>
            {locations.length === 0 ? (
              <p className="text-muted-foreground text-center py-10">
                No locations found.
              </p>
            ) : (
              <LocationTable locations={locations} />
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}