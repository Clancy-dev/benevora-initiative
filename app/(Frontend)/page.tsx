
import { Footer } from '@/components/Footer'
import { Header } from '@/components/front-header'
import { HeroCarousel } from '@/components/HeroCarousel'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Mission & Impact Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
                Our Mission
              </h2>
              <p className="text-lg text-foreground/80 mb-4 leading-relaxed">
                Benevora Initiative is dedicated to empowering lives and inspiring change in communities across Uganda and beyond. Since our founding in 2021, we have been committed to making a tangible difference in the lives of the people we serve.
              </p>
              <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                Through education, community programs, and sustainable initiatives, we create opportunities for individuals to realize their potential and contribute meaningfully to society.
              </p>
              <Link
                href="/about"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent transition-colors"
              >
                Learn More About Us
              </Link>
            </div>
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/gallery-1.jpg"
                alt="Our Mission"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Integrity',
                description: 'We operate with honesty and transparency in all our endeavors, ensuring trust and accountability.',
                icon: '✓',
              },
              {
                title: 'Compassion',
                description: 'We genuinely care for the people we serve and work with empathy and understanding.',
                icon: '❤',
              },
              {
                title: 'Excellence',
                description: 'We strive for quality in everything we do, from program delivery to organizational management.',
                icon: '⭐',
              },
            ].map((value, index) => (
              <div
                key={index}
                className="p-6 bg-background rounded-lg border border-border hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-primary">{value.title}</h3>
                <p className="text-foreground/80">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Make a Difference Today
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Your support helps us continue our mission to empower lives and inspire change. Every contribution counts, no matter the size.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donate"
              className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Donate Now
            </Link>
            <Link
              href="/events"
              className="px-8 py-3 border-2 border-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground/10 transition-colors"
            >
              View Events
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
