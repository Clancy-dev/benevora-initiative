import { getXLink } from "@/actions/x";
import { XForm } from "@/components/x/XForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditXPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const result = await getXLink(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8 space-y-8">

      {/* HEADER SECTION */}
      <div className="space-y-4">
        <Link
          href="/dashboard/x"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to X Integration Manager
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight mt-4">
            Edit X Link
          </h1>
        </div>
      </div>

      {/* FORM SECTION */}
      <div className="w-full">
        <XForm
          mode="edit"
          initialData={result.data as any}
          xId={id}
        />
      </div>

    </div>
  );
}