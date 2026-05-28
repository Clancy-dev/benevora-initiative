import { getAboutBanner } from "@/actions/banner-actions/about-banner";
import { uploadToCloudinary } from "@/actions/upload-image";
import { AboutBannerForm } from "@/components/banners/AboutBannerForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Edit About Banner - Admin",
  description: "Edit an about page banner",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAboutBannerPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    redirect("/dashboard/banners/about");
  }

  const result = await getAboutBanner(id);

  if (!result.success || !result.data) {
    return (
      <div className="container mx-auto p-8">
        <Link href="/dashboard/banners/about">
          <Button variant="ghost">← Back</Button>
        </Link>

        <p className="mt-4 text-red-500">
          {result.error || "Banner not found"}
        </p>
      </div>
    );
  }

  const banner = result.data;

  // 🔥 ADD THIS (same as create page)
  const handleUpload = async (file: File) => {
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
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <Link href="/dashboard/banners/about">
          <Button variant="ghost">← Back</Button>
        </Link>

        <h1 className="text-3xl font-bold mt-4">Edit About Banner</h1>
      </div>

      <AboutBannerForm
        initialData={banner}
        bannerId={id}
        isEditing={true}
        handleUpload={uploadToCloudinary}   
      />
    </div>
  );
}