import { getLinkedinLink } from "@/actions/linkedin";
import { LinkedinForm } from "@/components/linkedin/LinkedinForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditLinkedinPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const result = await getLinkedinLink(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8 space-y-8">

      {/* HEADER SECTION */}
      <div className="space-y-4">
        <Link
          href="/dashboard/social-media/linkedin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to LinkedIn Integration Manager
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight mt-4">
            Edit LinkedIn Link
          </h1>
        </div>
      </div>

      {/* FORM SECTION */}
      <div className="w-full">
        <LinkedinForm
          mode="edit"
          initialData={result.data as any}
          linkedinId={id}
        />
      </div>

    </div>
  );
}