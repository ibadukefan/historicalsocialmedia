import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { ThemeProvider } from '@/components/ThemeProvider'
import { BookmarksProvider } from '@/components/BookmarksProvider'
import { LikesProvider } from '@/components/LikesProvider'
import { FollowsProvider } from '@/components/FollowsProvider'
import { CommentsProvider } from '@/components/CommentsProvider'
import { SettingsProvider } from '@/components/SettingsProvider'
import { LiveAnnouncerProvider } from '@/components/LiveAnnouncer'
import { NotificationsProvider } from '@/components/NotificationsProvider'

// Dynamically import non-critical components
const RightSidebar = dynamic(() => import('@/components/layout/RightSidebar').then(mod => mod.RightSidebar), {
  ssr: true,
})
const KeyboardShortcutsProvider = dynamic(
  () => import('@/components/KeyboardShortcutsProvider').then(mod => mod.KeyboardShortcutsProvider),
  { ssr: false }
)
const ServiceWorkerProvider = dynamic(
  () => import('@/components/ServiceWorkerProvider').then(mod => mod.ServiceWorkerProvider),
  { ssr: false }
)
const Analytics = dynamic(() => import('@vercel/analytics/react').then(mod => mod.Analytics), { ssr: false })
const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then(mod => mod.SpeedInsights), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://tempus.app'),
  title: 'Tempus | Where the Past Posts Back',
  description: 'Experience world history as a social media feed. Scroll through time and see historical events, figures, and daily life as if they were posting on social media.',
  keywords: ['history', 'social media', 'timeline', 'historical events', 'education'],
  authors: [{ name: 'Tempus' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tempus',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Tempus | Where the Past Posts Back',
    description: 'Experience world history as a social media feed.',
    type: 'website',
    siteName: 'Tempus',
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: 'Tempus - Where the Past Posts Back',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tempus | Where the Past Posts Back',
    description: 'Experience world history as a social media feed.',
    images: ['/og/default.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <SettingsProvider>
          <LiveAnnouncerProvider>
          <BookmarksProvider>
          <LikesProvider>
          <FollowsProvider>
          <CommentsProvider>
          <NotificationsProvider>
          <KeyboardShortcutsProvider>
          <ServiceWorkerProvider>
          <div className="min-h-screen bg-background">
            {/* Skip Navigation Link */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
            >
              Skip to main content
            </a>
            <Header />
            <div className="flex max-w-7xl mx-auto">
              {/* Left Sidebar - Hidden on mobile */}
              <aside className="hidden lg:block w-64 shrink-0" aria-label="Primary sidebar">
                <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-4 px-2">
                  <Sidebar />
                </div>
              </aside>

              {/* Main Content */}
              <main id="main-content" role="main" className="flex-1 min-w-0 border-x border-border" tabIndex={-1}>
                {children}
              </main>

              {/* Right Sidebar - Hidden on mobile and tablet */}
              <aside className="hidden xl:block w-80 shrink-0" aria-label="Secondary sidebar">
                <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-4 px-4">
                  <RightSidebar />
                </div>
              </aside>
            </div>
          </div>
          </ServiceWorkerProvider>
          </KeyboardShortcutsProvider>
          </NotificationsProvider>
          </CommentsProvider>
          </FollowsProvider>
          </LikesProvider>
          </BookmarksProvider>
          </LiveAnnouncerProvider>
          </SettingsProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
