'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
import Link from 'next/link';
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
import { getDeletedPhoneNumbers, permanentDeletePhoneNumber, restorePhoneNumber } from '@/actions/phone-number';

interface PhoneNumber {
  id: string;
  phoneNumber: string;
  order: number;
  deletedAt: Date;
}

export default function PhoneTrashPage() {
  const [phones, setPhones] = useState<PhoneNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneToDelete, setPhoneToDelete] = useState<PhoneNumber | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [phoneToRestore, setPhoneToRestore] = useState<PhoneNumber | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    const fetchDeletedPhones = async () => {
      try {
        const result = await getDeletedPhoneNumbers();
        if (result.success && result.data) {
          setPhones(result.data as PhoneNumber[]);
        }
      } catch (error) {
        toast.error('Failed to load deleted phone numbers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeletedPhones();
  }, []);

  const handleRestore = async (phone: PhoneNumber) => {
    setIsRestoring(true);
    try {
      const result = await restorePhoneNumber(phone.id);
      if (result.success) {
        toast.success('Phone number restored successfully');
        setPhones(phones.filter((p) => p.id !== phone.id));
      } else {
        toast.error(result.error || 'Failed to restore phone number');
      }
    } catch (error) {
      toast.error('Failed to restore phone number');
    } finally {
      setIsRestoring(false);
      setPhoneToRestore(null);
    }
  };

  const handlePermanentDelete = async (phone: PhoneNumber) => {
    setIsDeleting(true);
    try {
      const result = await permanentDeletePhoneNumber(phone.id);
      if (result.success) {
        toast.success('Phone number permanently deleted');
        setPhones(phones.filter((p) => p.id !== phone.id));
      } else {
        toast.error(result.error || 'Failed to permanently delete phone number');
      }
    } catch (error) {
      toast.error('Failed to permanently delete phone number');
    } finally {
      setIsDeleting(false);
      setPhoneToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/contact-information/phone-number" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trash</h1>
          <p className="text-foreground/60 mt-1">Restore or permanently delete phone numbers</p>
        </div>
      </div>

      {phones.length === 0 ? (
        <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground mb-2">No Deleted Phone Numbers</p>
            <p className="text-sm text-foreground/60">The trash is empty</p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden bg-background">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Phone Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Deleted On</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {phones.map((phone) => (
                  <tr key={phone.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{phone.phoneNumber}</td>
                    <td className="px-6 py-4 text-sm text-foreground/80">{phone.order}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {new Date(phone.deletedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setPhoneToRestore(phone)}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setPhoneToDelete(phone)}
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

      <AlertDialog open={!!phoneToRestore} onOpenChange={(open) => !open && setPhoneToRestore(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Restore Phone Number?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to restore <span className="font-semibold">{phoneToRestore?.phoneNumber}</span>? It will be added back to your phone numbers list.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => phoneToRestore && handleRestore(phoneToRestore)}
              disabled={isRestoring}
              className="bg-green-600 hover:bg-green-700"
            >
              {isRestoring ? 'Restoring...' : 'Restore'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!phoneToDelete} onOpenChange={(open) => !open && setPhoneToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Permanently Delete Phone Number?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete <span className="font-semibold">{phoneToDelete?.phoneNumber}</span>? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => phoneToDelete && handlePermanentDelete(phoneToDelete)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Permanently Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
