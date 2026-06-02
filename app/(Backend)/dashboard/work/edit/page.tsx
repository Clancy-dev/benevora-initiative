'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getWork } from '@/actions/work';
import { WorkForm } from '@/components/work/WorkForm';
import toast from 'react-hot-toast';

type Work = {
  id: string;
  caption: string;
  image: string;
  order: number;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function EditWorkPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [work, setWork] = useState<Work | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast.error('No work ID provided')
      return;
    }

    const fetchWork = async () => {
      try {
        const result = await getWork(id);
        if (result.success) {
          setWork(result.data ?? null);
        } else {
          toast.error('Work not found')
        }
      } catch (error) {
        toast.error('Failed to fetch work')

      } finally {
        setIsLoading(false);
      }
    };

    fetchWork();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/dashboard/work">
            <Button variant="outline">← Back to Works</Button>
          </Link>
          <p className="mt-4 text-destructive">Work not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard/work">
            <Button variant="outline">← Back to Works</Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mt-4">Edit Work</h1>
          <p className="text-muted-foreground mt-2">Update your gallery item</p>
        </div>

        <WorkForm initialData={work} isEditMode={true} />
      </div>
    </div>
  );
}
