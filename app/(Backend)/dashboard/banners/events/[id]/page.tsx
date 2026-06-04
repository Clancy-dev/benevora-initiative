'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Link from 'next/link'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { deleteEventsBanner, getEventsBanner } from '@/actions/banner-actions/events-banner'

interface EventsBannerDetailPageProps {
  params: Promise<{ id: string }>
}

export default function EventsBannerDetailPage({ params }: EventsBannerDetailPageProps) {
  const router = useRouter()
  const [banner, setBanner] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchBanner() {
      try {
        const resolvedParams = await params
        if (mounted) {
          setId(resolvedParams.id)
          const result = await getEventsBanner(resolvedParams.id)

          if (!result.success) {
            toast.error('Banner not found')
            router.push('/dashboard/banners/events')
            return
          }

          setBanner(result.data)
        }
      } catch (error) {
        console.error('[v0] Fetch banner error:', error)
        if (mounted) {

          toast.error('Failed to load banner')
          router.push('/dashboard/banners/events')
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    fetchBanner()

    return () => {
      mounted = false
    }
  }, [params, router, toast])

  const handleDelete = async () => {
    if (!id) return

    try {
      setIsDeleting(true)
      const result = await deleteEventsBanner(id)

      if (!result.success) {
        toast.error('Failed to delete banner')
        return
      }
      toast.success('Banner deleted successfully')

      router.push('/dashboard/banners/events')
    } catch (error) {
      console.error('[v0] Delete error:', error)
      toast.error('Failed to delete banner')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Loading banner...</p>
        </div>
      </div>
    )
  }

  if (!banner) {
    return (
      <div className="container mx-auto py-8">
        <Link href="/dashboard/banners/events">
          <Button variant="ghost">← Back to Events Banners</Button>
        </Link>
        <Card className="mt-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Banner not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <Link href="/dashboard/banners/events">
          <Button variant="ghost">← Back to Events Banners</Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Events Banner Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Banner Image</h3>
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Title</h3>
            <p className="text-lg">{banner.title}</p>
          </div>

          {/* Subtitle */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Subtitle</h3>
            <p className="text-base text-muted-foreground">{banner.subtitle}</p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">
                {new Date(banner.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {new Date(banner.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <Link href={`/dashboard/banners/events/edit/${banner.id}`}>
              <Button>Edit</Button>
            </Link>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Events Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this events banner? You can restore it from the trash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-background not-first:hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
