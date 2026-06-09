import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { getAllEmails } from '@/actions/email';
import { EmailTable } from '@/components/EmailTable';
import Link from 'next/link';

interface Email {
  id: string;
  email: string;
  order: number;
}

export default async function EmailPage() {
  const result = await getAllEmails();

  const emails: Email[] =
    result?.success ? (result.data as Email[]) : [];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Email
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage the email for the organisation
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard/contact-information/email/trash">
              <Button variant="outline" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Trash
              </Button>
            </Link>

            <Link href="/dashboard/contact-information/email/create">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Email
              </Button>
            </Link>
          </div>
        </div>

        {/* Email Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>All Emails</CardTitle>
            <CardDescription>
              {emails.length} email{emails.length !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>

          <CardContent>
            {emails.length === 0 ? (
              <p className="text-muted-foreground text-center py-10">
                No emails found.
              </p>
            ) : (
              <EmailTable emails={emails} />
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}