"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

import { ChevronLeft, MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import Image from "next/image";
import { getDeletedBanners, permanentDeleteBanner, restoreBanner } from "@/actions/banner";

// Placeholder user context - replace with actual auth
const CURRENT_USER_ID = "user_placeholder_id";

export default function TrashPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogType, setDialogType] = useState<"restore" | "delete" | null>(null);
  const [selectedBannerId, setSelectedBannerId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadBanners = async () => {
    setIsLoading(true);
    try {
      const result = await getDeletedBanners();
      if (result.success) {
        setBanners(result.data ?? []);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load banners",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load banners",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleRestore = (bannerId: string) => {
    setSelectedBannerId(bannerId);
    setDialogType("restore");
  };

  const handlePermanentDelete = (bannerId: string) => {
    setSelectedBannerId(bannerId);
    setDialogType("delete");
  };

  const handleConfirmRestore = async () => {
    if (!selectedBannerId) return;

    setIsProcessing(true);
    try {
      const result = await restoreBanner(CURRENT_USER_ID, selectedBannerId);

      if (result.success) {
        toast({
          title: "Success",
          description: "Banner restored successfully",
        });
        loadBanners();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to restore banner",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to restore banner",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setDialogType(null);
      setSelectedBannerId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedBannerId) return;

    setIsProcessing(true);
    try {
      const result = await permanentDeleteBanner(CURRENT_USER_ID, selectedBannerId);

      if (result.success) {
        toast({
          title: "Success",
          description: "Banner permanently deleted",
        });
        loadBanners();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete banner",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setDialogType(null);
      setSelectedBannerId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/banners/home")}
            className="h-auto p-0 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>

        {/* Trash Card */}
        <Card>
          <CardHeader>
            <CardTitle>Trash</CardTitle>
            <CardDescription>
              {banners.length} deleted banner{banners.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Loading deleted banners...</p>
              </div>
            ) : banners.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg font-medium text-foreground">Trash is empty</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Deleted banners will appear here
                </p>
              </div>
            ) : (
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Deleted</TableHead>
                      <TableHead className="text-right w-12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {banners.map((banner) => (
                      <TableRow key={banner.id}>
                        <TableCell>
                          <div className="relative w-16 h-16">
                            <Image
                              src={banner.imageUrl}
                              alt={banner.title}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{banner.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {banner.deletedAt
                            ? new Date(banner.deletedAt).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleRestore(banner.id)}
                              >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Restore
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handlePermanentDelete(banner.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Permanently Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Restore Dialog */}
      <AlertDialog open={dialogType === "restore"} onOpenChange={(open) => !open && setDialogType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Banner?</AlertDialogTitle>
            <AlertDialogDescription>
              This banner will be restored to your active banners.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmRestore}
            disabled={isProcessing}
          >
            {isProcessing ? "Restoring..." : "Restore"}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Dialog */}
      <AlertDialog open={dialogType === "delete"} onOpenChange={(open) => !open && setDialogType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permanently Delete Banner?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The banner will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={isProcessing}
            className="bg-destructive text-background hover:bg-destructive/90"
          >
            {isProcessing ? "Deleting..." : "Permanently Delete"}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
