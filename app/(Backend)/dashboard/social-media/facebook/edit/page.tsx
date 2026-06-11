import { getFacebookLink } from "@/actions/facebook";
import { FacebookForm } from "@/components/facebook/FacebookForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditFacebookPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const result = await getFacebookLink(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <div className="min-h-screen p-8 space-y-8">

      {/* HEADER */}
      <div className="space-y-4">
        <Link
          href="/dashboard/social-media/facebook"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Facebook Integration Manager
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight mt-4">
            Edit Facebook Link
          </h1>
        </div>
      </div>

      {/* FORM */}
      <div className="w-full">
        <FacebookForm
          mode="edit"
          initialData={result.data as any}
          facebookId={id}
        />
      </div>

    </div>
  );
}