"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import { BannerForm } from "@/components/banners/BannerForm";
import { getBanner } from "@/actions/banner-actions/home-banner";

// Placeholder user context - replace with actual auth
const CURRENT_USER_ID = "user_placeholder_id";

export default function EditHomeBannerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const bannerId = searchParams.get("id");
  const [banner, setBanner] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!bannerId) {
      router.push("/dashboard/banners/home");
      return;
    }

    const loadBanner = async () => {
      setIsLoading(true);
      try {
        const result = await getBanner(bannerId);
        if (result.success) {
          setBanner(result.data);
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to load banner",
            variant: "destructive",
          });
          router.push("/dashboard/banners/home");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load banner",
          variant: "destructive",
        });
        router.push("/dashboard/banners/home");
      } finally {
        setIsLoading(false);
      }
    };

    loadBanner();
  }, [bannerId, router, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto flex items-center justify-center">
          <p className="text-muted-foreground">Loading banner...</p>
        </div>
      </div>
    );
  }

  if (!banner) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-2xl mx-auto flex items-center justify-center">
          <p className="text-muted-foreground">Banner not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
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

        {/* Form */}
        <BannerForm
          mode="edit"
          bannerId={bannerId!}
          initialData={banner}
          userId={CURRENT_USER_ID}
          handleUpload={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return "";

            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "practice");

            const response = await fetch(
              process.env.NEXT_PUBLIC_CLOUDINARY_URL!,
              {
                method: "POST",
                body: formData,
              }
            );

            const data = await response.json();
            return data.secure_url;
          }}
        />
      </div>
    </div>
  );
}
