
import { FounderForm } from '@/components/founders/FounderForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Create Founder',
  description: 'Add a new founder to your organization',
};

export default function CreateFounderPage() {
  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/founders" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Founder</h1>
          <p className="text-foreground/60 mt-1">Add a new member to your leadership team</p>
        </div>
      </div>

      {/* Form */}
      <FounderForm />
    </div>
  );
}
