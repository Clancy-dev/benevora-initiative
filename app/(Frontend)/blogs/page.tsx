import { getAllBlogsBanners } from '@/actions/banner-actions/blogs-banner'
import { getAllBlogs } from '@/actions/blogs'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/front-header'
import { MiniHero } from '@/components/MiniHero'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Blog - Benevora Initiative',
  description: 'Read our latest stories, insights, and updates from Benevora Initiative.',
}

export default async function Blogs() {
  const resultOfBlogs = await getAllBlogs()
  const blogs = resultOfBlogs.success ? resultOfBlogs.data || [] : []

  const getGridCols = (count: number) => {
    if (count === 1) return 'grid-cols-1'
    if (count === 2) return 'grid-cols-1 md:grid-cols-2'
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }

  const result = await getAllBlogsBanners()
  const banner = result.success ? result.data?.[0] : null

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <MiniHero
        image={banner?.image ?? '/blog-image.png'}
        title={banner?.title ?? 'Our Blog'}
        subtitle={banner?.subtitle ?? 'Stories, Insights & Updates'}
      />

      {/* Blog Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {blogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-border rounded-lg bg-muted/20">
              <h3 className="text-xl font-semibold text-foreground mb-2 pt-6 px-4">
                No Blog Posts Available
              </h3>
              <p className="text-foreground/60 max-w-md pb-6 px-4">
                We haven't published any blog posts yet. Please check back soon
                for updates and stories from our community.
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                className={`grid ${getGridCols(
                  blogs.length
                )} gap-8 w-full max-w-7xl`}
              >
                {blogs.map((blog) => (
                  <article
                    key={blog.id}
                    className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col w-full max-w-md mx-auto"
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

                        <span className="text-xs text-muted-foreground">
                          {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2">
                        {blog.title}
                      </h3>

                      <p className="text-foreground/80 text-sm mb-4 line-clamp-3 flex-1 whitespace-pre-wrap">
                        {blog.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                          By {blog.author}
                        </span>

                        <Link
                          href={`/blogs/${blog.slug}`}
                          className="text-primary font-semibold text-sm hover:text-accent transition-colors"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </article>
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