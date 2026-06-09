import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { getAllPhoneNumbers } from '@/actions/phone-number';
import { PhoneNumberTable } from '@/components/PhoneNumberTable';
import Link from 'next/link';

interface PhoneNumber {
  id: string;
  phoneNumber: string;
  order: number;
}

export default async function PhoneNumberPage() {
  const result = await getAllPhoneNumbers();

  const phoneNumbers: PhoneNumber[] =
    result?.success ? (result.data as PhoneNumber[]) : [];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Phone Numbers
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your contact phone numbers
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard/contact-information/phone-number/trash">
              <Button variant="outline" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Trash
              </Button>
            </Link>

            <Link href="/dashboard/contact-information/phone-number/create">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Phone Number
              </Button>
            </Link>
          </div>
        </div>

        {/* Phone Table Card */}
        <Card>
          <CardHeader>
            <CardTitle>All Phone Numbers</CardTitle>
            <CardDescription>
              {phoneNumbers.length} phone number{phoneNumbers.length !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>

          <CardContent>
            {phoneNumbers.length === 0 ? (
              <p className="text-muted-foreground text-center py-10">
                No phone numbers found.
              </p>
            ) : (
              <PhoneNumberTable phoneNumbers={phoneNumbers} />
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}