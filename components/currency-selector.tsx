'use client'

import React from 'react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CurrencySelectorProps {
  value: string
  onValueChange: (value: string) => void
  showConversionInfo?: boolean
  referenceAmount?: number
  referenceCurrency?: string
}

const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'UGX', name: 'Ugandan Shilling' },
  { code: 'KES', name: 'Kenyan Shilling' },
  { code: 'NGN', name: 'Nigerian Naira' },
  { code: 'ZAR', name: 'South African Rand' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'CHF', name: 'Swiss Franc' },
]

export function CurrencySelector({
  value,
  onValueChange,
  showConversionInfo = false,
}: CurrencySelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="currency">Currency *</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="currency">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {currencies.map(currency => (
            <SelectItem key={currency.code} value={currency.code}>
              {currency.code} — {currency.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
