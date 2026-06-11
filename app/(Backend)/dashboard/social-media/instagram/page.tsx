import { getAllInstagramLinks } from '@/actions/instagram';
import { InstagramTable } from '@/components/instagram/InstagramTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default async function InstagramPage() {
  const result = await getAllInstagramLinks();
  const links = result.success ? result.data ?? [] : [];

  const hasInstagramLink = links.length > 0;

  return (
    <div className="space-y-8 p-8">
      {/* Mini Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex flex-col gap-4">
          <Link
            href="/dashboard/social-media"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Social Media Platforms
          </Link>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Instagram Link
            </h1>

            <p className="text-muted-foreground mt-2">
              Manage your Instagram profile links
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href="/dashboard/social-media/instagram/trash">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer dark:hover:text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Trash
            </Button>
          </Link>

          {hasInstagramLink ? (
            <Button
              size="sm"
              disabled
              className="gap-2 opacity-50 cursor-not-allowed dark:text-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Instagram Link
            </Button>
          ) : (
            <Link href="/dashboard/social-media/instagram/create">
              <Button
                size="sm"
                className="gap-2 cursor-pointer dark:text-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Instagram Link
              </Button>
            </Link>
          )}
        </div>
      </div>

      <InstagramTable data={links as any} />
    </div>
  );
}