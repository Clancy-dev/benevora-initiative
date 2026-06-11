import { getDeletedInstagramLinks } from '@/actions/instagram';
import { InstagramTable } from '@/components/instagram/InstagramTable';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function InstagramTrashPage() {
  const result = await getDeletedInstagramLinks();
  const links = result.success ? result.data : [];

  return (
    <div className="space-y-6 p-8">
      <div className="space-y-3 flex flex-col gap-4">
        <Link
          href="/dashboard/social-media/instagram"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Instagram Integration Manager
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Instagram Trash
          </h1>
        </div>
      </div>

      <InstagramTable data={links as any} showDeleted={true} />
    </div>
  );
}