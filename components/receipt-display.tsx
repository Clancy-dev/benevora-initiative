'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Download, Printer, Edit, History, Trash2, MoreVertical } from 'lucide-react'
import { generateReceiptNumber } from '@/lib/qr-code' 
import { QRCodeCanvas } from "qrcode.react"
import { generateReceiptQRData } from "@/lib/qr-code"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useRouter } from 'next/navigation'
import { getCompanySettings } from '@/actions/company-setting-actions'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { deleteReceipt } from '@/actions/receipt-actions'
import toast from 'react-hot-toast'

interface ReceiptDisplayProps {
  receipt: any
}

interface Contact {
  id: string
  name: string
  phone: string
}

interface CompanyData {
  id?: string
  name: string
  email: string
  logo?: string
  contacts: Contact[]
}

export function ReceiptDisplay({ receipt }: ReceiptDisplayProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()
  const { data: session } = useSession();

  const [company, setCompany] = useState<CompanyData>({
    name: '',
    email: '',
    logo: undefined,
    contacts: [],
  })

  const [loading, setLoading] = useState(true)

  // Fetch company settings on mount
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getCompanySettings()
        if (data) {
          const contactsFromServer: Contact[] = Array.isArray(data.contacts)
            ? (data.contacts as any[]).map((item: any) => ({
                id: item.id ?? crypto.randomUUID(),
                name: item.name ?? "",
                phone: item.phone ?? "",
              }))
            : []

          setCompany({
            id: data.id ?? crypto.randomUUID(),
            name: data.name ?? "",
            email: data.email ?? "",
            logo: data.logo ?? undefined,
            contacts: contactsFromServer,
          })
        }
      } catch (error) {
        console.error("Failed to fetch company settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCompany()
  }, [])

  const receiptRef = useRef<HTMLDivElement>(null)

  const receiptNumber = generateReceiptNumber(receipt.id, receipt.createdAt)

  const paidPercentage = (receipt.amountPaid / receipt.projectTotal) * 100
  const remainingPercentage = (receipt.remainingBalance / receipt.projectTotal) * 100

  const chartData = [
    { name: `Paid (${paidPercentage.toFixed(0)}%)`, value: paidPercentage },
    { name: `Remaining (${remainingPercentage.toFixed(0)}%)`, value: remainingPercentage }
  ]

  
  const handlePrint = () => {
    if (!receiptRef.current) return;

    const element = receiptRef.current;

    const pageWidth = 794;
    const pageHeight = 1123;

    const elementWidth = element.scrollWidth;
    const elementHeight = element.scrollHeight;

    const scaleX = pageWidth / elementWidth;
    const scaleY = pageHeight / elementHeight;
    const scale = Math.min(scaleX, scaleY, 1);

    element.style.transform = `scale(${scale})`;
    element.style.transformOrigin = "center";

    setTimeout(() => {
      window.print();
      element.style.transform = "scale(1)";
    }, 100);
  }

  const handleEdit = () => {
    router.push(`/dashboard/receipt/edit/${receipt.id}`)
  }

  const handleConfirmDelete = async () => {
  if (!receipt) return
  setIsDeleting(true)
  try {
    await deleteReceipt(receipt.id)
    toast.success('Receipt deleted successfully') // ✅ success toast
    router.push('/dashboard/receipt/receipts') // redirect back after deletion
  } catch (error) {
    console.error('Failed to delete receipt:', error)
    toast.error('Failed to delete receipt') // ❌ error toast
  } finally {
    setIsDeleting(false)
    setShowDeleteConfirm(false)
  }
}





  return (
    <div className="w-full space-y-4">

      {/* Action Buttons */}
      {session && ( // Only show if user is logged in
      <div className="flex gap-2 print:hidden relative">

        <div className="flex gap-2 w-full sm:hidden">

          <Button onClick={handlePrint} className="action-btn flex-1 flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white border-0">
            <Printer className="w-4 h-4" />
            <span className=" xs:inline">Print</span>
          </Button>

          

          <Link href={`/dashboard/receipt/edit/${receipt.id}`}  className="action-btn flex items-center gap-2 cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0">
            <Edit className="w-4 h-4" />
            Edit
          </Link>

          <Button 
            onClick={() => setShowDropdown(!showDropdown)} 
            className="action-btn flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-0 px-3"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>

        </div>

        <div className="hidden sm:flex gap-2 w-full">

          <Button onClick={handlePrint} className="action-btn flex items-center gap-2 cursor-pointer bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white border-0">
            <Printer className="w-4 h-4" />
            Print
          </Button>

          <Button onClick={handleEdit} className="action-btn flex items-center gap-2 cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0">
            <Edit className="w-4 h-4" />
            Edit
          </Button>

          <Button onClick={() => setShowDeleteConfirm(true)} className="action-btn flex items-center gap-2 cursor-pointer bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0">
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>

        </div>

      </div>
      )
    }

      {/* Receipt */}
      <div ref={receiptRef} className="receipt-print-container mx-auto max-w-200">

        <Card className="border-0 shadow-lg print:shadow-none receipt-card">

          <CardHeader className="pb-4 pt-4 print:pb-2 print:pt-2">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

              <div className="flex-1">

                {company.logo && (
                  <img src={company.logo} alt={company.name} className="h-16 w-auto object-cover" />
                )}

                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{company.name}</h1>
                  <p className="text-muted-foreground text-sm">{company.email}</p>

                  {company.contacts.length > 0 && (
                    <div className="text-sm text-muted-foreground mt-2">
                      {company.contacts.map((contact:any, index:number) => (
                        <div key={index}>
                          {contact.name} • {contact.phone}
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>

              <div className="flex flex-col items-center gap-4">

                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">RECEIPT</div>
                  <div className="text-muted-foreground text-sm font-semibold">
                    {receiptNumber}
                  </div>
                </div>

                <div className="p-2 qr-code bg-white rounded-lg border">

                  <QRCodeCanvas
                    value={generateReceiptQRData({
                      id: receipt.id,
                      receiptNumber,
                      companyName: company.name,
                      customerName: receipt.customerName,
                      customerOrganization: receipt.customerOrganization,
                      projectName: receipt.projectName,
                      serviceType: receipt.serviceType,
                      projectTotal: receipt.projectTotal,
                      amountPaid: receipt.amountPaid,
                      remainingBalance: receipt.remainingBalance,
                      currency: receipt.currency,
                      paymentMethod: receipt.paymentMethod,
                      issueDate: new Date(receipt.createdAt).toLocaleDateString(),
                      projectStartDate: new Date(receipt.projectStartDate).toLocaleDateString(),
                      projectEndDate: new Date(receipt.projectEndDate).toLocaleDateString(),
                    })}
                    size={100}
                    level="M"
                  />

                </div>

              </div>

            </div>

          </CardHeader>

          {/* UI BELOW REMAINS EXACTLY THE SAME */}

          <CardContent className="space-y-6">

            {/* Date Info */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs font-semibold uppercase">Issue Date</p>
                <p className="font-medium">{new Date(receipt.createdAt).toLocaleDateString()}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs font-semibold uppercase">Project Start</p>
                <p className="font-medium">{new Date(receipt.projectStartDate).toLocaleDateString()}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs font-semibold uppercase">Project End</p>
                <p className="font-medium">{new Date(receipt.projectEndDate).toLocaleDateString()}</p>
              </div>
            </div>

            <Separator />

            <div className='w-full min-h-1 flex justify-between md:pr-34 pr-0'>

               <div>
                <p className="text-muted-foreground text-xs font-semibold uppercase mb-2">Bill To</p>

                <div className="space-y-1">
                  <p className="font-semibold">{receipt.customerOrganization}</p>
                  <p className="text-sm text-muted-foreground">{receipt.customerEmail}</p>

                  {receipt.clientContacts?.length > 0 && (
                    <div className="text-sm text-muted-foreground mt-2 space-y-1">
                      {receipt.clientContacts.map((contact:any, index:number) => (
                        <div key={index}>
                          <p className="font-medium text-foreground">{contact.name}</p>
                          <p>{contact.email}</p>
                          <p>{contact.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-xs font-semibold uppercase mb-2">Project Details</p>

                <div className="space-y-2 text-sm">

                  <div>
                    <p className="text-muted-foreground">Project Name</p>
                    <p className="font-medium">{receipt.projectName}</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Service Type</p>
                    <p className="font-medium">{receipt.serviceType}</p>
                  </div>

                </div>

              </div>


            </div>

             

               {receipt.description && (
              <>
                <Separator />
                <div>
                  <p className="text-muted-foreground text-xs font-semibold uppercase mb-2">Description</p>
                  <p className="text-sm leading-relaxed">{receipt.description}</p>
                </div>
              </>
            )}

            <Separator />

{/* Financial Summary */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

  {/* Payment Method */}
  <div className="space-y-3">
    <p className="text-muted-foreground text-xs font-semibold uppercase mb-4">Payment Method</p>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Method</span>
        <span className="font-medium">{receipt.paymentMethod}</span>
      </div>
      {receipt.paymentMethod === 'Bank' && (
        <>
          {receipt.bankName && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bank</span>
              <span className="font-medium">{receipt.bankName}</span>
            </div>
          )}
          {receipt.bankAccountNumber && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account</span>
              <span className="font-medium">{receipt.bankAccountNumber}</span>
            </div>
          )}
        </>
      )}
      {receipt.paymentMethod === 'Mobile Money' && (
        <>
          {receipt.mobileMoneyProvider && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Provider</span>
              <span className="font-medium">{receipt.mobileMoneyProvider}</span>
            </div>
          )}
          {receipt.mobileNumber && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mobile</span>
              <span className="font-medium">{receipt.countryCode} {receipt.mobileNumber}</span>
            </div>
          )}
        </>
      )}
    </div>
  </div>

  {/* Pie Chart */}
  <div className="flex flex-col items-center justify-center">
    <p className="text-muted-foreground text-xs font-semibold uppercase mb-4">Payment Status</p>
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            <Cell fill="#22c55e" /> {/* Paid */}
            <Cell fill="#ef4444" /> {/* Remaining */}
          </Pie>
          <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Amount Due */}
  <div className="space-y-3">
    <p className="text-muted-foreground text-xs font-semibold uppercase mb-4">Amount Due</p>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Project Total</span>
        <span className="font-medium">{receipt.currency} {receipt.projectTotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">Amount Paid</span>
        <span className="font-medium text-green-600">{receipt.currency} {receipt.amountPaid.toFixed(2)}</span>
      </div>
      <Separator className="my-2" />
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground font-semibold">Remaining Balance</span>
       <span className={`text-lg font-bold ${receipt.remainingBalance > 0 ? 'text-destructive' : 'text-green-600'}`}>
        {receipt.currency} {receipt.remainingBalance.toFixed(2)}
       </span>
      </div>
    </div>
  </div>

</div>

              {/* Footer */}
            <div className="pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                Thank you! Please retain this receipt for your records.
              </p>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Receipt Generated: {new Date().toLocaleString()}
              </p>
            </div>

          </CardContent>

        </Card>

        {showDeleteConfirm && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-card border border-border rounded-2xl max-w-sm w-full p-6 shadow-xl">
      <h3 className="text-lg font-semibold text-foreground mb-2">Delete Receipt?</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Are you sure you want to delete this receipt? This action cannot be undone.
      </p>
      <div className="flex gap-3 justify-end">
        <Button
          variant="outline"
          onClick={() => setShowDeleteConfirm(false)}
          disabled={isDeleting}
          className="px-4 py-2"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleConfirmDelete}
          disabled={isDeleting}
          className="px-4 py-2"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  </div>
)}

      </div>

    </div>

    
  )

  
}

