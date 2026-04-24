import { getAllReceipts } from '@/actions/receipt-actions'
import ReceiptsClient from '@/components/receipts-client'


export default async function AllReceiptsPage() {
  const receipts = await getAllReceipts()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground text-balance">All Receipts from Clients</h1>
          <p className="text-lg text-muted-foreground mt-3">Manage and view all your clients and their receipts in one place</p>
        </div>
        <ReceiptsClient initialReceipts={receipts} />
      </div>
    </main>
  )
}
