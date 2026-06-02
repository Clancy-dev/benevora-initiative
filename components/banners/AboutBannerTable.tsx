'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { MoreHorizontal } from 'lucide-react'
import { deleteAboutBanner } from '@/actions/banner-actions/about-banner'
import toast from 'react-hot-toast'

interface AboutBanner {
  id: string
  title: string
  subtitle: string
  image: string
  createdAt: Date
  updatedAt: Date
}

interface AboutBannerTableProps {
  banners: AboutBanner[]
}

export function AboutBannerTable({ banners }: AboutBannerTableProps) {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!selectedId) return

    try {
      setIsDeleting(true)
      const result = await deleteAboutBanner(selectedId)

      if (!result.success) {
        toast.error('Failed to delete banner')
        return
      }

      toast.success('Banner deleted successfully')

      router.refresh()
    } catch (error) {
      console.error('[v0] Delete error:', error)
      toast.error('Failed to delete banner')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
      setSelectedId(null)
    }
  }

  const openDeleteDialog = (id: string) => {
    setSelectedId(id)
    setShowDeleteDialog(true)
  }

  if (banners.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No about banners found. Create one to get started.</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold">Image</th>
              <th className="text-left py-3 px-4 font-semibold">Title</th>
              <th className="text-left py-3 px-4 font-semibold">Subtitle</th>
              <th className="text-left py-3 px-4 font-semibold">Created</th>
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
                  <p className="text-sm text-muted-foreground line-clamp-2">{banner.subtitle}</p>
                </td>
                <td className="py-3 px-4">
                  <p className="text-sm text-muted-foreground">
                    {new Date(banner.createdAt).toLocaleDateString()}
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
                        onClick={() => router.push(`/dashboard/banners/about/${banner.id}`)}
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push(`/dashboard/banners/about/edit/${banner.id}`)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(banner.id)}
                        className="text-destructive"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete About Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this about banner? You can restore it from the trash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-background hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
