"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Trash2, Edit, Eye } from "lucide-react";
import { deleteBanner } from "@/actions/banner-actions/home-banner";
import toast from "react-hot-toast";


interface BannerTableProps {
  banners: any[];
  userId: string;
  onBannerDeleted: () => void;
}

export function BannerTable({ banners, userId, onBannerDeleted }: BannerTableProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (bannerId: string) => {
    setSelectedBannerId(bannerId);
    setIsOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBannerId) return;

    setIsDeleting(true);
    try {
      const result = await deleteBanner(userId, selectedBannerId);

      if (result.success) {
        toast.success("Banner deleted successfully")
        onBannerDeleted();
      } else {
        toast.error("Failed to delete banner")
      }
    } catch (error) {
      toast.error("Failed to delete banner")
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
      setSelectedBannerId(null);
    }
  };

  if (banners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium text-foreground">No banners yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first banner to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-12">Order</TableHead>
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
                <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                  {banner.description}
                </TableCell>
                <TableCell className="text-center">{banner.order}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/dashboard/banners/home/${banner.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/dashboard/banners/home/edit?id=${banner.id}`)
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(banner.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this banner? You can restore it later from the trash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="bg-destructive text-background hover:bg-destructive/90 cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
