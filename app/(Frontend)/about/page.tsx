import { getAllAboutBanners } from '@/actions/banner-actions/about-banner'
import { getAllFounders } from '@/actions/founders'
import { getAllWorks } from '@/actions/work'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/front-header'
import { MiniHero } from '@/components/MiniHero'
import Image from 'next/image'

export const metadata = {
  title: 'About Us - Benevora Initiative',
  description: 'Learn about Benevora Initiative, our mission, values, and the team making a difference.',
}

export default async function About() {
  const resultOfFounders = await getAllFounders();
  const founders = resultOfFounders.success ? resultOfFounders.data || [] : [];

  const resultOfWorks = await getAllWorks()
  const works = resultOfWorks.success ? resultOfWorks.data || [] : []
  const getGridCols = (count: number) => {
  if (count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-1 md:grid-cols-2';
  return 'grid-cols-1 md:grid-cols-3';
};
  

  const result = await getAllAboutBanners()

  const banner = result.success ? result.data?.[0] : null

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <MiniHero
         image={banner?.image ?? '/about-us-default.jpg'}
         title={banner?.title ?? 'About Us'}
         subtitle={banner?.subtitle ?? 'Our Story, Mission & Team'}
      />

      {/* Organization Info */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
                Who We Are
              </h2>
              <p className="text-lg text-foreground/80 mb-4 leading-relaxed">
                Benevora Initiative was founded in 2021 with a simple but powerful vision: to empower lives and inspire change in our communities. What started as a small group of passionate individuals has grown into a vibrant organization making real impact.
              </p>
              <p className="text-lg text-foreground/80 mb-4 leading-relaxed">
                We believe that every person deserves an opportunity to realize their potential and contribute meaningfully to society. Through our programs and initiatives, we create pathways for individuals to access education, skills training, and support systems they need to thrive.
              </p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
                Our Mission
              </h2>
              <p className="text-2xl font-semibold text-accent mb-4">
                Empowering Lives, Inspiring Change
              </p>
              <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                We are committed to:
              </p>
              <ul className="space-y-3">
                {[
                  'Providing quality education and skills training',
                  'Creating economic opportunities for underprivileged communities',
                  'Supporting sustainable community development',
                  'Fostering innovation and social entrepreneurship',
                  'Building stronger, more resilient communities',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: 'Integrity',
                description: 'Honesty and transparency in all we do',
              },
              {
                title: 'Compassion',
                description: 'Genuine care for those we serve',
              },
              {
                title: 'Excellence',
                description: 'Quality in every aspect of our work',
              },
              {
                title: 'Innovation',
                description: 'Creative solutions to community challenges',
              },
            ].map((value, index) => (
              <div
                key={index}
                className="p-6 bg-background rounded-lg border border-border text-center"
              >
                <h3 className="text-xl font-bold mb-3 text-primary">{value.title}</h3>
                <p className="text-foreground/80 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      {founders.length > 0 && (
              <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Meet Our Founders
          </h2>
          <div className={`grid ${getGridCols(founders.length)} gap-8 justify-items-center`}>
            {founders.map((founder, index) => (
              <div
                key={index}
                className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow w-full max-w-sm mx-auto"
              >
                <div className="relative h-96 w-full bg-muted">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    width={500}
                    height={500}
                    className={`h-full w-full ${
                      founders.length === 2 ? 'object-cover' : 'object-cover'
                    }`}
                    
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-1">{founder.name}</h3>
                  <p className="text-accent font-semibold mb-3">{founder.role}</p>
                  <p className="text-foreground/80 text-sm">{founder.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}


      {/* Our Work */}
      {works.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Our Work in Action
          </h2>
          <div className={`grid gap-6 w-full max-w-5xl ${
          works.length === 1
            ? 'grid-cols-1'
            : works.length === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-3'
        }`}>
            {works.map((item, index) => (
              <div key={index} className="group overflow-hidden rounded-lg w-full max-w-sm mx-auto">
                <div className="relative h-80 w-full overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.caption}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="mt-3 text-center font-semibold text-foreground">
                  {item.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}
      

      {/* Impact Statistics */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Our Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '5,000+', label: 'Lives Impacted' },
              { number: '150+', label: 'Volunteers Active' },
              { number: '25+', label: 'Programs Running' },
              { number: '100%', label: 'Community Satisfaction' },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-8 bg-primary text-primary-foreground rounded-lg text-center"
              >
                <p className="text-4xl font-bold mb-2">{stat.number}</p>
                <p className="text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas of Focus */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            Our Areas of Focus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Education & Skills',
                description: 'Providing quality education, vocational training, and digital literacy programs to empower individuals with marketable skills.',
              },
              {
                title: 'Economic Empowerment',
                description: 'Supporting small business development, microfinance initiatives, and job placement programs for sustainable livelihoods.',
              },
              {
                title: 'Community Health',
                description: 'Promoting health awareness, preventive care, and access to healthcare services in underserved communities.',
              },
              {
                title: 'Youth Development',
                description: 'Mentoring young people through leadership programs, mentorship, and opportunities for personal and professional growth.',
              },
              {
                title: 'Women Empowerment',
                description: 'Creating safe spaces and support systems for women to access education, economic opportunities, and decision-making platforms.',
              },
              {
                title: 'Environmental Sustainability',
                description: 'Promoting environmental conservation, sustainable practices, and green initiatives in our communities.',
              },
            ].map((focus, index) => (
              <div
                key={index}
                className="p-6 bg-background rounded-lg border border-border hover:border-primary transition-colors"
              >
                <h3 className="text-xl font-bold text-primary mb-3">{focus.title}</h3>
                <p className="text-foreground/80">{focus.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Us in Making a Difference</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-95">
            Together, we can create lasting change and build stronger, more empowered communities. Whether you want to volunteer, donate, or partner with us, there&apos;s a place for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/membership"
              className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-opacity-90 transition-all inline-block"
            >
              Become a Member
            </a>
            <a
              href="/donate"
              className="px-8 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-all inline-block"
            >
              Make a Donation
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
