import { Footer } from '@/components/Footer'
import { Header } from '@/components/front-header'
import { MiniHero } from '@/components/MiniHero'
import Image from 'next/image'

export const metadata = {
  title: 'Events - Benevora Initiative',
  description: 'Discover our upcoming events and initiatives making a difference in communities.',
}

export default function Events() {
  const events = [
    {
      image: '/images/event-1.jpg',
      title: 'Annual Fundraiser Gala',
      date: 'June 15, 2024',
      description:
        'Join us for an evening of celebration and connection as we raise funds for our community programs.',
    },
    {
      image: '/images/event-2.jpg',
      title: 'Community Skills Workshop',
      date: 'July 22, 2024',
      description:
        'Hands-on training in digital literacy, business skills, and entrepreneurship for young professionals.',
    },
    {
      image: '/images/event-3.jpg',
      title: 'Volunteer Appreciation Day',
      date: 'August 10, 2024',
      description:
        'Celebrating the incredible volunteers who make our mission possible with gratitude and recognition.',
    },
    {
      image: '/images/event-1.jpg',
      title: 'Educational Leadership Summit',
      date: 'September 5, 2024',
      description:
        'Bringing together educators and leaders to discuss innovative approaches in community education.',
    },
    {
      image: '/images/event-2.jpg',
      title: 'Youth Empowerment Camp',
      date: 'October 12, 2024',
      description:
        'A transformative week-long camp for young people to develop leadership and life skills.',
    },
    {
      image: '/images/event-3.jpg',
      title: 'Community Health Awareness Drive',
      date: 'November 20, 2024',
      description:
        'Free health screenings and awareness sessions for improved wellness in our communities.',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <MiniHero
        image="/images/hero-events.jpg"
        title="Events"
        subtitle="Join Us in Making a Difference"
      />

      {/* Events Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div
                key={index}
                className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-accent font-semibold text-sm">{event.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{event.title}</h3>
                  <p className="text-foreground/80 text-sm mb-4">{event.description}</p>
                  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-accent transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
