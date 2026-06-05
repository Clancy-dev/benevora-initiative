import { getContactBanner } from "@/actions/banner-actions/contact-banner";
import { uploadToCloudinary } from "@/actions/upload-image";
import { ContactBannerForm } from "@/components/banners/ContactBannerForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Edit Contact Banner - Admin",
  description: "Edit an contact page banner",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditContactBannerPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    redirect("/dashboard/banners/contact");
  }

  const result = await getContactBanner(id);

  if (!result.success || !result.data) {
    return (
      <div className="container mx-auto p-8">
        <Link href="/dashboard/banners/contact">
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
        <Link href="/dashboard/banners/contact">
          <Button variant="ghost">← Back</Button>
        </Link>

        <h1 className="text-3xl font-bold mt-4">Edit Contact Banner</h1>
      </div>

      <ContactBannerForm
        initialData={banner}
        bannerId={id}
        isEditing={true}
        handleUpload={uploadToCloudinary}   
      />
    </div>
  );
}