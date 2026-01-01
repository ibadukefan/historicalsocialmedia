import { FileText, Scale, AlertTriangle, BookOpen } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service | Tempus',
  description: 'Terms of service for using Tempus, the historical social media experience.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <h1 className="font-bold text-xl flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: July 4, 1776 (just kidding, 2024)
        </p>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-8">
        {/* Intro */}
        <section className="p-4 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-start gap-3">
            <Scale className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold mb-2">Welcome to Tempus</h2>
              <p className="text-sm text-muted-foreground">
                By using Tempus, you agree to experience history in a new way.
                This is an educational platform that reimagines how historical figures
                might have shared their thoughts on social media.
              </p>
            </div>
          </div>
        </section>

        {/* Content Disclaimer */}
        <section>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Content Disclaimer
          </h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Historical Accuracy:</strong> While we strive for historical accuracy,
              posts are creative interpretations of what historical figures might have said.
              All content is clearly marked with accuracy indicators:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-green-500 font-medium">Verified</span> - Based on documented quotes or events</li>
              <li><span className="text-blue-500 font-medium">Attributed</span> - Based on historical records</li>
              <li><span className="text-yellow-500 font-medium">Speculative</span> - Creative interpretation based on context</li>
            </ul>
            <p>
              <strong className="text-foreground">Educational Purpose:</strong> This platform is meant for education
              and entertainment. We encourage users to explore primary sources and academic
              resources for comprehensive historical understanding.
            </p>
          </div>
        </section>

        {/* User Conduct */}
        <section>
          <h2 className="font-bold text-lg mb-3">User Conduct</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>When using Tempus, you agree to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Approach historical content with curiosity and respect</li>
              <li>Understand that this is a static, read-only experience</li>
              <li>Not mistake creative interpretations for historical fact</li>
              <li>Share content responsibly with proper context</li>
            </ul>
          </div>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Content & Sources
          </h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Historical quotes in the public domain are used freely. Creative content
              is original work inspired by historical events and figures.
            </p>
            <p>
              Images are sourced from public domain collections including:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Library of Congress</li>
              <li>National Archives</li>
              <li>Wikimedia Commons</li>
              <li>Metropolitan Museum of Art Open Access</li>
            </ul>
          </div>
        </section>

        {/* No Warranty */}
        <section>
          <h2 className="font-bold text-lg mb-3">No Warranty</h2>
          <p className="text-sm text-muted-foreground">
            Tempus is provided "as is" without warranties of any kind. We make no guarantees
            about the accuracy, completeness, or reliability of any content. Historical
            interpretation is complex, and reasonable scholars may disagree.
          </p>
        </section>

        {/* Contact */}
        <section className="p-4 bg-muted rounded-lg">
          <h2 className="font-semibold mb-2">Questions?</h2>
          <p className="text-sm text-muted-foreground mb-3">
            If you have questions about these terms or find historical inaccuracies,
            we'd love to hear from you.
          </p>
          <Link
            href="/about"
            className="text-sm text-primary hover:underline"
          >
            Learn more about Tempus
          </Link>
        </section>
      </div>
    </div>
  )
}
