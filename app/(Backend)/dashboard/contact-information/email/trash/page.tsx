'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
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
import { getDeletedEmails, permanentDeleteEmail, restoreEmail } from '@/actions/email';

interface Email {
  id: string;
  email: string;
  order: number;
  deletedAt: Date;
}

export default function EmailTrashPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emailToDelete, setEmailToDelete] = useState<Email | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [emailToRestore, setEmailToRestore] = useState<Email | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDeletedEmails = async () => {
      try {
        const result = await getDeletedEmails();
        if (result.success && result.data) {
          setEmails(result.data as Email[]);
        }
      } catch (error) {
        toast.error('Failed to load deleted emails');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeletedEmails();
  }, []);

  const handleRestore = async (email: Email) => {
    setIsRestoring(true);
    try {
      const result = await restoreEmail(email.id);
      if (result.success) {
        toast.success('Email restored successfully');
        setEmails(emails.filter((e) => e.id !== email.id));
      } else {
        toast.error(result.error || 'Failed to restore email');
      }
    } catch (error) {
      toast.error('Failed to restore email');
    } finally {
      setIsRestoring(false);
      setEmailToRestore(null);
    }
  };

  const handlePermanentDelete = async (email: Email) => {
    setIsDeleting(true);
    try {
      const result = await permanentDeleteEmail(email.id);
      if (result.success) {
        toast.success('Email permanently deleted');
        setEmails(emails.filter((e) => e.id !== email.id));
      } else {
        toast.error(result.error || 'Failed to permanently delete email');
      }
    } catch (error) {
      toast.error('Failed to permanently delete email');
    } finally {
      setIsDeleting(false);
      setEmailToDelete(null);
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
        <Link href="/dashboard/contact-information/email" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trash</h1>
          <p className="text-foreground/60 mt-1">Restore or permanently delete emails</p>
        </div>
      </div>

      {emails.length === 0 ? (
        <div className="flex items-center justify-center h-64 rounded-lg border border-dashed border-border bg-muted/30">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground mb-2">No Deleted Emails</p>
            <p className="text-sm text-foreground/60">The trash is empty</p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden bg-background">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Deleted On</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {emails.map((email) => (
                  <tr key={email.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">{email.email}</td>
                    <td className="px-6 py-4 text-sm text-foreground/80">{email.order}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {new Date(email.deletedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEmailToRestore(email)}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setEmailToDelete(email)}
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

      <AlertDialog open={!!emailToRestore} onOpenChange={(open) => !open && setEmailToRestore(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Restore Email?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to restore <span className="font-semibold">{emailToRestore?.email}</span>? It will be added back to your emails list.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => emailToRestore && handleRestore(emailToRestore)}
              disabled={isRestoring}
              className="bg-green-600 hover:bg-green-700"
            >
              {isRestoring ? 'Restoring...' : 'Restore'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!emailToDelete} onOpenChange={(open) => !open && setEmailToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Permanently Delete Email?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete <span className="font-semibold">{emailToDelete?.email}</span>? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => emailToDelete && handlePermanentDelete(emailToDelete)}
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
