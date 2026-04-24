'use client'

import { useState, useMemo } from 'react'
import { Search, Eye, Trash2, Filter, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { deleteReceipt } from '@/actions/receipt-actions'
import toast from 'react-hot-toast'

type SortOption = 'recent-first' | 'recent-last' | 'a-z' | 'z-a'

interface ReceiptsClientProps {
  initialReceipts: any[]
}

export default function ReceiptsClient({ initialReceipts }: ReceiptsClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('recent-first')
  const [deletingReceipt, setDeletingReceipt] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [receipts, setReceipts] = useState(initialReceipts)
  const router = useRouter()

  // Group receipts by customer organization
  const groupedClients = useMemo(() => {
    const clients = new Map<string, any[]>()
    receipts.forEach((receipt) => {
      const org = receipt.customerOrganization
      if (!clients.has(org)) {
        clients.set(org, [])
      }
      clients.get(org)!.push(receipt)
    })
    return clients
  }, [receipts])

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    const filtered = Array.from(groupedClients.entries()).filter(([org]) =>
      org.toLowerCase().includes(searchTerm.toLowerCase())
    )

    filtered.sort(([orgA], [orgB]) => {
      switch (sortBy) {
        case 'a-z':
          return orgA.localeCompare(orgB)
        case 'z-a':
          return orgB.localeCompare(orgA)
        case 'recent-first': {
          const dateA = Math.max(
            ...groupedClients.get(orgA)!.map((r: any) => new Date(r.createdAt).getTime())
          )
          const dateB = Math.max(
            ...groupedClients.get(orgB)!.map((r: any) => new Date(r.createdAt).getTime())
          )
          return dateB - dateA
        }
        case 'recent-last': {
          const dateA = Math.max(
            ...groupedClients.get(orgA)!.map((r: any) => new Date(r.createdAt).getTime())
          )
          const dateB = Math.max(
            ...groupedClients.get(orgB)!.map((r: any) => new Date(r.createdAt).getTime())
          )
          return dateA - dateB
        }
        default:
          return 0
      }
    })

    return filtered
  }, [groupedClients, searchTerm, sortBy])

  const handleViewReceipt = (receipt: any) => {
    router.push(`/dashboard/receipt/view/${receipt.id}`)
  }

  const handleDeleteReceipt = (receipt: any) => {
    setDeletingReceipt(receipt)
  }

  const handleConfirmDelete = async () => {
    if (!deletingReceipt) return
    setIsDeleting(true)
    try {
      await deleteReceipt(deletingReceipt.id)
      setReceipts(receipts.filter(r => r.id !== deletingReceipt.id))
      setDeletingReceipt(null)
      toast.success('Receipt deleted successfully') // ✅ success toast
    } catch (error) {
      console.error('Failed to delete receipt:', error)
      toast.error('Failed to delete receipt') // ❌ error toast
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCreateReceipt = () => {
    router.push('/dashboard/receipt/create')
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getContactPersons = (receipt: any) => {
    if (receipt.clientContacts && Array.isArray(receipt.clientContacts)) {
      return receipt.clientContacts
        .map((contact: any) => contact.name)
        .filter(Boolean)
        .join(', ')
    }
    return 'N/A'
  }

  const getPhoneNumbers = (receipt: any) => {
    if (receipt.clientContacts && Array.isArray(receipt.clientContacts)) {
      return receipt.clientContacts
        .map((contact: any) => {
          const phone = contact.phone
          const code = contact.countryCode || ''
          return phone ? `${code}${phone}` : null
        })
        .filter(Boolean)
        .join(', ')
    }
    return receipt.customerEmail || 'N/A'
  }

  const getEmails = (receipt: any) => {
    const emails = []
    if (receipt.customerEmail) {
      emails.push(receipt.customerEmail)
    }
    if (receipt.clientContacts && Array.isArray(receipt.clientContacts)) {
      const contactEmails = receipt.clientContacts
        .map((contact: any) => contact.email)
        .filter(Boolean)
      emails.push(...contactEmails)
    }
    return emails.length > 0 ? emails.join(', ') : 'N/A'
  }

  return (
    <>
      {/* Create Receipt Button and Search/Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Create Receipt Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleCreateReceipt}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Create Receipt</span>
          </Button>
        </div>

        {/* Search and Filter */}
        {/* Search and Filter */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Search Bar */}
  <div className="md:col-span-2">
    <div className="relative flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 transition-all duration-200 hover:border-primary/30 focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/5">
      <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      <Input
        placeholder="Search by organization name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border-0 outline-none focus:ring-0 bg-transparent placeholder-muted-foreground/50 text-foreground"
      />
    </div>
  </div>


  {/* Sort Dropdown */}
<div className="relative flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 transition-all duration-200 hover:border-primary/30">
  <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" /> Sort

  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
    <SelectTrigger className="flex-1 border-0 outline-none focus:ring-0 bg-transparent text-foreground">
      <SelectValue placeholder="Sort" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="recent-first">Recent First</SelectItem>
      <SelectItem value="recent-last">Recent Last</SelectItem>
      <SelectItem value="a-z">A - Z</SelectItem>
      <SelectItem value="z-a">Z - A</SelectItem>
    </SelectContent>
  </Select>
</div>
</div>
      </div>

      {/* Clients List Section */}
      {filteredAndSortedClients.length === 0 ? (
        <div className="py-16 text-center">
          <div className="inline-block p-3 bg-muted rounded-full mb-4">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No clients found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms' : 'No receipts have been created yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAndSortedClients.map(([org, receiptList]) => (
            <div
              key={org}
              className="border border-border rounded-2xl overflow-hidden bg-card transition-all duration-200 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Client Organization Header */}
              <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-accent/5 px-6 py-5 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">{org}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {receiptList.length} {receiptList.length === 1 ? 'receipt' : 'receipts'}
                    </p>
                  </div>
                  <div className="hidden md:block px-3 py-1 bg-primary/10 rounded-full">
                    <span className="text-sm font-medium text-primary">{receiptList.length}</span>
                  </div>
                </div>
              </div>

              {/* Receipts List */}
              <div className="divide-y divide-border">
                {receiptList.map((receipt: any) => (
                  <div
                    key={receipt.id}
                    className="p-5 hover:bg-muted/30 transition-colors duration-150"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start mb-4">
                      {/* Contact Person */}
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                          Contact Person
                        </label>
                        <p className="text-sm font-medium text-foreground">
                          {getContactPersons(receipt)}
                        </p>
                      </div>

                      {/* Organization */}
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                          Organization
                        </label>
                        <p className="text-sm font-medium text-foreground">
                          {receipt.customerOrganization}
                        </p>
                      </div>

                      {/* Phone Numbers */}
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                          Phone
                        </label>
                        <p className="text-sm text-foreground break-words">
                          {getPhoneNumbers(receipt)}
                        </p>
                      </div>

                      {/* Emails */}
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                          Email
                        </label>
                        <p className="text-sm text-foreground break-words">
                          {getEmails(receipt)}
                        </p>
                      </div>

                      {/* Project & Date */}
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                          Project
                        </label>
                        <p className="text-sm font-medium text-foreground">
                          {receipt.projectName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(receipt.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-end pt-4 border-t border-border/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewReceipt(receipt)}
                        className="gap-2 text-accent hover:text-accent hover:bg-accent/10 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline text-sm font-medium">View</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReceipt(receipt)}
                        className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline text-sm font-medium">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingReceipt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-sm w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-foreground mb-2">Delete Receipt?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this receipt? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeletingReceipt(null)}
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
    </>
  )
}
