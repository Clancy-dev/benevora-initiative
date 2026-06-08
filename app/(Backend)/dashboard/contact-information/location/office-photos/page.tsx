import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllOfficePhotos } from '@/actions/office-photos';
import { OfficePhotoTable } from '@/components/OfficePhotoTable';

export const metadata: Metadata = {
  title: 'Office Photos - Admin',
  description: 'Manage office photos for the Visit Our Office section',
};

export default async function OfficePhotosPage() {
  const result = await getAllOfficePhotos();
  const photos = result.success ? result.data || [] : [];

  const isLimitReached = photos.length >= 3

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Office Photos</h1>
          <p className="text-foreground/60 mt-1">Manage photos for the Visit Our Office section</p>
        </div>
        <div className="flex gap-3">
                    <Link href="/dashboard/contact-information/location/office-photos/trash">
                      <Button variant="outline">Trash</Button>
                    </Link>
                    <div className={isLimitReached ? "pointer-events-none opacity-40 blur-[1px]" : ""}>
                   <Link href="/dashboard/contact-information/location/office-photos/create">
                   <Button disabled={isLimitReached}>
                      Add Photo
                   </Button>
                   </Link>
                  </div>
                  </div>

      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Office Photos</CardTitle>
          <CardDescription>Manage and organize your office photos</CardDescription>
        </CardHeader>
        <CardContent>
          <OfficePhotoTable photos={photos} />
        </CardContent>
      </Card>
    </div>
  );
}
