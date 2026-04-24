import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/dashboard'], // adjust if you have private routes
      },
    ],
    sitemap: 'https://benevorainitiative.vercel.app/sitemap.xml', // 🔁 change later
  }
}