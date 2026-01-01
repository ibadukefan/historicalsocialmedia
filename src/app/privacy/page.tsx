import { Shield, Eye, Cookie, Database, Lock } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | Tempus',
  description: 'Privacy policy for Tempus - how we handle your data (spoiler: we don\'t collect any).',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <h1 className="font-bold text-xl flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">
          Your privacy, protected like a colonial secret
        </p>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-8">
        {/* TL;DR */}
        <section className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold mb-2 text-green-600 dark:text-green-400">The Short Version</h2>
              <p className="text-sm text-muted-foreground">
                Tempus is a static website. We don't have servers collecting your data,
                we don't have accounts, and we don't track you. Your likes, bookmarks,
                and preferences are stored locally in your browser and never leave your device.
              </p>
            </div>
          </div>
        </section>

        {/* What We Don't Collect */}
        <section>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            What We Don't Collect
          </h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Unlike King George III, we're not interested in your personal affairs:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>No personal information</li>
              <li>No email addresses</li>
              <li>No account data (there are no accounts)</li>
              <li>No usage analytics</li>
              <li>No tracking cookies</li>
              <li>No third-party advertising trackers</li>
            </ul>
          </div>
        </section>

        {/* Local Storage */}
        <section>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Local Storage
          </h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Tempus uses your browser's local storage to remember your preferences.
              This data stays on your device:
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-foreground">tempus-theme</p>
                <p className="text-xs">Your light/dark mode preference</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-foreground">tempus-bookmarks</p>
                <p className="text-xs">Posts you've saved</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-foreground">tempus-likes</p>
                <p className="text-xs">Posts you've liked</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-foreground">tempus-follows</p>
                <p className="text-xs">Profiles you follow</p>
              </div>
            </div>
            <p>
              You can clear this data anytime by clearing your browser's local storage
              or using your browser's "Clear site data" feature.
            </p>
          </div>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            Cookies
          </h2>
          <p className="text-sm text-muted-foreground">
            Tempus does not use cookies. We use localStorage for preferences,
            which is a different technology that doesn't send data to any servers.
          </p>
        </section>

        {/* Third Party */}
        <section>
          <h2 className="font-bold text-lg mb-3">Third-Party Services</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              When you share posts to social media, you'll be redirected to those platforms
              (Twitter, Facebook, LinkedIn, Reddit). Those platforms have their own privacy
              policies that apply once you leave Tempus.
            </p>
            <p>
              External links to historical sources (Library of Congress, National Archives, etc.)
              also have their own privacy policies.
            </p>
          </div>
        </section>

        {/* Hosting */}
        <section>
          <h2 className="font-bold text-lg mb-3">Hosting</h2>
          <p className="text-sm text-muted-foreground">
            Tempus is hosted as a static website. While the hosting provider may collect
            standard web server logs (IP addresses, browser type, etc.), Tempus itself
            has no access to this data and doesn't use it in any way.
          </p>
        </section>

        {/* Changes */}
        <section>
          <h2 className="font-bold text-lg mb-3">Changes to This Policy</h2>
          <p className="text-sm text-muted-foreground">
            If we ever change this policy (unlikely since we don't collect data anyway),
            we'll update this page. Unlike the Continental Congress, we won't need months
            of debate to decide.
          </p>
        </section>

        {/* Contact */}
        <section className="p-4 bg-muted rounded-lg">
          <h2 className="font-semibold mb-2">Questions?</h2>
          <p className="text-sm text-muted-foreground mb-3">
            If you have questions about your privacy on Tempus, check out our about page.
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
