// QR Code generation utility
// Generates QR codes with comprehensive receipt information

export interface ReceiptDataForQR {
  id:string
  receiptNumber: string
  companyName: string
  customerName: string
  customerOrganization: string
  projectName: string
  serviceType: string
  projectTotal: number
  amountPaid: number
  remainingBalance: number
  currency: string
  paymentMethod: string
  issueDate: string
  projectStartDate: string
  projectEndDate: string
}

export function generateQRCodeDataUrl(data: string): string {
  // Using QR Server API for simple QR code generation
  // This creates a QR code that can be displayed as an image
  const encodedData = encodeURIComponent(data)
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`
}

// Generates a URL QR code instead of plain text
export function generateReceiptQRData(receiptData: ReceiptDataForQR): string {
  console.log(receiptData.id)
  if (!receiptData?.id) {
    console.error("Receipt ID is missing:", receiptData)
    return ""
  }
  // Replace 'yourapp.com' with your actual domain
  return `https://receiptzgenerator.vercel.app/dashboard/receipt/view/${receiptData.id}`
}

export function getReceiptQRUrl(receiptData: ReceiptDataForQR): string {
  console.log("FULL RECEIPT:", receiptData)
  const qrData = generateReceiptQRData(receiptData)
  return generateQRCodeDataUrl(qrData)
}

// Helper function to generate user-friendly receipt number
export function generateReceiptNumber(receiptId: string, createdAt: Date): string {
  // Format: RCP-YYYYMMDD-XXXX (e.g., RCP-20240315-A1B2)
  const date = new Date(createdAt)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const shortId = receiptId.substring(0, 4).toUpperCase()
  
  return `RCP-${year}${month}${day}-${shortId}`
}
