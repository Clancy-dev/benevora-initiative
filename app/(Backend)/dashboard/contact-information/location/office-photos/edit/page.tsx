import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getOfficePhoto } from '@/actions/office-photos';
import { OfficePhotoForm } from '@/components/OfficePhotoForm';

export const metadata: Metadata = {
  title: 'Edit Office Photo - Admin',
  description: 'Edit an existing office photo',
};

interface EditOfficePhotoPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function EditOfficePhotoPage({ searchParams }: EditOfficePhotoPageProps) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const result = await getOfficePhoto(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const photo = result.data;

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/contact-information/location/office-photos" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Office Photo</h1>
          <p className="text-foreground/60 mt-1">Update office photo details</p>
        </div>
      </div>

      {/* Form */}
      <OfficePhotoForm
        initialData={{
          id: photo.id,
          image: photo.image,
          order: photo.order,
        }}
        isEditMode={true}
      />
    </div>
  );
}
