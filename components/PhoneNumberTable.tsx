'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import toast from 'react-hot-toast';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { deletePhoneNumber } from '@/actions/phone-number';

interface PhoneNumber {
  id: string;
  phoneNumber: string;
  order: number;
}

interface PhoneNumberTableProps {
  phoneNumbers: PhoneNumber[];
}

export function PhoneNumberTable({ phoneNumbers }: PhoneNumberTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [phoneToDelete, setPhoneToDelete] = useState<PhoneNumber | null>(null);

  const handleDelete = async (phone: PhoneNumber) => {
    setIsDeleting(phone.id);

    try {
      const result = await deletePhoneNumber(phone.id);

      if (result.success) {
        toast.success('Phone number deleted and moved to trash');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete phone number');
      }
    } catch (error) {
      toast.error('Failed to delete phone number');
    } finally {
      setIsDeleting(null);
      setPhoneToDelete(null);
    }
  };

  if (phoneNumbers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">No Phone Numbers Found</p>
          <p className="text-sm text-foreground/60 mb-4">Start by creating your first phone number</p>
          <Button onClick={() => router.push('/dashboard/contact-information/phone-number/create')}>
            Create Phone Number
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Phone Number</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {phoneNumbers.map((phone) => (
                <tr key={phone.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{phone.phoneNumber}</td>
                  <td className="px-6 py-4 text-sm text-foreground/80">{phone.order}</td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/contact-information/phone-number/${phone.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/contact-information/phone-number/edit?id=${phone.id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setPhoneToDelete(phone)}
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

      <AlertDialog open={!!phoneToDelete} onOpenChange={(open) => !open && setPhoneToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Phone Number?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{phoneToDelete?.phoneNumber}</span>? This action can be undone from the trash.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => phoneToDelete && handleDelete(phoneToDelete)}
              disabled={isDeleting === phoneToDelete?.id}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting === phoneToDelete?.id ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
