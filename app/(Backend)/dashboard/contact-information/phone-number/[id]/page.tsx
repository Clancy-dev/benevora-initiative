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
import { deletePhoneNumber, getPhoneNumber } from '@/actions/phone-number';

interface PhoneNumber {
  id: string;
  phoneNumber: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function PhoneDetailPage() {
  const [phone, setPhone] = useState<PhoneNumber | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const fetchPhone = async () => {
      try {
        const result = await getPhoneNumber(id);
        if (result.success && result.data) {
          setPhone(result.data as PhoneNumber);
        }
      } catch (error) {
        toast.error('Failed to load phone number');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPhone();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!phone) return;
    setIsDeleting(true);

    try {
      const result = await deletePhoneNumber(phone.id);
      if (result.success) {
        toast.success('Phone number deleted and moved to trash');
        router.push('/dashboard/contact-information/phone-number');
      } else {
        toast.error(result.error || 'Failed to delete phone number');
      }
    } catch (error) {
      toast.error('Failed to delete phone number');
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

  if (!phone) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-foreground mb-4">Phone number not found</p>
          <Link href="/dashboard/contact-information/phone-number">
            <Button>Back to Phone Numbers</Button>
          </Link>
        </div>
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
          <h1 className="text-3xl font-bold text-foreground">{phone.phoneNumber}</h1>
          <p className="text-foreground/60 mt-1">Phone Number Details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phone Number Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
            <p className="text-foreground/80">{phone.phoneNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Display Order</label>
            <p className="text-foreground/80">{phone.order}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Created</label>
            <p className="text-foreground/80">{new Date(phone.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Last Updated</label>
            <p className="text-foreground/80">{new Date(phone.updatedAt).toLocaleDateString()}</p>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Link href={`/dashboard/contact-information/phone-number/edit?id=${phone.id}`} className="flex-1">
              <Button className="w-full">Edit Phone Number</Button>
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
          <AlertDialogTitle>Delete Phone Number?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{phone.phoneNumber}</span>? This action can be undone from the trash.
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
