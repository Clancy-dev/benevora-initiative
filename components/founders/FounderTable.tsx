'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { deleteFounder } from '@/actions/founders';
import toast from 'react-hot-toast';

interface Founder {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  order: number;
}

interface FounderTableProps {
  founders: Founder[];
}

export function FounderTable({ founders }: FounderTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [founderToDelete, setFounderToDelete] = useState<Founder | null>(null);

  const handleDelete = async (founder: Founder) => {
    setIsDeleting(founder.id);

    try {
      const result = await deleteFounder(founder.id);

      if (result.success) {
        toast.success('Founder has been moved to trash.')
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete founder')
    
      }
    } catch (error) {
      toast.error('Failed to delete founder')
    } finally {
      setIsDeleting(null);
      setFounderToDelete(null);
    }
  };

  if (founders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">No Founders Found</p>
          <p className="text-sm text-foreground/60 mb-4">Start by creating your first founder</p>
          <Button className="cursor-pointer" onClick={() => router.push('/dashboard/founders/create')}>
            Create Founder
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Image</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Bio</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order</th>
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
                  <td className="px-6 py-4 text-sm text-foreground/70 max-w-xs truncate">
                    {founder.bio}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/80">{founder.order}</td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/founders/${founder.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/founders/edit?id=${founder.id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setFounderToDelete(founder)}
                          className="text-red-600 focus:bg-red-50 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!founderToDelete} onOpenChange={(open) => !open && setFounderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Founder?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{founderToDelete?.name}</span>? This action can be undone from the trash.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => founderToDelete && handleDelete(founderToDelete)}
              disabled={isDeleting === founderToDelete?.id}
              className="bg-destructive text-background hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting === founderToDelete?.id ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
