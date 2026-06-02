"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronLeft, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { deleteBanner, getBanner } from "@/actions/banner-actions/home-banner";
import toast from "react-hot-toast";


// Placeholder user context - replace with actual auth
const CURRENT_USER_ID = "user_placeholder_id";

export default function BannerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bannerId = params.id as string;
  const [banner, setBanner] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadBanner = async () => {
      setIsLoading(true);
      try {
        const result = await getBanner(bannerId);
        if (result.success) {
          setBanner(result.data);
        } else {
          toast.error("Failed to load banner")
          
          router.push("/dashboard/banners/home");
        }
      } catch (error) {
        toast.error("Failed to load banner")
        router.push("/dashboard/banners/home");
      } finally {
        setIsLoading(false);
      }
    };

    loadBanner();
  }, [bannerId, router]);

  const handleDeleteClick = () => {
    setIsOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteBanner(CURRENT_USER_ID, bannerId);

      if (result.success) {
        toast.success("Banner deleted successfully")
        
        router.push("/dashboard/banners/home");
      } else {
        toast.error("Failed to delete banner")
      }
    } catch (error) {
      toast.error("Failed to delete banner")
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <p className="text-muted-foreground">Loading banner...</p>
        </div>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <p className="text-muted-foreground">Banner not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="h-auto p-0 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>

        {/* Banner Details */}
        <div className="grid gap-6">
          {/* Image Card */}
          <Card>
            <CardHeader>
              <CardTitle>Banner Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Banner Details</CardTitle>
              <CardDescription>View and manage banner information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <p className="text-lg font-semibold text-foreground mt-1">
                  {banner.title}
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <p className="text-foreground mt-1 whitespace-pre-wrap">
                  {banner.description}
                </p>
              </div>

              {/* Order */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Display Order
                </label>
                <p className="text-lg font-semibold text-foreground mt-1">
                  {banner.order}
                </p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created
                  </label>
                  <p className="text-sm text-foreground mt-1">
                    {new Date(banner.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Updated
                  </label>
                  <p className="text-sm text-foreground mt-1">
                    {new Date(banner.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  onClick={() =>
                    router.push(`/dashboard/banners/edit?id=${bannerId}`)
                  }
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Banner
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteClick}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{banner?.title}"? You can restore it later from
              the trash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
