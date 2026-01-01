import { HelpCircle, BookOpen, Users, CheckCircle2, AlertCircle, Heart, Github } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'About Tempus | Where the Past Posts Back',
  description: 'Learn about Tempus, the historical social media platform that brings history to life.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <h1 className="font-bold text-xl flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          About Tempus
        </h1>
        <p className="text-sm text-muted-foreground">
          Where the past posts back
        </p>
      </div>

      {/* Hero */}
      <div className="p-6 border-b border-border bg-gradient-to-b from-primary/10 to-transparent">
        <h2 className="text-2xl font-bold mb-2">What if history had social media?</h2>
        <p className="text-muted-foreground">
          Tempus reimagines historical events as a social media feed. Instead of reading about history,
          you scroll through it - seeing what real people might have posted as they lived through
          some of the most transformative moments in human history.
        </p>
      </div>

      {/* Mission */}
      <div className="p-6 border-b border-border">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Our Approach
        </h3>
        <div className="space-y-4 text-sm">
          <p>
            <strong>Human first, history second.</strong> We write posts as people would actually write them -
            complaints about the weather, excitement about food, frustration with work, love for family.
            Historical events happen in the background, the way they do in real life.
          </p>
          <p>
            <strong>Global perspective.</strong> When Americans were declaring independence, what was happening
            in China? Japan? The Ottoman Empire? We show the whole world, not just one corner of it.
          </p>
          <p>
            <strong>Education on demand.</strong> Every post has a "Context" button that reveals the historical
            significance. The posts stay human; the learning is there when you want it.
          </p>
        </div>
      </div>

      {/* Accuracy */}
      <div className="p-6 border-b border-border">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Historical Accuracy
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
            <div>
              <p className="font-medium">Verified</p>
              <p className="text-sm text-muted-foreground">Direct quotes or documented events from historical records</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
            <div>
              <p className="font-medium">Documented</p>
              <p className="text-sm text-muted-foreground">Well-documented historical facts and events</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
            <div>
              <p className="font-medium">Attributed</p>
              <p className="text-sm text-muted-foreground">Quotes or actions attributed to historical figures</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
            <div>
              <p className="font-medium">Inferred</p>
              <p className="text-sm text-muted-foreground">Reasonable inferences based on historical context</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2" />
            <div>
              <p className="font-medium">Speculative</p>
              <p className="text-sm text-muted-foreground">Fictional but historically plausible - clearly marked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profiles */}
      <div className="p-6 border-b border-border">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Who's Posting?
        </h3>
        <div className="space-y-4 text-sm">
          <p>
            <strong>Historical figures</strong> (marked with a blue checkmark) are real people from history.
            Their posts are based on their documented writings, speeches, and known personality traits.
          </p>
          <p>
            <strong>Ordinary people</strong> are fictional composites based on historical records of daily life.
            A baker in Paris, a fishmonger in Edo, a weaver in Madras - these represent the millions of
            people who lived through history without making it into the textbooks.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-6 border-b border-border">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Important Note
        </h3>
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-sm">
            Tempus is an educational project that uses creative interpretation to make history engaging.
            While we strive for accuracy, this is not a primary historical source. Posts marked as
            "speculative" are fictional. Always consult academic sources for research purposes.
          </p>
        </div>
      </div>

      {/* Credits */}
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Credits
        </h3>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            Built with Next.js, TypeScript, and Tailwind CSS.
          </p>
          <p>
            Historical research sourced from the Library of Congress, National Archives,
            Founders Online, and various academic publications.
          </p>
          <p>
            Created with the belief that history is more than dates and battles -
            it's the story of people just like us, living their lives.
          </p>
        </div>
      </div>
    </div>
  )
}
