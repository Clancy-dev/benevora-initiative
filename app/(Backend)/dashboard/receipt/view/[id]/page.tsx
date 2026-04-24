import React from 'react'
import { ReceiptDisplay } from '@/components/receipt-display'
import { getReceiptById } from '@/actions/receipt-actions'


export const metadata = {
  title: 'View Receipt | Receipt Generator',
  description: 'View and manage your professional receipt',
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ReceiptPage({ params }: PageProps) {
  const { id } = await params
  const receipt = await getReceiptById(id)

  if (!receipt) {
    return <div className="p-6 text-center">Receipt not found</div>
  }
  return (
    <main className="min-h-screen bg-background">
      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <ReceiptDisplay receipt={receipt}/>
        </div>
      </div>
    </main>
  )
}
