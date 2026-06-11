import { getDeletedXLinks } from '@/actions/x';
import { XTable } from '@/components/x/XTable';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function XTrashPage() {
  const result = await getDeletedXLinks();
  const links = result.success ? result.data : [];

  return (
    <div className="space-y-6 p-8">
      <div className="space-y-3 flex flex-col gap-4">
        <Link
          href="/dashboard/social-media/x"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to X Integration Manager
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            X Trash
          </h1>
        </div>
      </div>

      <XTable data={links as any} showDeleted={true} />
    </div>
  );
}