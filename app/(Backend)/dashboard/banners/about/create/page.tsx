"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { AboutBannerForm } from "@/components/banners/AboutBannerForm";

const CURRENT_USER_ID = "user_placeholder_id";

export default function CreateAboutBannerPage() {
  const router = useRouter();

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
        <AboutBannerForm
          handleUpload={async (file: File) => {
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