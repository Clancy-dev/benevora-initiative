import { getAllEvents } from '@/actions/events'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/front-header'
import { MiniHero } from '@/components/MiniHero'
import Image from 'next/image'

export const metadata = {
  title: 'Events - Benevora Initiative',
  description: 'Discover our upcoming events and initiatives making a difference in communities.',
}

export default async function Events() {
  const result = await getAllEvents();
  const events = result.success ? result.data || [] : [];
  const getGridCols = (count: number) => {
  if (count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-1 md:grid-cols-2';
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
};

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
    {events.length === 0 ? (
      <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-border rounded-lg bg-muted/20">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No Events Available
        </h3>
        <p className="text-foreground/60 max-w-md">
          We are currently preparing upcoming events. Please check back soon for updates.
        </p>
      </div>
    ) : (
      <div className="flex justify-center">
        <div
          className={`grid ${getGridCols(events.length)} gap-8 w-full max-w-7xl`}
        >
          {events.map((event, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow w-full max-w-md mx-auto"
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
                <span className="text-accent font-semibold text-sm">
                  {event.date}
                </span>

                <h3 className="text-xl font-bold text-primary mb-3">
                  {event.title}
                </h3>

                <p className="text-foreground/80 text-sm mb-4">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</section>


      <Footer />
    </div>
  )
}
