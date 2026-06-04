'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'
import toast from 'react-hot-toast'
import { getDeletedBlogsBanners, permanentDeleteBlogsBanner, restoreBlogsBanner } from '@/actions/banner-actions/blogs-banner'

interface DeletedBanner {
  id: string
  title: string
  subtitle: string
  image: string
  deletedAt: Date | null   // 👈 FIX HERE
}

export default function TrashPage() {
  const router = useRouter()
  const [banners, setBanners] = useState<DeletedBanner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [action, setAction] = useState<'restore' | 'delete' | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetchDeletedBanners()
  }, [])

  async function fetchDeletedBanners() {
    try {
      setIsLoading(true)
      const result = await getDeletedBlogsBanners()

      if (!result.success) {
        toast.error('Failed to load deleted banners')
       
        return
      }

      setBanners(result.data || [])
    } catch (error) {
      console.error('[v0] Fetch deleted banners error:', error)
      toast.error('Failed to load deleted banners')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestore = async () => {
    if (!selectedId) return

    try {
      setIsProcessing(true)
      const result = await restoreBlogsBanner(selectedId)

      if (!result.success) {
        toast.error('Failed to restore banner')
        return
      }

      toast.success('Banner restored successfully')

      fetchDeletedBanners()
      setShowDialog(false)
      setSelectedId(null)
      setAction(null)
    } catch (error) {
      console.error('[v0] Restore error:', error)
      toast.error('Failed to restore banner')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePermanentDelete = async () => {
    if (!selectedId) return

    try {
      setIsProcessing(true)
      const result = await permanentDeleteBlogsBanner(selectedId)

      if (!result.success) {
        toast.error('Failed to permanently delete banner')
        return
      }

      toast.success('Banner permanently deleted')

      fetchDeletedBanners()
      setShowDialog(false)
      setSelectedId(null)
      setAction(null)
    } catch (error) {
      console.error('[v0] Permanent delete error:', error)
      toast.error('Failed to permanently delete banner')
    } finally {
      setIsProcessing(false)
    }
  }

  const openDialog = (id: string, dialogAction: 'restore' | 'delete') => {
    setSelectedId(id)
    setAction(dialogAction)
    setShowDialog(true)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Loading trash...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/dashboard/banners/blogs">
              <Button variant="ghost">← Back to Blogs Banners</Button>
            </Link>
            <h1 className="text-3xl font-bold mt-4">Trash</h1>
            <p className="text-muted-foreground mt-2">
              Manage deleted blogs banners
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deleted Banners</CardTitle>
        </CardHeader>
        <CardContent>
          {banners.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No deleted banners in trash.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Image</th>
                    <th className="text-left py-3 px-4 font-semibold">Title</th>
                    <th className="text-left py-3 px-4 font-semibold">Subtitle</th>
                    <th className="text-left py-3 px-4 font-semibold">Deleted</th>
                    <th className="text-right py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {banners.map((banner) => (
                    <tr key={banner.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="relative w-16 h-16 rounded overflow-hidden">
                          <Image
                            src={banner.image}
                            alt={banner.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{banner.title}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {banner.subtitle}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-muted-foreground">
                          {banner.deletedAt? new Date(banner.deletedAt).toLocaleDateString(): 'Not set'}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openDialog(banner.id, 'restore')}
                            >
                              Restore
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openDialog(banner.id, 'delete')}
                              className="text-destructive"
                            >
                              Delete Permanently
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action === 'restore' ? 'Restore Blogs Banner' : 'Permanently Delete Blogs Banner'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {action === 'restore'
                ? 'This banner will be restored to the main list.'
                : 'This action cannot be undone. The banner will be permanently deleted.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={action === 'restore' ? handleRestore : handlePermanentDelete}
              disabled={isProcessing}
              className={
                action === 'delete'
                  ? 'bg-destructive text-background hover:bg-destructive/90'
                  : ''
              }
            >
              {isProcessing
                ? 'Processing...'
                : action === 'restore'
                  ? 'Restore'
                  : 'Delete Permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
