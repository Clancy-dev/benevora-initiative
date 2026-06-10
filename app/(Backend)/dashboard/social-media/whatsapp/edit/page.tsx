import { getWhatsappLink } from "@/actions/whatsapp";
import { WhatsappForm } from "@/components/whatsapp/WhatsappForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditWhatsappPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const result = await getWhatsappLink(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8 space-y-8">
      
      {/* HEADER SECTION */}
      <div className="space-y-4">
        <Link
          href="/dashboard/social-media/whatsapp"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Whatsapp Integration Manager
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight mt-4">
            Edit WhatsApp
          </h1>
        </div>
      </div>

      {/* FORM - FULL WIDTH (NO CENTERING) */}
      <div className="w-full">
        <WhatsappForm
          mode="edit"
          initialData={result.data as any}
          whatsappId={id}
        />
      </div>

    </div>
  );
}