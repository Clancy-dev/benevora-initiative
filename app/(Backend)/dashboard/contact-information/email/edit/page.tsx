'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getEmail } from '@/actions/email';
import { EmailForm } from '@/components/EmailForm';

type EmailType = {
  id: string;
  email: string;
  order: number;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function EmailEditPage() {
  const [email, setEmail] = useState<EmailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const router = useRouter();

  useEffect(() => {
    const fetchEmail = async () => {
      if (!id) {
        router.push('/dashboard/contact-information/email');
        return;
      }

      try {
        const result = await getEmail(id);
        if (result.success && result.data) {
          setEmail(result.data);
        }
      } catch (error) {
        console.error('[v0] Error fetching email:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmail();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
        <Link href="/dashboard/contact-information/email" className="p-2 hover:bg-muted rounded-lg transitio  n-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Email</h1>
          <p className="text-foreground/60 mt-1">Update email address</p>
        </div>
      </div>

      <EmailForm initialData={email} isEditMode={true} />
    </div>
  );
}
