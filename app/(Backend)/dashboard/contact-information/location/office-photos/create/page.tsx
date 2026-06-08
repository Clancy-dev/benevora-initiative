import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { OfficePhotoForm } from '@/components/OfficePhotoForm';

export const metadata: Metadata = {
  title: 'Create Office Photo - Admin',
  description: 'Create a new office photo',
};

export default function CreateOfficePhotoPage() {
  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/contact-information/location/office-photos" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Office Photo</h1>
          <p className="text-foreground/60 mt-1">Add a new office photo to your gallery</p>
        </div>
      </div>

      {/* Form */}
      <OfficePhotoForm />
    </div>
  );
}
