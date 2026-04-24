'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { createReceipt } from "@/actions/receipt-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Plus } from 'lucide-react'
import { sampleCompany, sampleReceipt } from '@/lib/sample-data'
import { Currency } from '@/lib/currency'
import { CurrencySelector } from './currency-selector'
import { CountryCodeSelect } from './country-code-select'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface ContactField {
  id: string
  name: string
  email: string
  phone: string
  countryCode: string
}
const countryCodes = [
  { code: "+1", country: "USA / Canada" },
  { code: "+7", country: "Russia" },
  { code: "+20", country: "Egypt" },
  { code: "+27", country: "South Africa" },
  { code: "+30", country: "Greece" },
  { code: "+31", country: "Netherlands" },
  { code: "+32", country: "Belgium" },
  { code: "+33", country: "France" },
  { code: "+34", country: "Spain" },
  { code: "+39", country: "Italy" },
  { code: "+41", country: "Switzerland" },
  { code: "+44", country: "United Kingdom" },
  { code: "+49", country: "Germany" },
  { code: "+52", country: "Mexico" },
  { code: "+54", country: "Argentina" },
  { code: "+55", country: "Brazil" },
  { code: "+61", country: "Australia" },
  { code: "+62", country: "Indonesia" },
  { code: "+63", country: "Philippines" },
  { code: "+64", country: "New Zealand" },
  { code: "+65", country: "Singapore" },
  { code: "+66", country: "Thailand" },
  { code: "+81", country: "Japan" },
  { code: "+82", country: "South Korea" },
  { code: "+84", country: "Vietnam" },
  { code: "+86", country: "China" },
  { code: "+90", country: "Turkey" },
  { code: "+91", country: "India" },
  { code: "+92", country: "Pakistan" },
  { code: "+94", country: "Sri Lanka" },
  { code: "+212", country: "Morocco" },
  { code: "+213", country: "Algeria" },
  { code: "+216", country: "Tunisia" },
  { code: "+218", country: "Libya" },
  { code: "+220", country: "Gambia" },
  { code: "+221", country: "Senegal" },
  { code: "+222", country: "Mauritania" },
  { code: "+223", country: "Mali" },
  { code: "+224", country: "Guinea" },
  { code: "+225", country: "Ivory Coast" },
  { code: "+226", country: "Burkina Faso" },
  { code: "+227", country: "Niger" },
  { code: "+228", country: "Togo" },
  { code: "+229", country: "Benin" },
  { code: "+230", country: "Mauritius" },
  { code: "+231", country: "Liberia" },
  { code: "+232", country: "Sierra Leone" },
  { code: "+233", country: "Ghana" },
  { code: "+234", country: "Nigeria" },
  { code: "+235", country: "Chad" },
  { code: "+236", country: "Central African Republic" },
  { code: "+237", country: "Cameroon" },
  { code: "+238", country: "Cape Verde" },
  { code: "+239", country: "Sao Tome & Principe" },
  { code: "+240", country: "Equatorial Guinea" },
  { code: "+241", country: "Gabon" },
  { code: "+242", country: "Congo" },
  { code: "+243", country: "DR Congo" },
  { code: "+244", country: "Angola" },
  { code: "+245", country: "Guinea-Bissau" },
  { code: "+248", country: "Seychelles" },
  { code: "+249", country: "Sudan" },
  { code: "+250", country: "Rwanda" },
  { code: "+251", country: "Ethiopia" },
  { code: "+252", country: "Somalia" },
  { code: "+253", country: "Djibouti" },
  { code: "+254", country: "Kenya" },
  { code: "+255", country: "Tanzania" },
  { code: "+256", country: "Uganda" },
  { code: "+257", country: "Burundi" },
  { code: "+258", country: "Mozambique" },
  { code: "+260", country: "Zambia" },
  { code: "+261", country: "Madagascar" },
  { code: "+263", country: "Zimbabwe" },
  { code: "+264", country: "Namibia" },
  { code: "+265", country: "Malawi" },
  { code: "+266", country: "Lesotho" },
  { code: "+267", country: "Botswana" },
  { code: "+268", country: "Eswatini" },
]

interface ReceiptFormData {
  id:string
  // Customer info
  customerName: string
  customerNames: { id: string; name: string }[]
  customerEmail: string
  customerEmails: { id: string; email: string }[]
  customerOrganization: string
  clientContacts: ContactField[]

  // Project info
  projectName: string
  serviceType: string
  projectStartDate: string
  projectEndDate: string
  description: string

  // Financial
  projectTotal: number
  amountPaid: number
  remainingBalance: number
  currency: Currency

  // Payment
  paymentMethod: string
  bankName: string
  bankAccountNumber: string
  cardNumber: string
  mobileMoneyProvider: string
  mobileNumber: string
  countryCode: string

   // company info
  companyName?: string
  companyEmail?: string
  companyLogo?: string
  companyContacts?: { name: string; phone: string }[]
}

interface SampleContact {
  name: string
  email: string
  phone: string
  countryCode?: string
}

const clientContacts: SampleContact[] = sampleReceipt.clientContacts

const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'UGX': 'USh',
    'KES': 'KSh',
    'NGN': '₦',
    'ZAR': 'R',
    'CAD': 'C$',
    'AUD': 'A$',
    'JPY': '¥',
    'CNY': '¥',
    'CHF': 'CHF',
  }
  return symbols[currency] || currency
}

export function ReceiptForm({ company }: { company: any }) {
  const [formData, setFormData] = useState<ReceiptFormData>({
    id: '',
    customerName: '',
    customerNames: [],
    customerEmail: '',
    customerEmails: [],
    customerOrganization: '',
    clientContacts: [],
    projectName: '',
    serviceType: '',
    projectStartDate: '',
    projectEndDate: '',
    description: '',
    projectTotal: 0,
    amountPaid: 0,
    remainingBalance: 0,
    currency: 'UGX',
    paymentMethod: 'Cash',
    bankName: '', 
    bankAccountNumber: '',
    cardNumber: '',
    mobileMoneyProvider: '',
    mobileNumber: '',
    countryCode: '+256',

    // Company Info Initialized
  companyName: company?.name || '',
  companyEmail: company?.email || '',
  companyLogo: company?.logo || '',
  companyContacts: company?.contacts || [],
  })

  // Calculate remaining balance whenever total or paid changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      remainingBalance: prev.projectTotal - prev.amountPaid,
    }))
  }, [formData.projectTotal, formData.amountPaid])

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

 const [loading, setLoading] = useState(false);

 const router = useRouter()

 const handleGenerateReceipt = async () => {
  setLoading(true);
  try {
    const savedReceipt = await createReceipt(formData);
    console.log("Receipt saved:", savedReceipt);

    toast.success("Receipt Created Successfully!"); // ✅ success toast

    // Optionally, reset the form
    setFormData({
      id:'',
      customerName: '',
      customerNames: [],
      customerEmail: '',
      customerEmails: [],
      customerOrganization: '',
      clientContacts: [],
      projectName: '',
      serviceType: '',
      projectStartDate: '',
      projectEndDate: '',
      description: '',
      projectTotal: 0,
      amountPaid: 0,
      remainingBalance: 0,
      currency: 'UGX',
      paymentMethod: 'Cash',
      bankName: '',
      bankAccountNumber: '',
      cardNumber: '',
      mobileMoneyProvider: '',
      mobileNumber: '',
      countryCode: '+256',
    });

    // ✅ Navigate to /receipt/all-receipts after creation
    router.push('/dashboard/receipt/receipts');

  } catch (err) {
    console.error(err);
    toast.error("Failed to create Receipt!"); // ❌ error toast
  } finally {
    setLoading(false);
  }
};
  const addCustomerName = () => {
    const newId = Date.now().toString()
    setFormData(prev => ({
      ...prev,
      customerNames: [...prev.customerNames, { id: newId, name: '' }],
    }))
  }

  const removeCustomerName = (id: string) => {
    setFormData(prev => ({
      ...prev,
      customerNames: prev.customerNames.filter(n => n.id !== id),
    }))
  }

  const updateCustomerName = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customerNames: prev.customerNames.map(n =>
        n.id === id ? { ...n, name: value } : n
      ),
    }))
  }

  const addCustomerEmail = () => {
    const newId = Date.now().toString()
    setFormData(prev => ({
      ...prev,
      customerEmails: [...prev.customerEmails, { id: newId, email: '' }],
    }))
  }

  const removeCustomerEmail = (id: string) => {
    setFormData(prev => ({
      ...prev,
      customerEmails: prev.customerEmails.filter(e => e.id !== id),
    }))
  }

  const updateCustomerEmail = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customerEmails: prev.customerEmails.map(e =>
        e.id === id ? { ...e, email: value } : e
      ),
    }))
  }

  const addContact = () => {
    const newId = Date.now().toString()
    setFormData(prev => ({
      ...prev,
      clientContacts: [
        ...prev.clientContacts,
        { id: newId, name: '', email: '', phone: '', countryCode: '' },
      ],
    }))
  }

  const removeContact = (id: string) => {
    setFormData(prev => ({
      ...prev,
      clientContacts: prev.clientContacts.filter(c => c.id !== id),
    }))
  }

  const updateContact = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      clientContacts: prev.clientContacts.map(c =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    }))
  }

  return (
    <div className="space-y-6">

      {/* ===== Company Info + QR Code Placeholder ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Pulled from your Company Configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {formData.companyLogo && (
              <img src={formData.companyLogo} alt={formData.companyName} className="h-16 w-auto object-cover rounded-lg border" />
            )}
            <div className="space-y-1">
              <p className="font-semibold text-lg">{formData.companyName}</p>
              <p className="text-sm text-muted-foreground">{formData.companyEmail}</p>
              {formData.companyContacts && formData.companyContacts.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {formData.companyContacts.map((contact, idx) => (
                    <p key={idx}>
                      {contact.name} • {contact.phone}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 p-3 bg-muted rounded-lg border text-center">
            <p className="text-sm font-medium text-muted-foreground">
              QR Code will be auto-generated upon receipt creation
            </p>
          </div>
        </CardContent>
      </Card>


      {/* Customer Section */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>Enter your client's details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer-org">Client Organization *</Label>
              <Input
                id="customer-org"
                value={formData.customerOrganization}
                onChange={e => handleChange('customerOrganization', e.target.value)}
                placeholder="e.g., Acme Corporation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer-primary-email">Primary Email *</Label>
              <Input
                id="customer-primary-email"
                type="email"
                value={formData.customerEmail}
                onChange={e => handleChange('customerEmail', e.target.value)}
                placeholder="contact@company.com"
              />
            </div>
          </div>

          {/* Additional Customer Names */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Customer Names</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomerName}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Name
              </Button>
            </div>
            <div className="space-y-2">
              {formData.customerNames.map(name => (
                <div key={name.id} className="flex items-end gap-2">
                  <div className="flex-1">
                    <Input
                      value={name.name}
                      onChange={e => updateCustomerName(name.id, e.target.value)}
                      placeholder="Customer name"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomerName(name.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Customer Emails */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Customer Emails</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomerEmail}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Email
              </Button>
            </div>
            <div className="space-y-2">
              {formData.customerEmails.map(email => (
                <div key={email.id} className="flex items-end gap-2">
                  <div className="flex-1">
                    <Input
                      type="email"
                      value={email.email}
                      onChange={e => updateCustomerEmail(email.id, e.target.value)}
                      placeholder="customer@email.com"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomerEmail(email.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          
          {/* Client Contacts */}
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <Label>Client Contact Persons</Label>
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={addContact}
      className="gap-2"
    >
      <Plus className="w-4 h-4" />
      Add Contact
    </Button>
  </div>
  <div className="space-y-3">
    {formData.clientContacts.map(contact => (
      <div key={contact.id} className="border border-border rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Input
              value={contact.name}
              onChange={e => updateContact(contact.id, 'name', e.target.value)}
              placeholder="Contact name"
            />
          </div>
          <div className="space-y-1">
            <Input
              type="email"
              value={contact.email}
              onChange={e => updateContact(contact.id, 'email', e.target.value)}
              placeholder="Email"
            />
          </div>
        </div>
        <div className="flex items-end gap-2">
          <select
            className="border rounded-md px-2 py-2 bg-background text-sm min-w-fit"
            value={contact.countryCode  || '+256'}
            onChange={e => updateContact(contact.id, 'countryCode', e.target.value)}
          >
            {countryCodes.map(c => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </select>
          <Input
            value={contact.phone}
            onChange={e => updateContact(contact.id, 'phone', e.target.value)}
            placeholder="Phone number"
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeContact(contact.id)}
            className="text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    ))}
  </div>
</div>

        </CardContent>
      </Card>

      {/* Project Information */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Provide information about the project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name *</Label>
            <Input
              id="project-name"
              value={formData.projectName}
              onChange={e => handleChange('projectName', e.target.value)}
              placeholder="e.g., E-commerce Platform Development"
            />
          </div>

         <div className="space-y-2">
  <Label htmlFor="service-type">Service Type *</Label>
  <Select
    value={formData.serviceType}
    onValueChange={(value) => handleChange('serviceType', value)}
  >
    <SelectTrigger id="service-type">
      <SelectValue placeholder="Select a service type" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Website Development">Website Development</SelectItem>
      <SelectItem value="Web System">Mobile App Development</SelectItem>
      <SelectItem value="Graphics Design">Graphics Design</SelectItem>
      <SelectItem value="Graphics Design">Digital Marketing</SelectItem>
    </SelectContent>
  </Select>
</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Project Start Date *</Label>
              <Input
                id="start-date"
                type="date"
                value={formData.projectStartDate}
                onChange={e => handleChange('projectStartDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Expected End Date *</Label>
              <Input
                id="end-date"
                type="date"
                value={formData.projectEndDate}
                onChange={e => handleChange('projectEndDate', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Describe what will be delivered..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Details</CardTitle>
          <CardDescription>Enter project costs and payment information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="total">Total Project Amount *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {getCurrencySymbol(formData.currency)}
                  </span>
                  <Input
                    id="total"
                    type="number"
                    value={formData.projectTotal}
                    onChange={e => handleChange('projectTotal', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paid">Amount Paid *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {getCurrencySymbol(formData.currency)}
                  </span>
                  <Input
                    id="paid"
                    type="number"
                    value={formData.amountPaid}
                    onChange={e => handleChange('amountPaid', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
            
            <CurrencySelector
              value={formData.currency}
              onValueChange={(currency) => handleChange('currency', currency)}
              showConversionInfo={true}
              referenceAmount={formData.projectTotal}
              referenceCurrency="USD"
            />
          </div>

          <div className="space-y-2">
            <Label>Remaining Balance</Label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-muted-foreground">
                {getCurrencySymbol(formData.currency)}
              </span>
              <span className="text-lg font-semibold">
                {formData.remainingBalance.toLocaleString('en-US', {
                  minimumFractionDigits: ['UGX'].includes(formData.currency) ? 0 : 2,
                  maximumFractionDigits: ['UGX'].includes(formData.currency) ? 0 : 2,
                })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Auto-calculated: Total Amount - Amount Paid
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>How should this receipt be paid?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method *</Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => handleChange('paymentMethod', value)}>
              <SelectTrigger id="payment-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Bank">Bank Transfer</SelectItem>
                <SelectItem value="Mobile Money">Mobile Money</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.paymentMethod === 'Bank' && (
            <div className="space-y-4 p-4 bg-secondary/20 rounded-lg border border-secondary">
              <div className="space-y-2">
                <Label htmlFor="bank-name">Bank Name</Label>
                <Input
                  id="bank-name"
                  value={formData.bankName}
                  onChange={e => handleChange('bankName', e.target.value)}
                  placeholder="e.g., First National Bank"
                />
              </div>
              <div className="space-y-2">
                <Label>Bank Account Details</Label>
                <div className="space-y-2">
                  <Input
                    value={formData.bankAccountNumber}
                    onChange={e => handleChange('bankAccountNumber', e.target.value)}
                    placeholder="Account Number"
                  />
                  <Input
                    value={formData.cardNumber}
                    onChange={e => handleChange('cardNumber', e.target.value)}
                    placeholder="Card Number (if applicable)"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.paymentMethod === 'Mobile Money' && (
            <div className="space-y-4 p-4 bg-secondary/20 rounded-lg border border-secondary">
              <div className="space-y-2">
                <Label htmlFor="provider">Mobile Money Provider</Label>
                <Select value={formData.mobileMoneyProvider} onValueChange={(value) => handleChange('mobileMoneyProvider', value)}>
                  <SelectTrigger id="provider">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MTN Momo">MTN Momo</SelectItem>
                    <SelectItem value="Airtel Money">Airtel Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country-code">Country Code</Label>
                  <CountryCodeSelect
                    value={formData.countryCode}
                    onValueChange={(value) => handleChange('countryCode', value)}
                    placeholder="Select country"
                    searchable={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    value={formData.mobileNumber}
                    onChange={e => handleChange('mobileNumber', e.target.value)}
                    placeholder="700 123 456"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
        <Button onClick={handleGenerateReceipt} className="w-full sm:w-auto">
           {loading ? "Generating Receipt..." : "Generate Receipt"}
        </Button>
      </div>
    </div>
  )
}
