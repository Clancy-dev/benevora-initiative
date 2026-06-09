import { getAllContactBanners } from '@/actions/banner-actions/contact-banner'
import { getAllEmails } from '@/actions/email'
import { getAllLocations } from '@/actions/location'
import { getAllMaps } from '@/actions/map'
import { getAllOfficePhotos } from '@/actions/office-photos'
import { getAllPhoneNumbers } from '@/actions/phone-number'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/front-header'
import { MiniHero } from '@/components/MiniHero'
import Image from 'next/image'
import { FaPhone, FaEnvelope, FaLocationDot } from 'react-icons/fa6'

export const metadata = {
  title: 'Contact Us - Benevora Initiative',
  description: 'Get in touch with Benevora Initiative. We would love to hear from you.',
}

export default async function Contact() {
  const resultOfImages = await getAllOfficePhotos();
  const officeImages = resultOfImages.success ? resultOfImages.data || [] : [];

  const resultContactBanners = await getAllContactBanners()
  const banner = resultContactBanners.success ? resultContactBanners.data?.[0] : null

  // Fetch contact information
  const phoneResult = await getAllPhoneNumbers()
  const phones = phoneResult.success ? phoneResult.data || [] : []

  const emailResult = await getAllEmails()
  const emails = emailResult.success ? emailResult.data || [] : []

  const locationResult = await getAllLocations()
  const locations = locationResult.success ? locationResult.data || [] : []

  const mapResult = await getAllMaps()
  const maps = mapResult.success ? mapResult.data || [] : []

  const getOfficeGridCols = (count: number) => {
    if (count === 1) return 'grid-cols-1 justify-items-center max-w-md mx-auto';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2 justify-items-center max-w-4xl mx-auto';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <MiniHero
        image={banner?.image ?? '/contact-us.jpg'}
        title={banner?.title ?? 'Get In Touch'}
        subtitle={banner?.subtitle ?? 'We Would Love to Hear From You'}
      />

      {/* Contact Information */}
      <section className="py-16 md:py-24">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

      {/* Phone Numbers */}
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
            <FaPhone className="w-6 h-6" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-primary mb-2">Phone</h3>

          {phones.length === 0 ? (
            <p className="text-foreground/60">
              No phone numbers available at the moment.
            </p>
          ) : (
            phones.map((phone: any) => (
              <p
                key={phone.id}
                className="text-foreground/80 mb-2"
              >
                {phone.phoneNumber}
              </p>
            ))
          )}
        </div>
      </div>

      {/* Emails */}
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
            <FaEnvelope className="w-6 h-6" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-primary mb-2">Email</h3>

          {emails.length === 0 ? (
            <p className="text-foreground/60">
              No email addresses available at the moment.
            </p>
          ) : (
            emails.map((email: any) => (
              <p
                key={email.id}
                className="text-foreground/80 mb-2"
              >
                {email.email}
              </p>
            ))
          )}
        </div>
      </div>

      {/* Location */}
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
            <FaLocationDot className="w-6 h-6" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-primary mb-2">Location</h3>

          {locations.length === 0 ? (
            <p className="text-foreground/60">
              Location information is currently unavailable.
            </p>
          ) : (
            locations.map((location: any) => (
              <div key={location.id}>
                <p className="text-foreground/80">
                  {location.organizationName}
                </p>
                <p className="text-foreground/80">
                  {location.addressLine1}
                </p>

                {location.addressLine2 && (
                  <p className="text-foreground/80">
                    {location.addressLine2}
                  </p>
                )}

                <p className="text-foreground/80">
                  {location.city}, {location.country}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  </div>
</section>

      {/* Contact Form & Map */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Send us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+256 ..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your message"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

           {/* Map */}
   <div>
  <h2 className="text-3xl font-bold text-primary mb-6">
    Find Us
  </h2>

  {maps.length === 0 ? (
    <div className="flex items-center justify-center h-96 border border-dashed border-border rounded-lg bg-muted/20">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Map Not Available
        </h3>
        <p className="text-foreground/60">
          Our location map will be available soon.
        </p>
      </div>
    </div>
  ) : (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-border">
      <iframe
        src={maps[0].embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )}
</div>
          </div>
        </div>
      </section>

      {/* Office Organisation Photos */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Visit Our Organisation
          </h2>

          {officeImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 border border-dashed border-border rounded-lg bg-muted/20">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Office Photos Yet
              </h3>
              <p className="text-foreground/60 max-w-md">
                We are currently updating our office gallery. Please check back soon to see our workspace.
              </p>
            </div>
          ) : (
            <div className={`grid ${getOfficeGridCols(officeImages.length)} gap-6`}>
              {officeImages.map((photo: any, index: number) => (
                <div
                  key={photo.id}
                  className="group overflow-hidden rounded-lg w-full"
                >
                  <div className="relative h-72 w-full overflow-hidden rounded-lg">
                    <Image
                      src={photo.image}
                      alt={`Office ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
