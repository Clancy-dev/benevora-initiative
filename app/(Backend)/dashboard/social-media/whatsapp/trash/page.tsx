
import { WhatsappTable } from "@/components/whatsapp/WhatsappTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDeletedWhatsappLinks } from "@/actions/whatsapp";
import { ArrowLeft } from "lucide-react";

export default async function WhatsappTrashPage() {
  const result = await getDeletedWhatsappLinks();
  const links = result.success ? result.data : [];

  return (
    <div className="space-y-6 p-8">
      <div className="space-y-3 flex flex-col gap-4">
                <Link
                  href="/dashboard/social-media/whatsapp"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Whatsapp Integration Manager
                </Link>
      
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    WhatsApp Trash
                  </h1>
      
                </div>
              </div>

      <WhatsappTable data={links as any} showDeleted={true} />
    </div>
  );
}
