import { getAllFounders } from '@/actions/founders';
import { FounderTable } from '@/components/founders/FounderTable';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Manage Founders',
  description: 'Create, edit, and manage team founders',
};

export default async function FoundersPage() {
  const result = await getAllFounders();
  const founders = result.success ? result.data || [] : [];
  const hasReachedLimit = founders.length >= 3;

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Founders</h1>
          <p className="text-foreground/60 mt-2">Manage your organization's founders and leadership team</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/founders/trash">
            <Button variant="outline" size="sm" className="cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" />
              Trash
            </Button>
          </Link>
       {hasReachedLimit ? (
  <Button
    size="sm"
    disabled
    className="opacity-50 cursor-not-allowed blur-[0.3px]"
    title="Maximum of 3 founders allowed"
  >
    <Plus className="mr-2 h-4 w-4" />
    New Founder
  </Button>
) : (
  <Link href="/dashboard/founders/create">
    <Button size="sm" className="gap-2">
      <Plus className="mr-2 h-4 w-4" />
      New Founder
    </Button>
  </Link>
)}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-border bg-muted/30">
          <p className="text-sm text-foreground/60 mb-1">Total Founders</p>
          <p className="text-3xl font-bold text-foreground">{founders.length}</p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-muted/30">
          <p className="text-sm text-foreground/60 mb-1">Active</p>
          <p className="text-3xl font-bold text-foreground">{founders.length}</p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-muted/30">
          <p className="text-sm text-foreground/60 mb-1">Last Updated</p>
          <p className="text-sm font-semibold text-foreground">
            {founders[0]?.updatedAt ? new Date(founders[0].updatedAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      {/* Table */}
      <FounderTable founders={founders} />
    </div>
  );
}
