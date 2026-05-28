import { getAllAboutBanners } from '@/actions/banner-actions/about-banner'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { AboutBannerTable } from '@/components/banners/AboutBannerTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'About Banners - Admin',
  description: 'Manage about page banners',
}

export default async function AboutBannerPage() {
  const session = await getServerSession(authOptions);
  
    if (!session) {
      redirect("/login");
    }
  
  const result = await getAllAboutBanners()

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
            <h1 className="text-3xl font-bold">About Banners</h1>
            <p className="text-muted-foreground mt-2">
              Manage the hero banner for the About page
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/banners/about/trash">
              <Button variant="outline">Trash</Button>
            </Link>
            <div className={isLimitReached ? "pointer-events-none opacity-40 blur-[1px]" : ""}>
           <Link href="/dashboard/banners/about/create">
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
          <CardTitle>All About Banners</CardTitle>
        </CardHeader>
        <CardContent>
          <AboutBannerTable banners={banners} />
        </CardContent>
      </Card>
    </div>
  )
}
