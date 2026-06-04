import { getAllMembershipBanners } from '@/actions/banner-actions/membership'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { MembershipBannerTable } from '@/components/banners/MembershipBannerTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Membership Banners - Admin',
  description: 'Manage membership page banners',
}

export default async function MembershipBannerPage() {
  const session = await getServerSession(authOptions);
  
    if (!session) {
      redirect("/login");
    }
  
  const result = await getAllMembershipBanners()

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
            <h1 className="text-3xl font-bold">Membership Banner</h1>
            <p className="text-muted-foreground mt-2">
              Manage the hero banner for the Membership page
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/banners/membership/trash">
              <Button variant="outline">Trash</Button>
            </Link>
            <div className={isLimitReached ? "pointer-events-none opacity-40 blur-[1px]" : ""}>
           <Link href="/dashboard/banners/membership/create">
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
          <CardTitle>All Membership Banners</CardTitle>
        </CardHeader>
        <CardContent>
          <MembershipBannerTable banners={banners} />
        </CardContent>
      </Card>
    </div>
  )
}
