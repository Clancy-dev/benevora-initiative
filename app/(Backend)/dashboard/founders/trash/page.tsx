'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { getDeletedFounders, permanentDeleteFounder, restoreFounder } from '@/actions/founders';
import toast from 'react-hot-toast';

interface Founder {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  order: number;
  deletedAt: Date;
}

export default function TrashPage() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [founderToDelete, setFounderToDelete] = useState<Founder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [founderToRestore, setFounderToRestore] = useState<Founder | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDeletedFounders = async () => {
      try {
        const result = await getDeletedFounders();

        if (result.success && result.data) {
          setFounders(result.data as Founder[]);
        } else {
          toast.error('Failed to load deleted founders')
        }
      } catch (error) {
        toast.error('Failed to load deleted founders')
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeletedFounders();
  }, [toast]);

  const handleRestore = async (founder: Founder) => {
    setIsRestoring(true);

    try {
      const result = await restoreFounder(founder.id);

      if (result.success) {
        toast.success('Founder has been restored successfully.')
        setFounders(founders.filter((f) => f.id !== founder.id));
      } else {
        toast.error(result.error || 'Failed to restore founder')
      }
    } catch (error) {
      toast.error('Failed to restore founder')
    } finally {
      setIsRestoring(false);
      setFounderToRestore(null);
    }
  };

  const handlePermanentDelete = async (founder: Founder) => {
    setIsDeleting(true);

    try {
      const result = await permanentDeleteFounder(founder.id);

      if (result.success) {
        toast.success('Founder has been permanently deleted.')
        setFounders(founders.filter((f) => f.id !== founder.id));
      } else {
        toast.error(result.error || 'Failed to permanently delete founder')
      }
    } catch (error) {
      toast.error('Failed to permanently delete founder')
    } finally {
      setIsDeleting(false);
      setFounderToDelete(null);
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

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/founders" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trash</h1>
          <p className="text-foreground/60 mt-1">Restore or permanently delete founders</p>
        </div>
      </div>

      {/* Table or Empty State */}
      {founders.length === 0 ? (
        <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground mb-2">No Deleted Founders</p>
            <p className="text-sm text-foreground/60">The trash is empty</p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden bg-background">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Deleted On</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {founders.map((founder) => (
                  <tr
                    key={founder.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border">
                        <Image
                          src={founder.image}
                          alt={founder.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{founder.name}</td>
                    <td className="px-6 py-4 text-sm text-foreground/80">{founder.role}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {new Date(founder.deletedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setFounderToRestore(founder)}
                          >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setFounderToDelete(founder)}
                            className="text-red-600 focus:bg-red-50 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Permanently Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={!!founderToRestore} onOpenChange={(open) => !open && setFounderToRestore(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Restore Founder?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to restore <span className="font-semibold">{founderToRestore?.name}</span>? They will be added back to your founders list.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => founderToRestore && handleRestore(founderToRestore)}
              disabled={isRestoring}
              className="cursor-pointer"
            >
              {isRestoring ? 'Restoring...' : 'Restore'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Confirmation Dialog */}
      <AlertDialog open={!!founderToDelete} onOpenChange={(open) => !open && setFounderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Permanently Delete Founder?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete <span className="font-semibold">{founderToDelete?.name}</span>? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => founderToDelete && handlePermanentDelete(founderToDelete)}
              disabled={isDeleting}
              className="bg-destructive text-background hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting ? 'Deleting...' : 'Permanently Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
