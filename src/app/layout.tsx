import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { RightSidebar } from '@/components/layout/RightSidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://tempus.app'),
  title: 'Tempus | Where the Past Posts Back',
  description: 'Experience world history as a social media feed. Scroll through time and see historical events, figures, and daily life as if they were posting on social media.',
  keywords: ['history', 'social media', 'timeline', 'historical events', 'education'],
  authors: [{ name: 'Tempus' }],
  openGraph: {
    title: 'Tempus | Where the Past Posts Back',
    description: 'Experience world history as a social media feed.',
    type: 'website',
    siteName: 'Tempus',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tempus | Where the Past Posts Back',
    description: 'Experience world history as a social media feed.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="flex max-w-7xl mx-auto">
            {/* Left Sidebar - Hidden on mobile */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-4 px-2">
                <Sidebar />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 border-x border-border">
              {children}
            </main>

            {/* Right Sidebar - Hidden on mobile and tablet */}
            <aside className="hidden xl:block w-80 shrink-0">
              <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-4 px-4">
                <RightSidebar />
              </div>
            </aside>
          </div>
        </div>
      </body>
    </html>
  )
}
