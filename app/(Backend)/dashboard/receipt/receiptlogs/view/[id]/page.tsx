import React from 'react'
import { ReceiptDisplay } from '@/components/receipt-display'
import { getReceiptById } from '@/actions/receipt-actions'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'


export const metadata = {
  title: 'View Receipt | Receipt Generator',
  description: 'View and manage your professional receipt',
}

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function LogsReceiptPage({ params }: PageProps) {
  const { id } = await params
  const receipt = await getReceiptById(id)

  const session = await getServerSession(authOptions);
  
    if (!session || !session.user) {
      redirect("/login");
    }

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
