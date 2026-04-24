import { ReceiptForm } from '@/components/receipt-form'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { getCompanySettings } from '@/actions/company-setting-actions'

export const metadata = {
  title: 'Create Receipt | Receipt Generator',
  description: 'Generate a new professional receipt for your client',
}

export default async function CreateReceiptPage() {
  const company = await getCompanySettings();
  const session = await getServerSession(authOptions);
  
    // Redirect to login if no session
    if (!session || !session.user) {
      redirect("/login");
    }
  return (
    <main className="min-h-screen bg-background">
      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Generate New Receipt</h2>
            <p className="text-muted-foreground mt-2">
              Fill in the details below. Your company information will be pre-filled.
            </p>
          </div>
          
          <ReceiptForm company={company} />
        </div>
      </div>
    </main>
  )
}
