import { FacebookForm } from '@/components/facebook/FacebookForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateFacebookPage() {
  return (
    <div className="min-h-screen p-8">
      {/* HEADER SECTION */}
      <div className="space-y-4 mb-8">
        <Link
          href="/dashboard/social-media/facebook"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Facebook Integration Manager
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight mt-4">
            Create Facebook Link
          </h1>
        </div>
      </div>

      <FacebookForm mode="create" />
    </div>
  );
}