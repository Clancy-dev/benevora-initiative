'use client'

import { useState, useRef } from 'react'
import { Footer } from '@/components/Footer'
import { MiniHero } from '@/components/MiniHero'
import { Header } from '@/components/front-header'
import { countryCodes } from '@/lib/countryCodes'

export default function MembershipPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    countryCode: '+256',
    phoneNumber: '',
    email: '',
    areaOfInterest: 'Volunteer',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({
      fullName: '',
      countryCode: '+256',
      phoneNumber: '',
      email: '',
      areaOfInterest: 'Volunteer',
      message: '',
    })
    formRef.current?.reset()
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <main className="flex-1">
        {/* Mini Hero */}
        <MiniHero
          image="/images/hero-about.jpg"
          title="Join Our Community"
          subtitle="Be Part of the Change"
        />

        {/* Why Join Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-balance">
                Why Join Benevora Initiative?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 text-center">
                Become part of a dynamic community dedicated to empowering lives and inspiring change. Whether you want to volunteer, donate, or partner with us, there&apos;s a role for you.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="p-6 bg-background rounded-lg border border-border">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <span className="text-primary-foreground font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Make Real Impact</h3>
                <p className="text-muted-foreground">
                  Your contributions directly help communities transform lives and achieve sustainable development.
                </p>
              </div>

              <div className="p-6 bg-background rounded-lg border border-border">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <span className="text-primary-foreground font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Build Network</h3>
                <p className="text-muted-foreground">
                  Connect with like-minded individuals and organizations working towards social good.
                </p>
              </div>

              <div className="p-6 bg-background rounded-lg border border-border">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <span className="text-primary-foreground font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Personal Growth</h3>
                <p className="text-muted-foreground">
                  Develop new skills, gain experience, and grow personally while contributing to meaningful causes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Types */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-balance">
              Choose Your Role
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-card rounded-lg border border-primary/20 hover:border-primary transition-colors">
                <h3 className="text-2xl font-bold mb-4 text-accent">Volunteer</h3>
                <p className="text-muted-foreground mb-6">
                  Donate your time, skills, and passion to make a direct difference in communities we serve.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Field support
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Event organization
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Skill sharing
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-lg border border-primary/20 hover:border-primary transition-colors">
                <h3 className="text-2xl font-bold mb-4 text-accent">Donor</h3>
                <p className="text-muted-foreground mb-6">
                  Support our programs financially to enable sustainable impact and expand our reach.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Regular giving
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Project funding
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Tax benefits
                  </li>
                </ul>
              </div>

              <div className="p-8 bg-card rounded-lg border border-primary/20 hover:border-primary transition-colors">
                <h3 className="text-2xl font-bold mb-4 text-accent">Partner</h3>
                <p className="text-muted-foreground mb-6">
                  Collaborate with us on strategic initiatives for mutual growth and impact.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Strategic collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Co-programs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                    Visibility & impact
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Membership Form */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-balance">
                Become a Member Today
              </h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                  <p className="text-green-700 dark:text-green-400 font-semibold">
                    Thank you! We&apos;ve received your membership application. We&apos;ll be in touch soon!
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your full name"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-semibold mb-2">
                    Phone Number *
                  </label>
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-24"
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Area of Interest */}
                <div>
                  <label htmlFor="areaOfInterest" className="block text-sm font-semibold mb-2">
                    Area of Interest *
                  </label>
                  <select
                    id="areaOfInterest"
                    name="areaOfInterest"
                    value={formData.areaOfInterest}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Volunteer">Volunteer</option>
                    <option value="Donor">Donor</option>
                    <option value="Partner">Partner</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2">
                    Message (Tell us about yourself)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tell us about your interests, skills, or why you want to join us..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Submit Membership Application
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
