"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { getAllBanners } from "@/actions/banner";
import { BannerTable } from "@/components/banners/BannerTable";

// Placeholder user context - replace with actual auth
const CURRENT_USER_ID = "user_placeholder_id";

export default function HomeBannersPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Maximum banner limit
  const hasReachedLimit = banners.length >= 3;

  const loadBanners = async () => {
    setIsLoading(true);

    try {
      const result = await getAllBanners();

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

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Home Banners
            </h1>

            <p className="text-muted-foreground mt-2">
              Manage your home carousel banners
            </p>

            {hasReachedLimit && (
              <p className="text-sm text-muted-foreground mt-2">
                Maximum of 3 banners reached
              </p>
            )}
          </div>

          <div className="flex gap-3">
            {/* Trash Button */}
            <Button
              variant="outline"
              onClick={() =>
                router.push("/dashboard/banners/home/trash")
              }
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Trash
            </Button>

            {/* Create Banner Button */}
            <Button
              title={
                hasReachedLimit
                  ? "Maximum of 3 banners allowed"
                  : "Create Banner"
              }
              onClick={() => {
                if (!hasReachedLimit) {
                  router.push("/dashboard/banners/home/create");
                }
              }}
              disabled={hasReachedLimit}
              className={`
                gap-2 transition-all duration-300
                ${
                  hasReachedLimit
                    ? "opacity-50 cursor-not-allowed blur-[0.3px]"
                    : ""
                }
              `}
            >
              <Plus className="h-4 w-4" />
              Create Banner
            </Button>
          </div>
        </div>

        {/* Banners Card */}
        <Card>
          <CardHeader>
            <CardTitle>All Banners</CardTitle>

            <CardDescription>
              {banners.length} banner
              {banners.length !== 1 ? "s" : ""} total
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">
                  Loading banners...
                </p>
              </div>
            ) : (
              <BannerTable
                banners={banners}
                userId={CURRENT_USER_ID}
                onBannerDeleted={loadBanners}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}