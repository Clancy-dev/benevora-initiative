import { getAllWhatsappLinks } from '@/actions/whatsapp';
import { WhatsappTable } from '@/components/whatsapp/WhatsappTable';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default async function WhatsappPage() {
  const result = await getAllWhatsappLinks();
  const links = result.success ? result.data ?? [] : [];

  const hasWhatsappLink = links.length > 0;

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
              WhatsApp Link
            </h1>

            <p className="text-muted-foreground mt-2">
              Manage your WhatsApp contact links
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href="/dashboard/social-media/whatsapp/trash">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer dark:hover:text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Trash
            </Button>
          </Link>

          {hasWhatsappLink ? (
            <Button
              size="sm"
              disabled
              className="gap-2 opacity-50 cursor-not-allowed dark:text-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add WhatsApp Link
            </Button>
          ) : (
            <Link href="/dashboard/social-media/whatsapp/create">
              <Button
                size="sm"
                className="gap-2 cursor-pointer dark:text-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add WhatsApp Link
              </Button>
            </Link>
          )}
        </div>
      </div>

      <WhatsappTable data={links as any} />
    </div>
  );
}