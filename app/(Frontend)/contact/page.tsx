import { getAllContactBanners } from '@/actions/banner-actions/contact-banner'
import { getAllOfficePhotos } from '@/actions/office-photos'
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

  const result = await getAllContactBanners()
  const banner = result.success ? result.data?.[0] : null

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
            {/* Phone */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                  <FaPhone className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary mb-2">Phone</h3>
                <p className="text-foreground/80 mb-2">+256 707015676</p>
                <p className="text-foreground/80">+256 772656780</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
                  <FaEnvelope className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary mb-2">Email</h3>
                <p className="text-foreground/80">benevorainitative@gmail.com</p>
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
                <p className="text-foreground/80">P.O Box 5678</p>
                <p className="text-foreground/80">Kampala, Uganda</p>
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
              <h2 className="text-3xl font-bold text-primary mb-6">Find Us</h2>
              <div className="w-full h-96 rounded-lg overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.8165202197403!2d32.58269!3d0.3476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbc0000000001%3A0x0!2sKampala%2C%20Uganda!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
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
        {officeImages.map((photo, index) => (
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
