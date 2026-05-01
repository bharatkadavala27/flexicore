import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { I18nProvider } from '@/components/i18n-provider'
import { JsonLd, organizationSchema } from '@/components/json-ld'
import { SmoothScrollProvider } from '@/components/smooth-scroll-provider'
import { CookieConsent } from '@/components/cookie-consent'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.flexicore.com'),
  title: {
    default: 'Flexicore | Premium Solid Surface & Tiles Manufacturer',
    template: '%s | Flexicore',
  },
  description: 'Flexicore is a leading manufacturer of premium solid surfaces and tiles. Discover our range of Alabaster, Marble, Mosaic, Sparkle, and Translucent surfaces.',
  generator: 'Flexicore',
  keywords: ['solid surface', 'tiles', 'marble', 'alabaster', 'mosaic', 'translucent', 'sparkle', 'flexicore', 'countertop', 'interior'],
  authors: [{ name: 'Flexicore' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.flexicore.com',
    siteName: 'Flexicore',
    title: 'Flexicore | Premium Solid Surface & Tiles Manufacturer',
    description: 'Discover premium Alabaster, Marble, Mosaic, Sparkle, Translucent, and Plain Surface collections.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flexicore | Premium Solid Surface & Tiles',
    description: 'Discover premium solid surface collections.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <head>
        <JsonLd data={organizationSchema} />
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <I18nProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
          <CookieConsent />
        </I18nProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
