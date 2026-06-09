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
import { deleteEmail } from '@/actions/email';

interface Email {
  id: string;
  email: string;
  order: number;
}

interface EmailTableProps {
  emails: Email[];
}

export function EmailTable({ emails }: EmailTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [emailToDelete, setEmailToDelete] = useState<Email | null>(null);

  const handleDelete = async (email: Email) => {
    setIsDeleting(email.id);

    try {
      const result = await deleteEmail(email.id);

      if (result.success) {
        toast.success('Email deleted and moved to trash');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete email');
      }
    } catch (error) {
      toast.error('Failed to delete email');
    } finally {
      setIsDeleting(null);
      setEmailToDelete(null);
    }
  };

  if (emails.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">No Emails Found</p>
          <p className="text-sm text-foreground/60 mb-4">Start by creating your first email</p>
          <Button onClick={() => router.push('/dashboard/contact-information/email/create')}>
            Create Email
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {emails.map((email) => (
                <tr key={email.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{email.email}</td>
                  <td className="px-6 py-4 text-sm text-foreground/80">{email.order}</td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/contact-information/email/${email.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/contact-information/email/edit?id=${email.id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setEmailToDelete(email)}
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

      <AlertDialog open={!!emailToDelete} onOpenChange={(open) => !open && setEmailToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Email?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{emailToDelete?.email}</span>? This action can be undone from the trash.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => emailToDelete && handleDelete(emailToDelete)}
              disabled={isDeleting === emailToDelete?.id}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting === emailToDelete?.id ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
