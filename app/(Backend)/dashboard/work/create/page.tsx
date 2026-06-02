import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WorkForm } from '@/components/work/WorkForm';

export const metadata: Metadata = {
  title: 'Create Work',
  description: 'Create a new work gallery item',
};

export default function CreateWorkPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard/work">
            <Button variant="outline" className="cursor-pointer">← Back to Work Group</Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mt-4">Create New Work</h1>
          <p className="text-muted-foreground mt-2">Add a new item to your gallery</p>
        </div>

        <WorkForm />
      </div>
    </div>
  );
}
