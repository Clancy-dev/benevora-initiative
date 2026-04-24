'use client'

import { useState, useEffect } from 'react'
import { Footer } from '@/components/Footer'
import { MiniHero } from '@/components/MiniHero'
import Link from 'next/link'
import { predefinedAmounts } from '@/lib/currencyUtils'
import { Header } from '@/components/front-header'

export default function Donate() {
  const [currency, setCurrency] = useState<'USD' | 'UGX'>('USD')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load currency preference from localStorage
    const saved = localStorage.getItem('preferredCurrency')
    if (saved === 'UGX' || saved === 'USD') {
      setCurrency(saved)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('preferredCurrency', currency)
    }
  }, [currency, mounted])

  if (!mounted) {
    return null
  }

  const amounts = predefinedAmounts[currency]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <MiniHero
        image="/images/hero-donate.jpg"
        title="Make a Donation"
        subtitle="Help Us Create Lasting Change"
      />

      {/* Donation Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Currency Selector */}
            <div className="mb-8 flex items-center gap-4">
              <label className="font-semibold text-foreground">Preferred Currency:</label>
              <div className="flex gap-2">
                {['USD', 'UGX'].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => setCurrency(curr as 'USD' | 'UGX')}
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
            </div>

            {/* Donation Info */}
            <div className="bg-muted/30 rounded-lg p-6 md:p-8 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                Why Your Donation Matters
              </h2>
              <ul className="space-y-3 text-foreground/80">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>Every dollar helps us reach more people in need</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>Your support funds education, training, and community programs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>We are transparent about how we use donations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>Your donation creates lasting impact in communities</span>
                </li>
              </ul>
            </div>

            {/* Quick Amount Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-4">
                Select an Amount or Enter Custom Amount:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {amounts.map((amount) => (
                  <Link
                    key={amount}
                    href={`/donate/form?amount=${amount}&currency=${currency}`}
                    className="p-4 bg-background border-2 border-primary rounded-lg text-center hover:bg-primary hover:text-primary-foreground transition-colors font-semibold"
                  >
                    {currency === 'USD' ? '$' : ''}{amount.toLocaleString()}
                    {currency === 'UGX' ? ' UGX' : ''}
                  </Link>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <Link
                href={`/donate/form?currency=${currency}`}
                className="inline-block px-8 py-4 bg-accent text-accent-foreground rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
              >
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            See Your Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                amount: currency === 'USD' ? '$10' : '37,500 UGX',
                impact: 'Feeds a child for a week',
              },
              {
                amount: currency === 'USD' ? '$25' : '93,750 UGX',
                impact: 'Provides a training course',
              },
              {
                amount: currency === 'USD' ? '$50' : '187,500 UGX',
                impact: 'Supports a mentorship program',
              },
              {
                amount: currency === 'USD' ? '$100' : '375,000 UGX',
                impact: 'Funds a scholarship',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-6 bg-background rounded-lg border border-border"
              >
                <div className="text-3xl font-bold text-accent mb-2">{item.amount}</div>
                <p className="text-foreground/80">{item.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
