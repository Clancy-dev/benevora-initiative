import { getDeletedLinkedinLinks } from '@/actions/linkedin';
import { LinkedinTable } from '@/components/linkedin/LinkedinTable';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function LinkedinTrashPage() {
  const result = await getDeletedLinkedinLinks();
  const links = result.success ? result.data : [];

  return (
    <div className="space-y-6 p-8">
      <div className="space-y-3 flex flex-col gap-4">
        <Link
          href="/dashboard/social-media/linkedin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to LinkedIn Integration Manager
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            LinkedIn Trash
          </h1>
        </div>
      </div>

      <LinkedinTable data={links as any} showDeleted={true} />
    </div>
  );
}