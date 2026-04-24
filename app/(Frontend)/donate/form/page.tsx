'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { countryCodes } from '@/lib/countryCodes'
import { convertCurrency } from '@/lib/currencyUtils'
import Image from 'next/image'
import Link from 'next/link'

export default function DonationForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [currency, setCurrency] = useState<'USD' | 'UGX'>('USD')
  const [customAmount, setCustomAmount] = useState<string>('')
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    countryCode: '+256',
    amount: '',
  })

  useEffect(() => {
    setMounted(true)
    const savedCurrency = localStorage.getItem('preferredCurrency')
    if (savedCurrency === 'USD' || savedCurrency === 'UGX') {
      setCurrency(savedCurrency)
    }

    const paramAmount = searchParams?.get('amount')
    const paramCurrency = searchParams?.get('currency')

    if (paramCurrency === 'USD' || paramCurrency === 'UGX') {
      setCurrency(paramCurrency)
    }

    if (paramAmount) {
      setSelectedAmount(parseInt(paramAmount))
      setFormData((prev) => ({ ...prev, amount: paramAmount }))
    }
  }, [searchParams])

  if (!mounted) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelect>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === 'amount') {
      setCustomAmount(value)
      setSelectedAmount(null)
    }
  }

  const handleCurrencyChange = (newCurrency: 'USD' | 'UGX') => {
    setCurrency(newCurrency)
    localStorage.setItem('preferredCurrency', newCurrency)

    if (formData.amount) {
      const numAmount = parseFloat(formData.amount)
      if (!isNaN(numAmount)) {
        const convertedAmount = convertCurrency(numAmount, currency, newCurrency)
        setFormData((prev) => ({ ...prev, amount: convertedAmount.toString() }))
      }
    }
  }

  const handleContinue = () => {
    if (!formData.name || !formData.phone || !formData.amount) {
      alert('Please fill in all fields')
      return
    }
    setShowPayment(true)
  }

  const handleComplete = () => {
    router.push('/donate/thank-you')
  }

  const finalAmount = selectedAmount || parseFloat(formData.amount)

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center">
              Donation Form
            </h1>

            {/* Main Form */}
            <div className="bg-background border border-border rounded-lg p-6 md:p-8">
              {/* Donation Information */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-primary mb-4">Donation Details</h2>

                {/* Currency Toggle */}
                <div className="mb-6 flex gap-2">
                  {['USD', 'UGX'].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => handleCurrencyChange(curr as 'USD' | 'UGX')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        currency === curr
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>

                {/* Name */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {countryCodes.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.code} {item.country}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="700000000"
                      className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Donation Amount *</label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 py-2 bg-muted rounded-lg font-semibold">
                      {currency === 'USD' ? '$' : ''}{currency === 'UGX' ? 'UGX' : ''}
                    </span>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="Enter amount"
                      className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent transition-colors"
                >
                  Continue to Payment Information
                </button>
              </div>

              {/* Payment Section */}
              {showPayment && (
                <div className="border-t border-border pt-8 mt-8">
                  <h2 className="text-xl font-bold text-primary mb-6">
                    Select Payment Method
                  </h2>

                  {/* Payment Options */}
                  <div className="space-y-3 mb-8">
                    {[
                      {
                        name: 'MTN',
                        number: '*165*1#',
                        logo: '/images/gallery-1.jpg',
                        instructions: 'Dial *165*1# to pay via MTN Mobile Money',
                      },
                      {
                        name: 'Airtel',
                        number: '*185*1#',
                        logo: '/images/gallery-2.jpg',
                        instructions: 'Dial *185*1# to pay via Airtel Money',
                      },
                      {
                        name: 'Bank Transfer',
                        number: 'Account: 1234567890',
                        logo: '/images/gallery-3.jpg',
                        instructions: 'Transfer to: Account: 1234567890, Bank: Stanbic Uganda',
                      },
                    ].map((method, index) => (
                      <div
                        key={index}
                        className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <Image
                              src={method.logo}
                              alt={method.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-foreground">{method.name}</h3>
                            <p className="text-sm text-muted-foreground">{method.number}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {method.instructions}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Completion Instructions */}
                  <div className="bg-muted/30 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-primary mb-2">Important Instructions:</h3>
                    <p className="text-sm text-foreground/80">
                      Please complete your payment using the selected method. After you have successfully
                      completed your donation, click the button below to confirm.
                    </p>
                  </div>

                  {/* Complete Button */}
                  <button
                    onClick={handleComplete}
                    className="w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    I Have Completed My Donation
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
