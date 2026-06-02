import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkDeleteButton } from '@/components/work/WorkDeleteButton';
import { getWork } from '@/actions/work';

interface WorkDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: WorkDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getWork(id);

  if (!result.success) {
    return {
      title: 'Work Not Found',
    };
  }

  return {
    title: `${result.data?.caption} - Work Details`,
    description: result.data?.caption,
  };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { id } = await params;
  const result = await getWork(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const work = result.data;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard/work">
            <Button variant="outline">← Back to Works</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{work.caption}</CardTitle>
            <CardDescription>Work Details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Image */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Work Image</h3>
              <div className="relative w-full h-96 rounded-lg overflow-hidden border border-border">
                <Image
                  src={work.image}
                  alt={work.caption}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Caption</h4>
                <p className="text-foreground">{work.caption}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Display Order</h4>
                <p className="text-foreground">{work.order}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Created</h4>
                <p className="text-foreground">{new Date(work.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Last Updated</h4>
                <p className="text-foreground">{new Date(work.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Link href={`/dashboard/work/edit?id=${work.id}`} className="flex-1">
                <Button className="w-full cursor-pointer">Edit Work</Button>
              </Link>
              <WorkDeleteButton workId={work.id} caption={work.caption} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
