'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getPhoneNumber } from '@/actions/phone-number';
import { PhoneNumberForm } from '@/components/PhoneNumberForm';

type PhoneNumberType = {
  id: string;
  phoneNumber: string;
  order: number;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function PhoneEditPage() {
  const [phone, setPhone] = useState<PhoneNumberType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();

  useEffect(() => {
    const fetchPhone = async () => {
      if (!id) {
        router.push('/dashboard/contact-information/phone-number');
        return;
      }

      try {
        const result = await getPhoneNumber(id);
        if (result.success && result.data) {
          setPhone(result.data);
        }
      } catch (error) {
        console.error('[v0] Error fetching phone:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhone();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  if (!phone) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
          <h1 className="text-3xl font-bold text-foreground">Edit Phone Number</h1>
          <p className="text-foreground/60 mt-1">Update phone number</p>
        </div>
      </div>

      <PhoneNumberForm initialData={phone} isEditMode={true} />
    </div>
  );
}
