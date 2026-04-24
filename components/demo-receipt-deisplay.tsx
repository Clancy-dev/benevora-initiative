'use client'

import React, { useRef, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Download, Printer, Edit, History, Trash2, MoreVertical } from 'lucide-react'
import { sampleCompany, sampleReceipt } from '@/lib/sample-data'
import { generateReceiptNumber } from '@/lib/qr-code'
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react"
import { generateReceiptQRData } from "@/lib/qr-code"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

// PDF libraries
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export function ReceiptDisplay() {
  const [showDropdown, setShowDropdown] = useState(false)
  const company = sampleCompany
  const receipt = sampleReceipt
  const receiptRef = useRef<HTMLDivElement>(null)

  const receiptNumber = generateReceiptNumber(receipt.id, receipt.createdAt)

  // Calculate payment percentages for pie chart
  const paidPercentage = (receipt.amountPaid / receipt.projectTotal) * 100
  const remainingPercentage = (receipt.remainingBalance / receipt.projectTotal) * 100
  
  const chartData = [
    { name: `Paid (${paidPercentage.toFixed(0)}%)`, value: paidPercentage },
    { name: `Remaining (${remainingPercentage.toFixed(0)}%)`, value: remainingPercentage }
  ]

  // Print handler
  const handlePrint = () => {
  if (!receiptRef.current) return;

  const element = receiptRef.current;

  // A4 dimensions in pixels (screen approximation)
  const pageWidth = 794; // 210mm
  const pageHeight = 1123; // 297mm

  const elementWidth = element.scrollWidth;
  const elementHeight = element.scrollHeight;

  // Scale factor to fit page
  const scaleX = pageWidth / elementWidth;
  const scaleY = pageHeight / elementHeight;
  const scale = Math.min(scaleX, scaleY, 1); // shrink only if needed

  // Apply scaling
  element.style.transform = `scale(${scale})`;
  element.style.transformOrigin = "center";

  // Add small timeout to ensure scaling applies before print
  setTimeout(() => {
    window.print();

    // Reset scaling after print
    element.style.transform = "scale(1)";
  }, 100);
};




  const handleEdit = () => {
    // Functionality to be implemented
  }

  const handleReceiptHistory = () => {
    // Functionality to be implemented
  }

  const handleDelete = () => {
    // Functionality to be implemented
  }

  return (
    <div className="w-full space-y-4">
 <style>{`
 
@keyframes shake {
  0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
  25% { transform: translateX(-3px) translateY(-2px) rotate(-1deg); }
  50% { transform: translateX(3px) translateY(2px) rotate(1deg); }
  75% { transform: translateX(-2px) translateY(-3px) rotate(-1deg); }
}

.action-btn:hover {
  animation: shake 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.action-btn:hover svg {
  animation: shake 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@media print {

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    box-sizing: border-box;
  }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 210mm !important;
    max-width: 210mm !important;
    height: auto !important;
    overflow: visible !important;
    
    
  }

  @page {
    size: A4;
    margin: 0;
    background-color:#F8F8F8;

  }

  /* Force all parent containers to stop limiting width */
  body * {
    max-width: none !important;
  }

  /* Main receipt container */
  .receipt-print-container {
    display: flex !important;
    justify-content: center !important;
    width: 100% !important;  /* let it shrink/grow */
    padding: 10mm 0 !important; /* optional top/bottom spacing */
   
  }

  /* Receipt card fills page */
  .receipt-card {
    width: auto !important;   /* let card shrink to content */
    max-width: 180mm !important; /* slightly smaller than page width */
    margin: 0 auto !important; /* truly center */
    box-shadow: none !important;
  }

  /* Images */
  .receipt-card img {
    max-height: 60px !important;
    height: auto !important;
  }

  /* Typography */
  .receipt-card .text-4xl {
    font-size: 28px !important;
  }

  .receipt-card .text-2xl {
    font-size: 18px !important;
  }

  .receipt-card .text-3xl {
    font-size: 22px !important;
  }

  .receipt-card .text-lg {
    font-size: 14px !important;
  }

  .receipt-card .text-sm {
    font-size: 10px !important;
  }

  .receipt-card .text-xs {
    font-size: 8px !important;
  }

  .receipt-card .space-y-6 > * {
    margin-top: 0.25rem !important;
    margin-bottom: 0.25rem !important;
  }

  /* QR */
  .receipt-card .qr-code svg {
    width: 80px !important;
    height: 80px !important;
  }

  /* Hide buttons */
  .print\\:hidden {
    display: none !important;
  }

  /* Grid fixes */
  .md\\:grid-cols-2 {
    grid-template-columns: 1fr 1fr !important;
  }

  .grid-cols-3 {
    grid-template-columns: 1fr 1fr 1fr !important;
  }

  .sm\\:flex-row {
    flex-direction: row !important;
  }

}
`}</style>
      {/* Action Buttons */}
      <div className="flex gap-2 print:hidden relative">
        {/* Mobile View - 3 buttons + dropdown */}
        <div className="flex gap-2 w-full sm:hidden">
          
          <Button onClick={handlePrint} className="action-btn flex-1 flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white border-0">
            <Printer className="w-4 h-4" />
            <span className=" xs:inline">Print</span>
          </Button>
          <Button onClick={handleEdit} className="action-btn flex items-center gap-2 cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button 
            onClick={() => setShowDropdown(!showDropdown)} 
            className="action-btn flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white border-0 px-3"
          >
            <MoreVertical className="w-4 h-4" />

          </Button>
        </div>

        {/* Desktop View - All buttons */}
        <div className="hidden sm:flex gap-2 w-full">
          <Button onClick={handlePrint} className="action-btn flex items-center gap-2 cursor-pointer bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white border-0">
            <Printer className="w-4 h-4" />
            Print
          </Button>
          <Button onClick={handleEdit} className="action-btn flex items-center gap-2 cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button onClick={handleReceiptHistory} className="action-btn flex items-center gap-2 cursor-pointer bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0">
            <History className="w-4 h-4" />
            Receipt History
          </Button>
          <Button onClick={handleDelete} className="action-btn flex items-center gap-2 cursor-pointer bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0">
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Dropdown Menu for Mobile */}
      {showDropdown && (
        <div className="sm:hidden flex flex-col gap-2 print:hidden bg-slate-50 p-3 rounded-lg border border-slate-200">
          <Button onClick={() => { handleReceiptHistory(); setShowDropdown(false); }} className="action-btn w-full flex items-center gap-2 cursor-pointer bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 justify-start">
            <History className="w-4 h-4" />
            Receipt History
          </Button>
          <Button onClick={() => { handleDelete(); setShowDropdown(false); }} className="action-btn w-full flex items-center gap-2 cursor-pointer bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 justify-start">
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      )}

      {/* Receipt */}
      <div ref={receiptRef} className="receipt-print-container mx-auto max-w-200">
        <Card className="border-0 shadow-lg print:shadow-none receipt-card">
          <CardHeader className="pb-4 pt-4 print:pb-2 print:pt-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Company Info */}
              <div className="flex-1">
                {company.logo && (
                  <img src={company.logo} alt={company.name} className="h-16 w-auto object-cover" />
                )}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{company.name}</h1>
                  <p className="text-muted-foreground text-sm">{company.email}</p>
                  {company.contacts.length > 0 && (
                    <div className="text-sm text-muted-foreground mt-2">
                      {company.contacts.map((contact, index) => (
                        <div key={index}>
                          {contact.name} • {contact.phone}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Receipt Title, Number and QR Code */}
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
                      projectStartDate: receipt.projectStartDate.toLocaleDateString(),
                      projectEndDate: receipt.projectEndDate.toLocaleDateString(),
                    })}
                    size={100}
                    level="M"
                  />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Date Info */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs font-semibold uppercase">Issue Date</p>
                <p className="font-medium">{new Date(receipt.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-semibold uppercase">Project Start</p>
                <p className="font-medium">{receipt.projectStartDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-semibold uppercase">Project End</p>
                <p className="font-medium">{receipt.projectEndDate.toLocaleDateString()}</p>
              </div>
            </div>

            <Separator />

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground text-xs font-semibold uppercase mb-2">Bill To</p>
                <div className="space-y-1">
                  <p className="font-semibold">{receipt.customerOrganization}</p>
                  <p className="text-sm text-muted-foreground">{receipt.customerEmail}</p>
                  {receipt.clientContacts.length > 0 && (
                    <div className="text-sm text-muted-foreground mt-2 space-y-1">
                      {receipt.clientContacts.map((contact, index) => (
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

              {/* Project Details */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="flex flex-col items-center justify-center">
                <p className="text-muted-foreground text-xs font-semibold uppercase mb-4">Payment Status</p>
                <ResponsiveContainer width="100%" height={250}>
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
                      <Cell fill="#22c55e" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip
                       formatter={(value) => {
                       if (typeof value === "number") {
                       return `${value.toFixed(1)}%`;
                        }
                       return value; // fallback
                       }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

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

              <div className="space-y-3">
                <p className="text-muted-foreground text-xs font-semibold uppercase mb-4">Amount Due</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project Total</span>
                    <span className="font-medium">${receipt.projectTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="font-medium amount-paid text-green-600">-${receipt.amountPaid.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">Remaining Balance</span>
                    <span className={`text-lg remaining-balance font-bold ${receipt.remainingBalance > 0 ? 'text-destructive' : 'text-green-600'}`}>
                      ${receipt.remainingBalance.toFixed(2)}
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
      </div>
    </div>
  )
}
