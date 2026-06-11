import { LinkedinForm } from '@/components/linkedin/LinkedinForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateLinkedinPage() {
  return (
    <div className="min-h-screen p-8">
      {/* HEADER SECTION */}
      <div className="space-y-4 mb-8">
        <Link
          href="/dashboard/social-media/linkedin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to LinkedIn Integration Manager
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight mt-4">
            Create LinkedIn Link
          </h1>
        </div>
      </div>

      <LinkedinForm mode="create" />
    </div>
  );
}