import { getAllEventsBanners } from '@/actions/banner-actions/events-banner'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { EventsBannerTable } from '@/components/banners/EventsBannerTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Events Banners - Admin',
  description: 'Manage events page banners',
}

export default async function EventsBannerPage() {
  const session = await getServerSession(authOptions);
  
    if (!session) {
      redirect("/login");
    }
  
  const result = await getAllEventsBanners()

  if (!result.success) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{result.error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const banners = result.data || []
  const isLimitReached = banners.length >= 1

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Events Banners</h1>
            <p className="text-muted-foreground mt-2">
              Manage the hero banner for the Events page
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/banners/events/trash">
              <Button variant="outline">Trash</Button>
            </Link>
            <div className={isLimitReached ? "pointer-events-none opacity-40 blur-[1px]" : ""}>
           <Link href="/dashboard/banners/events/create">
           <Button disabled={isLimitReached}>
              Create Banner
           </Button>
           </Link>
          </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events Banners</CardTitle>
        </CardHeader>
        <CardContent>
          <EventsBannerTable banners={banners} />
        </CardContent>
      </Card>
    </div>
  )
}
