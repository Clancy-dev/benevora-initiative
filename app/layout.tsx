import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const geist = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Benevora Initiative',
    template: '%s | Benevora Initiative',
  },
  description:
    'Benevora Initiative is a charity organization dedicated to empowering lives and inspiring change in communities.',

  applicationName: 'Benevora Initiative',
  keywords: [
    'Benevora',
    'Benevora Initiative',
    'charity',
    'NGO',
    'donations',
    'community support',
    'Benevora Initiative',
    'volunteering',
  ],

  authors: [{ name: 'Benevora Initiative' }],
  creator: 'Benevora Initiative',
  publisher: 'Benevora Initiative',

  metadataBase: new URL('https://benevorainitiative.vercel.app'), // 🔁 change later

  icons: {
    icon: [
      { url: '/favicon-light.ico', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-dark.ico', media: '(prefers-color-scheme: dark)' },
      { url: '/favicon.ico' }, // fallback
    ],

    shortcut: [
      { url: '/favicon-32x32-light.png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-32x32-dark.png', media: '(prefers-color-scheme: dark)' },
    ],

    apple: [
      { url: '/apple-touch-icon-light.png', media: '(prefers-color-scheme: light)' },
      { url: '/apple-touch-icon-dark.png', media: '(prefers-color-scheme: dark)' },
    ],
  },

  openGraph: {
    title: 'Benevora Initiative',
    description:
      'Empowering lives and inspiring change in communities.',
    url: 'https://benevorainitiative.vercel.app',
    siteName: 'Benevora Initiative',
    images: [
      {
        url: '/og-image.png', // create this later
        width: 1200,
        height: 630,
        alt: 'Benevora Initiative',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Benevora Initiative',
    description:
      'Empowering lives and inspiring change in communities.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
           {/* 👇 Global toast container */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '10px',
              padding: '12px 16px',
            },
            success: {
              style: {
                background: '#16a34a',
                color: '#fff',
              },
            },
            error: {
              style: {
                background: '#dc2626',
                color: '#fff',
              },
            },
          }}
        />
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
