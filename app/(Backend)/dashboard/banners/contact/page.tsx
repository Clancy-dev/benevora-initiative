import { getAllContactBanners } from '@/actions/banner-actions/contact-banner'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { ContactBannerTable } from '@/components/banners/ContactBannerTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Contact Banners - Admin',
  description: 'Manage Contact page banners',
}

export default async function ContactBannerPage() {
  const session = await getServerSession(authOptions);
  
    if (!session) {
      redirect("/login");
    }
  
  const result = await getAllContactBanners()

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
            <h1 className="text-3xl font-bold">Contact Banner</h1>
            <p className="text-muted-foreground mt-2">
              Manage the hero banner for the Contact page
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/banners/contact/trash">
              <Button variant="outline">Trash</Button>
            </Link>
            <div className={isLimitReached ? "pointer-events-none opacity-40 blur-[1px]" : ""}>
           <Link href="/dashboard/banners/contact/create">
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
          <CardTitle>All Contact Banners</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactBannerTable banners={banners} />
        </CardContent>
      </Card>
    </div>
  )
}
