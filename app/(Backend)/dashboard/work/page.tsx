import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllWorks } from '@/actions/work';
import { WorkTable } from '@/components/work/WorkTable';
import { Plus, Trash2 } from 'lucide-react';
import { workSchema } from '@/lib/validations/work';

export const metadata: Metadata = {
  title: 'Our Work Management',
  description: 'Manage your Our Work gallery items',
};

export default async function OurWorkPage() {
  const result = await getAllWorks();
  const works = result.success ? result.data || [] : [];
  const hasReachedLimit = works.length >= 3;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Our Work Gallery</h1>
            <p className="text-muted-foreground mt-2">Manage your work and gallery items</p>
          </div>

          <div className="flex gap-2">
                    <Link href="/dashboard/work/trash">
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
              Create Work
            </Button>
          ) : (
            <Link href="/dashboard/work/create">
              <Button size="sm" className="gap-2 cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Create Work
              </Button>
            </Link>
          )}
                  </div>
        </div>


        {/* Works Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Works</CardTitle>
            <CardDescription>Manage all your work gallery items</CardDescription>
          </CardHeader>
          <CardContent>
            <WorkTable works={works} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
