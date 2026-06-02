'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteFounder, getFounder } from '@/actions/founders';
import toast from 'react-hot-toast';

interface Founder {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function FounderDetailPage({ params: paramsPromise }: PageProps) {
  const [founder, setFounder] = useState<Founder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const [params, setParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await paramsPromise;
      setParams(unwrappedParams);
    };
    unwrapParams();
  }, [paramsPromise]);

  useEffect(() => {
    if (!params) return;

    const fetchFounder = async () => {
      try {
        const result = await getFounder(params.id);

        if (result.success && result.data) {
          setFounder(result.data as Founder);
        } else {
          toast.error('Founder not found');
          router.push('/dashboard/founders');
        }
      } catch (error) {
        toast.error('Failed to load founder');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFounder();
  }, [params, router, toast]);

  const handleDelete = async () => {
    if (!founder) return;

    setIsDeleting(true);

    try {
      const result = await deleteFounder(founder.id);

      if (result.success) {
        toast.success('Founder has been moved to trash.')
        router.push('/dashboard/founders');
      } else {
        toast.error(result.error || 'Failed to delete founder')
      }
    } catch (error) {
      toast.error('Failed to delete founder')
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!founder) {
    return null;
  }

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/founders" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{founder.name}</h1>
            <p className="text-foreground/60 mt-1">{founder.role}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/founders/edit?id=${founder.id}`}>
            <Button size="sm" className='cursor-pointer'>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="destructive"
            className='cursor-pointer'
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Image */}
        <div className="md:col-span-1">
          <div className="sticky top-6 space-y-4">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-border bg-muted">
              <Image
                src={founder.image}
                alt={founder.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Bio Section */}
          <div className="p-6 rounded-lg border border-border bg-muted/30">
            <h2 className="text-lg font-bold text-foreground mb-3">Biography</h2>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{founder.bio}</p>
          </div>

          {/* Information Section */}
          <div className="p-6 rounded-lg border border-border bg-muted/30 space-y-4">
            <h2 className="text-lg font-bold text-foreground mb-4">Details</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-foreground/60">Display Order</p>
                <p className="text-lg font-semibold text-foreground">{founder.order}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60">Role</p>
                <p className="text-lg font-semibold text-foreground">{founder.role}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-foreground/60">Created</p>
              <p className="text-sm text-foreground">
                {new Date(founder.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-foreground/60">Last Updated</p>
              <p className="text-sm text-foreground">
                {new Date(founder.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Founder?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{founder.name}</span>? This action can be undone from the trash.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-background hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
