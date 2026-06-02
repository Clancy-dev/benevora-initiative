import { getFounder } from '@/actions/founders';
import { FounderForm } from '@/components/founders/FounderForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Edit Founder',
  description: 'Edit founder information',
};

interface EditPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function EditFounderPage({ searchParams }: EditPageProps) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const result = await getFounder(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const founder = result.data;

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/founders" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Founder</h1>
          <p className="text-foreground/60 mt-1">Update {founder.name}&apos;s information</p>
        </div>
      </div>

      {/* Form */}
      <FounderForm
        initialData={{
          id: founder.id,
          name: founder.name,
          role: founder.role,
          image: founder.image,
          bio: founder.bio,
          order: founder.order,
        }}
        isEditMode={true}
      />
    </div>
  );
}
