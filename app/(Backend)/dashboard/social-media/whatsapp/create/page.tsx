import { WhatsappForm } from '@/components/whatsapp/WhatsappForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateWhatsappPage() {
  return (
    <div className="min-h-screen p-8">
      {/* HEADER SECTION */}
            <div className="space-y-4 mb-8">
              <Link
                href="/dashboard/social-media/whatsapp"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Whatsapp Integration Manager
              </Link>
      
              <div>
                <h1 className="text-3xl font-bold tracking-tight mt-4">
                  Create WhatsApp Link
                </h1>
              </div>
            </div>
      <WhatsappForm mode="create" />
    </div>
  );
}
