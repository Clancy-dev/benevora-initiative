import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { getAllMaps } from '@/actions/map';
import { MapTable } from '@/components/MapTable';
import Link from 'next/link';

interface MapEmbed {
  id: string;
  embedUrl: string;
  order: number;
}

export default async function MapPage() {
  const result = await getAllMaps();

  const maps: MapEmbed[] =
    result?.success ? (result.data as MapEmbed[]) : [];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Map Embeds
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your Google Maps embeddings
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard/contact-information/location/map/trash">
              <Button variant="outline" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Trash
              </Button>
            </Link>

            <Link href="/dashboard/contact-information/location/map/create">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Map
              </Button>
            </Link>
          </div>
        </div>

        {/* Map Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>All Maps</CardTitle>
            <CardDescription>
              {maps.length} map{maps.length !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>

          <CardContent>
            {maps.length === 0 ? (
              <p className="text-muted-foreground text-center py-10">
                No maps found.
              </p>
            ) : (
              <MapTable maps={maps} />
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}