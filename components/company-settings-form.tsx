'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Trash2, Plus, Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { createCompanySettings, getCompanySettings, updateCompanySettings } from '@/actions/company-setting-actions'

interface Contact {
  id: string
  name: string
  phone: string
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

interface CompanyData {
  id?: string
  name: string
  email: string
  logo?: string
  contacts: Contact[]
}

export function CompanySettingsForm() {
  const [company, setCompany] = useState<CompanyData>({
    name: 'Your Company Name',
    email: 'contact@yourcompany.com',
    logo: undefined,
    contacts: [],
  })

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [newContact, setNewContact] = useState({
    name: '',
    countryCode: '+256',
    phone: '',
  })

  const [openDialog, setOpenDialog] = useState(false)

  // Helper: map DB result to CompanyData
  const mapCompanyFromDB = (data: any): CompanyData => {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      logo: data.logo ?? undefined,
      contacts: (data.contacts as Contact[]) ?? [],
    }
  }

  const handleCompanyChange = (field: string, value: string) => {
    setCompany(prev => ({ ...prev, [field]: value }))
  }

const handleSaveCompanySettings = async () => {
  setLoading(true)

  // Prepare the company data to send to the server
  const companyData = {
    name: company.name,
    email: company.email,
    logo: company.logo,
    contacts: company.contacts.map(c => ({ name: c.name, phone: c.phone })),
  }

  console.log('Preparing to save company settings:', companyData)

  try {
    let savedCompany

    if (company.id) {
      console.log('Updating existing company with id:', company.id)
      savedCompany = await updateCompanySettings(company.id, companyData)
    } else {
      console.log('Creating new company...')
      savedCompany = await createCompanySettings(companyData)
    }

    console.log('Server returned:', savedCompany)

    // Convert contacts back from JsonValue safely
    const contactsFromServer: Contact[] = Array.isArray(savedCompany.contacts)
  ? (savedCompany.contacts as any[]).map(item => ({
      id: item.id ?? Date.now().toString(), // fallback id if missing
      name: item.name ?? "",
      phone: item.phone ?? "",
    }))
  : []

    // Update local state
    setCompany({
      id: savedCompany.id,
      name: savedCompany.name,
      email: savedCompany.email,
      logo: savedCompany.logo ?? undefined,
      contacts: contactsFromServer,
    })

    console.log('Local state updated:', {
      id: savedCompany.id,
      name: savedCompany.name,
      email: savedCompany.email,
      logo: savedCompany.logo,
      contacts: contactsFromServer,
    })

    toast({
      title: 'Success',
      description: 'Company settings saved successfully',
      variant: 'default',
    })

    setIsEditing(false)
  } catch (error) {
    console.error('Failed to save company settings:', error)
    toast({
      title: 'Error',
      description: 'Failed to save company settings. Please try again.',
      variant: 'destructive',
    })
  } finally {
    setLoading(false)
  }
}

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: Contact = {
        id: Date.now().toString(),
        name: newContact.name,
        phone: `${newContact.countryCode} ${newContact.phone}`,
      }

      setCompany(prev => ({
        ...prev,  
        contacts: [...prev.contacts, contact],
      }))

      setNewContact({
        name: '',
        countryCode: '+256',
        phone: '',
      })

      setOpenDialog(false)
    }
  }

  const handleRemoveContact = (id: string) => {
    setCompany(prev => ({
      ...prev,
      contacts: prev.contacts.filter(c => c.id !== id),
    }))
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'practice')

      const response = await fetch(
        process.env.NEXT_PUBLIC_CLOUDINARY_URL!,
        { method: 'POST', body: formData }
      )

      const data = await response.json()
      const imageUrl = data.secure_url

      setCompany(prev => ({ ...prev, logo: imageUrl }))
    } catch (error) {
      console.error('Cloudinary upload failed:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload logo',
        variant: 'destructive',
      })
    }
  }

  const handleRemoveLogo = () => {
    setCompany(prev => ({ ...prev, logo: undefined }))
  }


const [fetching, setFetching] = useState(true);

useEffect(() => {
  const fetchCompany = async () => {
    try {
      const data = await getCompanySettings()
      if (data) {
        // Safely map contacts from server
        const contactsFromServer: Contact[] = Array.isArray(data.contacts)
          ? (data.contacts as any[]).map((item: any) => ({
              id: item.id ?? crypto.randomUUID(), // always has an id
              name: item.name ?? "",
              phone: item.phone ?? "",
            }))
          : []

        // Update state with type-safe object
        setCompany({
          id: data.id ?? crypto.randomUUID(), // fallback id just in case
          name: data.name ?? "",
          email: data.email ?? "",
          logo: data.logo ?? undefined,
          contacts: contactsFromServer,
        })
      }
    } catch (error) {
      console.error("Failed to fetch company settings:", error)
    } finally {
      setFetching(false)
    }
  }

  fetchCompany()
}, [])

  return (
    <div className="space-y-6">
     {/* PREVIEW */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">

          <div>
            <CardTitle>Receipt Header Preview</CardTitle>
            <CardDescription>
              This is how your company information will appear on receipts
            </CardDescription>
          </div>

          {!isEditing && (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}

        </CardHeader>

        <CardContent>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

            <div className="flex-1">

              {company.logo && (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-16 w-auto object-cover mb-2"
                />
              )}

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {company.name}
                </h1>

                <p className="text-muted-foreground text-sm">
                  {company.email}
                </p>

                {company.contacts.length > 0 && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {company.contacts.map(contact => (
                      <div key={contact.id}>
                        {contact.name} • {contact.phone}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </CardContent>

      </Card>


      {/* EDITING AREA */}
      {isEditing && (
        <>

          {/* COMPANY INFO CARD */}
          <Card>

            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Manage your company details that will appear on receipts
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={company.name}
                  onChange={e => handleCompanyChange('name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Company Email</Label>
                <Input
                  value={company.email}
                  onChange={e => handleCompanyChange('email', e.target.value)}
                />
              </div>

              {/* LOGO */}
             {/* LOGO */}
<div className="space-y-2">

  <Label>Company Logo</Label>

  <div className="flex gap-4 items-center">

    {/* Logo Preview */}
    <div className="relative">

      {company.logo ? (
        <>
          <img
            src={company.logo}
            className="w-20 h-20 object-cover rounded-lg border"
          />

          {/* Delete Logo Button */}
          <button
            type="button"
            onClick={handleRemoveLogo}
            className="absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow"
          >
            <Trash2 className="w-3 h-3 text-destructive" />
          </button>
        </>
      ) : (
        <div className="w-20 h-20 border-dashed border flex items-center justify-center rounded-lg">
          <Upload className="w-6 h-6 text-muted-foreground" />
        </div>
      )}

    </div>

    {/* Upload / Edit Button */}
    <label className="cursor-pointer">

      <Button variant="outline" asChild>
        <span>
          {company.logo ? "Edit Logo" : "Choose Logo"}
        </span>
      </Button>

      <input
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        className="hidden"
      />

    </label>

  </div>

</div>

            </CardContent>

          </Card>

          {/* CONTACTS CARD */}
         <Card>

            <CardHeader className="flex flex-row justify-between items-center">

              <div>
                <CardTitle>Contact Persons</CardTitle>
                <CardDescription>
                  Add people who can be contacted
                </CardDescription>
              </div>

              <Dialog open={openDialog} onOpenChange={setOpenDialog}>

                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Contact
                  </Button>
                </DialogTrigger>

                <DialogContent>

                  <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">

                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={newContact.name}
                        onChange={e =>
                          setNewContact(prev => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">

                      <Label>Phone</Label>

                      <div className="flex gap-2">

                        <select
                          className="border rounded-md px-2 py-2 bg-background"
                          value={newContact.countryCode}
                          onChange={(e) =>
                            setNewContact(prev => ({
                              ...prev,
                              countryCode: e.target.value
                            }))
                          }
                        >
                          {countryCodes.map(c => (
                            <option key={c.code} value={c.code}>
                              {c.code} ({c.country})
                            </option>
                          ))}
                        </select>

                        <Input
                          value={newContact.phone}
                          onChange={(e) =>
                            setNewContact(prev => ({
                              ...prev,
                              phone: e.target.value
                            }))
                          }
                          placeholder="Phone number"
                        />

                      </div>

                    </div>

                    <Button onClick={handleAddContact} className="w-full">
                      Add Contact
                    </Button>

                  </div>

                </DialogContent>

              </Dialog>

            </CardHeader>

            <CardContent>

              <div className="space-y-3">

                {company.contacts.map(contact => (

                  <div
                    key={contact.id}
                    className="flex justify-between items-center border rounded-lg p-3"
                  >

                    <div>
                      <p className="font-medium text-sm">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {contact.phone}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveContact(contact.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>

                  </div>

                ))}

                {company.contacts.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-6">
                    No contacts added yet
                  </p>
                )}

              </div>

            </CardContent>

          </Card>

          {/* SAVE */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>

            <Button onClick={handleSaveCompanySettings} disabled={loading}>
              {loading ? 'Saving...' : 'Save Company Settings'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}