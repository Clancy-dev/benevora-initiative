
import { Footer } from '@/components/Footer'
import { Header } from '@/components/front-header'
import { MiniHero } from '@/components/MiniHero'
import Image from 'next/image'

export const metadata = {
  title: 'Blog - Benevora Initiative',
  description: 'Read our latest stories, insights, and updates from Benevora Initiative.',
}

export default function Blogs() {
  const blogs = [
    {
      id: 1,
      title: 'The Power of Education in Transforming Lives',
      excerpt:
        'Discover how our educational programs are creating lasting change and opening doors of opportunity for young people.',
      image: '/images/gallery-1.jpg',
      date: 'June 10, 2024',
      author: 'Grace Nakamatte',
      category: 'Education',
    },
    {
      id: 2,
      title: 'Community Stories: Success That Inspires',
      excerpt:
        'Real stories from real people who have benefited from our initiatives and are now giving back to their communities.',
      image: '/images/gallery-2.jpg',
      date: 'June 5, 2024',
      author: 'James Kiwanuka',
      category: 'Impact',
    },
    {
      id: 3,
      title: 'Sustainable Development: Building for the Future',
      excerpt:
        'Learn about our approach to sustainable community development and how we ensure long-term positive impact.',
      image: '/images/gallery-3.jpg',
      date: 'May 30, 2024',
      author: 'Dr. Sarah Mutesi',
      category: 'Sustainability',
    },
    {
      id: 4,
      title: 'Empowering Young Women: Leadership Through Action',
      excerpt:
        'Our women empowerment programs are creating leaders and changemakers who will shape the future.',
      image: '/images/event-1.jpg',
      date: 'May 25, 2024',
      author: 'Grace Nakamatte',
      category: 'Empowerment',
    },
    {
      id: 5,
      title: 'Digital Skills for Digital Age: Tech Training Initiative',
      excerpt:
        'Preparing young people with essential digital skills to thrive in an increasingly digital world.',
      image: '/images/event-2.jpg',
      date: 'May 20, 2024',
      author: 'James Kiwanuka',
      category: 'Skills',
    },
    {
      id: 6,
      title: 'Volunteer Corner: Making a Difference Together',
      excerpt:
        'Inspiring stories from our incredible volunteers who dedicate their time and energy to our mission.',
      image: '/images/event-3.jpg',
      date: 'May 15, 2024',
      author: 'Dr. Sarah Mutesi',
      category: 'Community',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <MiniHero
        image="/images/hero-events.jpg"
        title="Our Blog"
        subtitle="Stories, Insights & Updates"
      />

      {/* Blog Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-accent bg-primary/10 px-3 py-1 rounded-full">
                      {blog.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{blog.date}</span>
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-foreground/80 text-sm mb-4 line-clamp-3 flex-1">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">By {blog.author}</span>
                    <button className="text-primary font-semibold text-sm hover:text-accent transition-colors">
                      Read More →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Connected</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Don&apos;t miss our latest stories and updates. Subscribe to our newsletter today.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-foreground"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
