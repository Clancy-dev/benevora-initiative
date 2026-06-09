'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { deleteEmail, getEmail } from '@/actions/email';

interface Email {
  id: string;
  email: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function EmailDetailPage() {
  const [email, setEmail] = useState<Email | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const result = await getEmail(id);
        if (result.success && result.data) {
          setEmail(result.data as Email);
        }
      } catch (error) {
        console.error('[v0] Error fetching email:', error);
        toast.error('Failed to load email');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEmail();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!email) return;
    setIsDeleting(true);

    try {
      const result = await deleteEmail(email.id);
      if (result.success) {
        toast.success('Email deleted and moved to trash');
        router.push('/dashboard/contact-information/email');
      } else {
        toast.error(result.error || 'Failed to delete email');
      }
    } catch (error) {
      toast.error('Failed to delete email');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-foreground mb-4">Email not found</p>
          <Link href="/dashboard/contact-information/email">
            <Button>Back to Emails</Button>
          </Link>
        </div>
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
          <h1 className="text-3xl font-bold text-foreground">{email.email}</h1>
          <p className="text-foreground/60 mt-1">Email Details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
            <p className="text-foreground/80">{email.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Display Order</label>
            <p className="text-foreground/80">{email.order}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Created</label>
            <p className="text-foreground/80">{new Date(email.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Last Updated</label>
            <p className="text-foreground/80">{new Date(email.updatedAt).toLocaleDateString()}</p>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Link href={`/dashboard/contact-information/email/edit?id=${email.id}`} className="flex-1">
              <Button className="w-full">Edit Email</Button>
            </Link>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Email?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{email.email}</span>? This action can be undone from the trash.
          </AlertDialogDescription>
          <div className="flex gap-4 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
