
import { Footer } from '@/components/Footer'
import { Header } from '@/components/front-header'
import Link from 'next/link'
import { FaCircleCheck } from 'react-icons/fa6'

export const metadata = {
  title: 'Thank You for Your Donation - Benevora Initiative',
  description: 'Thank you for supporting Benevora Initiative with your generous donation.',
}

export default function ThankYou() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <section className="flex-1 py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <FaCircleCheck className="w-24 h-24 text-accent" />
            </div>

            {/* Thank You Message */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Thank You!
            </h1>

            <p className="text-xl md:text-2xl text-foreground/80 mb-6">
              Thank you for supporting our cause!
            </p>

            <div className="bg-muted/30 rounded-lg p-8 mb-8">
              <p className="text-lg text-foreground/80 mb-4 leading-relaxed">
                Your generous donation helps us continue our mission to empower lives and inspire
                change in communities. Together, we are making a real difference in people&apos;s lives.
              </p>

              <div className="bg-background border-2 border-primary rounded-lg p-6 my-6">
                <p className="text-sm text-muted-foreground mb-2">Donation Receipt</p>
                <p className="text-3xl font-bold text-accent">
                  Your donation has been received
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  A confirmation email has been sent to your provided contact information
                </p>
              </div>

              <p className="text-foreground/80 mb-4">
                We will keep you updated on how your contribution is making a positive impact. You can
                expect to see stories and updates from our programs in our newsletter.
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent transition-colors"
              >
                Back to Home
              </Link>
              <Link
                href="/donate"
                className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors"
              >
                Make Another Donation
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="text-xl font-bold text-primary mb-4">What Happens Next?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">1</div>
                  <p className="text-foreground/80">
                    Your donation is securely processed and recorded
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">2</div>
                  <p className="text-foreground/80">
                    You receive a donation receipt via email
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">3</div>
                  <p className="text-foreground/80">
                    You&apos;ll stay updated on the impact of your contribution
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
