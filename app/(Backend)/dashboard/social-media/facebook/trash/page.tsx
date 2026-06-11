import { getDeletedFacebookLinks } from '@/actions/facebook';
import { FacebookTable } from '@/components/facebook/FacebookTable';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function FacebookTrashPage() {
  const result = await getDeletedFacebookLinks();
  const links = result.success ? result.data : [];

  return (
    <div className="space-y-6 p-8">
      <div className="space-y-3 flex flex-col gap-4">
        <Link
          href="/dashboard/social-media/facebook"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Facebook Integration Manager
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Facebook Trash
          </h1>
        </div>
      </div>

      <FacebookTable data={links as any} showDeleted={true} />
    </div>
  );
}