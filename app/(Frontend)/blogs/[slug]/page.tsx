import { getAllBlogs, getBlogBySlug } from "@/actions/blogs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/front-header";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const result = await getBlogBySlug(slug);

  if (!result.success || !result.data) {
    return {
      title: 'Blog Not Found',
    };
  }

  const blog = result.data;

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [blog.image],
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  const result = await getAllBlogs();

  if (!result.success || !result.data) {
    return [];
  }

  return result.data.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const result = await getBlogBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const blog = result.data;

  const allBlogs = await getAllBlogs();

  const relatedBlogs = allBlogs.success
    ? (allBlogs.data || [])
        .filter((b) => b.category === blog.category && b.id !== blog.id)
        .slice(0, 3)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      {/* Blog Detail */}
      <main className="flex-1">
        {/* Blog Content Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            {/* Back Button */}
            <div className="mb-12">
              <Link
                href="/blogs"
                className="inline-flex items-center text-primary font-semibold hover:text-accent transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Blogs
              </Link>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Title */}
                <div className="mb-8">
                  <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight text-balance">
                    {blog.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">By {blog.author}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(blog.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-accent bg-primary/10 px-4 py-2 rounded-full">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Featured Image - Centered and Constrained */}
                <div className="mb-12 flex justify-center">
                  <div className="w-full max-w-2xl rounded-xl overflow-hidden shadow-lg">
                    <div className="relative w-full h-96 md:h-[28rem]">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>

                {/* Content with preserved formatting */}
                <div className="prose prose-invert max-w-none mb-16">
                  <div className="whitespace-pre-wrap break-words text-foreground/90 leading-relaxed text-base md:text-lg space-y-6">
                    {blog.content}
                  </div>
                </div>

                {/* Back Link at Bottom */}
                <Link
                  href="/blogs"
                  className="inline-flex items-center text-primary font-semibold hover:text-accent transition-colors group mt-12"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to All Blogs
                </Link>
              </div>

              {/* Sidebar */}
              <div className="lg:col-start-3">
                {/* Excerpt Box */}
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-8 sticky top-8">
                  <h3 className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
                    Article Summary
                  </h3>
                  <p className="text-foreground/90 whitespace-pre-wrap break-words leading-relaxed text-sm">
                    {blog.excerpt}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <section className="py-16 md:py-24 bg-muted/20">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-foreground mb-12">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog.id}
                    href={`/blogs/${relatedBlog.slug}`}
                    className="group"
                  >
                    <article className="bg-background border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col h-full">
                      <div className="relative h-48 w-full overflow-hidden bg-muted">
                        <Image
                          src={relatedBlog.image}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <span className="text-xs font-semibold text-accent bg-primary/10 px-3 py-1 rounded-full w-fit mb-3">
                          {relatedBlog.category}
                        </span>
                        <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                          {relatedBlog.title}
                        </h3>
                        <p className="text-foreground/70 text-sm mb-4 line-clamp-2 flex-1">
                          {relatedBlog.excerpt}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          By {relatedBlog.author}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
   
  );
}
