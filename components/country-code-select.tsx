'use client'

import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { COUNTRIES } from '@/lib/countries'

interface CountryCodeSelectProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchable?: boolean
}

export function CountryCodeSelect({
  value,
  onValueChange,
  placeholder = 'Select country code',
  searchable = true,
}: CountryCodeSelectProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // Default to Uganda if no value provided
  const selectedCountry = COUNTRIES.find((c) => c.dial_code === value || c.code === value)
  const displayValue = selectedCountry
    ? `${selectedCountry.flag} ${selectedCountry.dial_code}`
    : placeholder

  const filteredCountries = searchable
    ? COUNTRIES.filter(
        (country) =>
          country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          country.dial_code.includes(searchTerm) ||
          country.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : COUNTRIES

  return (
    <Select value={value || ''} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={displayValue} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => (
            <SelectItem key={country.code} value={country.dial_code}>
              {`${country.flag} ${country.name} (${country.dial_code})`}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="none" disabled>
            No countries found
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
}
