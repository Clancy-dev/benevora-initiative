import { EditReceiptForm } from '@/components/edit-receipt-form'
import { getReceiptById } from '@/actions/receipt-actions'
import { ReceiptFormData, Currency } from '@/types/receipt'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getCompanySettings } from '@/actions/company-setting-actions'

// ================= HELPER =================
function parseArray<T>(data: any, mapper: (item: any, idx: number) => T): T[] {
  if (Array.isArray(data)) {
    return data.map(mapper)
  }
  return []
}

// ================= PAGE =================
export const metadata = {
  title: 'Edit Receipt | Receipt Generator',
  description: 'Edit an existing receipt',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditReceiptPage({ params }: PageProps) {
  const company = await getCompanySettings()
  const { id } = await params
  const receipt = await getReceiptById(id)

  const session = await getServerSession(authOptions);
    
      // Redirect to login if no session
      if (!session || !session.user) {
        redirect("/login");
      }

  if (!receipt) {
    return <div className="p-10 text-center">Receipt not found</div>
  }

  // ===== FORMAT RECEIPT SAFELY =====
  const formattedReceipt: ReceiptFormData = {
    ...receipt,
    customerName: receipt.customerName || '',
    customerEmail: receipt.customerEmail || '',
    customerOrganization: receipt.customerOrganization || '',
    projectName: receipt.projectName || '',
    serviceType: receipt.serviceType || '',
    description: receipt.description || '',
    projectStartDate: receipt.projectStartDate ? new Date(receipt.projectStartDate).toISOString().split('T')[0] : '',
    projectEndDate: receipt.projectEndDate ? new Date(receipt.projectEndDate).toISOString().split('T')[0] : '',
    projectTotal: receipt.projectTotal || 0,
    amountPaid: receipt.amountPaid || 0,
    remainingBalance: receipt.remainingBalance || 0,
    currency: (receipt.currency as Currency) || 'UGX',
    paymentMethod: receipt.paymentMethod || '',
    bankName: receipt.bankName || '',
    bankAccountNumber: receipt.bankAccountNumber || '',
    cardNumber: receipt.cardNumber || '',
    mobileMoneyProvider: receipt.mobileMoneyProvider || '',
    mobileNumber: receipt.mobileNumber || '',
    countryCode: receipt.countryCode || '+256',
    companyName: receipt.companyName || company?.name || '',
    companyEmail: receipt.companyEmail || company?.email || '',
    companyLogo: receipt.companyLogo || company?.logo || '',

    customerNames: parseArray(receipt.additionalNames, (name, idx) => ({
   id: name?.id || idx.toString(),
   name: typeof name === 'string'
    ? name
    : name?.name || '',
})),

   customerEmails: parseArray(receipt.additionalEmails, (email, idx) => ({
  id: email?.id || idx.toString(),
  email: typeof email === 'string'
    ? email
    : email?.email || '',
})),

    clientContacts: parseArray(receipt.clientContacts, (c: any) => ({
      id: c.id || Date.now().toString(),
      name: c.name || '',
      email: c.email || '',
      phone: c.phone || '',
      countryCode: c.countryCode || '+256',
    })),

    companyContacts: parseArray(
  receipt.companyContacts ?? company?.contacts ?? [],
  (c: any) => ({
    name: c.name || '',
    phone: c.phone || '',
  })
),


  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8">

        <div className="max-w-4xl mx-auto">

          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Edit Receipt
            </h2>
            <p className="text-muted-foreground mt-2">
              Update the receipt information below.
            </p>
          </div>

          <EditReceiptForm receipt={formattedReceipt} isEdit />

        </div>

      </div>

    </main>
  )
}