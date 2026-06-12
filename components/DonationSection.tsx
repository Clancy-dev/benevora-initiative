import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import Image from 'next/image'

export default function DonationSection() {
  return (
    <>
      {/* How to Donate Section */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-primary">
            How to Donate
          </h2>

          {/* Donation Methods Grid */}
          <div className="grid gap-8 md:grid-cols-2 mb-12">
            {/* MTN MoMo Pay */}
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-[#FCC401] p-6 text-center">
                <Image
                  src="/mtn-momo.png"
                  alt="MTN MoMo Pay"
                  width={180}
                  height={120}
                  className="mx-auto rounded"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Donate by MTN MoMo Pay</h3>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <ArrowRight className="size-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/90">
                      <strong>Dial:</strong> *165*4*4#
                    </span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <ArrowRight className="size-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/90">
                      <strong>Merchant code:</strong> 625314
                    </span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <ArrowRight className="size-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/90">
                      <strong>Payment reference:</strong> Reason for donating
                    </span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <ArrowRight className="size-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/90">
                      <strong>Amount:</strong> Enter desired amount
                    </span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <ArrowRight className="size-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/90">
                      <strong>PIN:</strong> Enter your PIN
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Airtel Money */}
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-[#E9010F] p-6 text-center">
                <Image
                  src="/airtel-money.png"
                  alt="Airtel Money"
                  width={180}
                  height={120}
                  className="mx-auto rounded"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Donate by Airtel Money</h3>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <ArrowRight className="size-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/90">
                      <strong>Dial:</strong> *185*9#
                    </span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <ArrowRight className="size-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/90">
                      <strong>Merchant code:</strong> 4375317
                    </span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <ArrowRight className="size-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/90">
                      <strong>Account name:</strong> Benevora Initiative
                    </span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <ArrowRight className="size-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/90">
                      <strong>Payment details:</strong> Reason for donating
                    </span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <ArrowRight className="size-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/90">
                      <strong>Amount:</strong> Enter desired amount
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Transfer */}
            <div className="md:col-span-2 overflow-hidden rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="border-b border-border p-6 bg-primary/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-primary">Donate by Bank Transfer</h3>
                  <Image
                    src="/stanbic-bank.png"
                    alt="Stanbic Bank Uganda"
                    width={120}
                    height={100}
                    className="rounded"
                  />
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Account Name</p>
                      <p className="text-lg font-semibold text-foreground">Benevora Initiative</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Bank</p>
                      <p className="text-lg font-semibold text-foreground">Stanbic Bank Uganda</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Branch</p>
                      <p className="text-lg font-semibold text-foreground">Hoima</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Account Number</p>
                      <p className="text-lg font-semibold text-foreground font-mono">104582739615</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-1">SWIFT Code</p>
                    <p className="text-lg font-semibold text-foreground font-mono">SBICUGKX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-16">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm font-medium text-muted-foreground px-4">Or</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* International Donations */}
          <div className="rounded-lg border border-border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="bg-accent/10 p-6 md:p-8">
              <h3 className="text-2xl font-bold text-primary mb-4">International Donations</h3>
              <p className="text-foreground/90 mb-6">
                Donate to us through our international partner Global Giving
              </p>
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <Image
                    src="/global-giving-logo.png"
                    alt="Global Giving"
                    width={200}
                    height={200}
                    className="rounded-lg shadow-md"
                  />
                </div>
                
                <div className="flex-1">
                  <p className="text-foreground/90 mb-6">
                    Join our international community of supporters and make a lasting impact globally. Global Giving makes it easy to donate securely from anywhere in the world.
                  </p>
                  <a
                    href="https://www.globalgiving.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button className="gap-2 cursor-pointer bg-primary hover:bg-primary/90">
                      Donate via Global Giving
                      <ArrowRight className="size-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Contact Form CTA */}
      <section className="bg-primary/10 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border border-primary/20 bg-card p-8 md:p-10 text-center shadow-sm">
            <div className="mb-4 flex justify-center">
              <Heart className="size-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4">Thank You for Your Generosity!</h3>
            <p className="text-lg text-foreground/90 mb-2">
              Please send us a message on our Contact Form after making your donation.
            </p>
            <p className="text-foreground/75 mb-6">
              This helps us send you a donation receipt and acknowledge your generous support.
            </p>
            <Link href="/contact">
              <Button className="gap-2 bg-primary cursor-pointer hover:bg-primary/90">
                Go to Contact Form
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
