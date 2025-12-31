# DEV LOG — Tempus

Last Updated: 2025-12-30

## Quick Reference
- **Stack:** Next.js 14 (App Router, SSG), TypeScript, Tailwind CSS, Shadcn/UI patterns, TanStack Virtual
- **Status:** Phase 1.5 In Progress - GLOBAL Expansion (1775-1777)
- **Active Branch:** main

## Current Focus
**MAJOR PIVOT: Feed is now GLOBAL.** Not just American Revolution posts with occasional international mentions - the entire world is posting simultaneously. Added 37 profiles from China, Japan, Russia, France, Ottoman Empire, India, Africa (Ashanti/Dahomey), Spain, Mexico, Peru. 56 new global posts showing daily life and major events worldwide.

## Recent Changes
- 2025-12-30 — **GLOBAL POSTS HUMANIZED:** Rewrote 11 posts in global-1776.json that were still announcing events (Sultan on Crimea, Louis XVI on Declaration, Catherine on troop requests, etc). Now all 161 posts are pure human feelings.
- 2025-12-30 — **HUMANIZED ALL POSTS:** Rewrote all posts to be feelings, not history narration. People don't know they're in historic moments - they're just living. Context button handles education.
- 2025-12-30 — **MUNDANE POSTS:** Added 40 "nothing posts" - everyday observations, complaints, random thoughts. Real social media is 90% mundane, 10% meaningful. See CONTENT_GUIDE.md
- 2025-12-30 — **CONTENT_GUIDE.md:** Created comprehensive guide for authentic post writing based on social media research
- 2025-12-30 — **HISTORICAL CONTEXT FEATURE:** Added "Context" button (lightbulb icon) to posts - click to see what's historically happening. Keeps posts human, education on-demand
- 2025-12-30 — **SOCIAL SHARING:** Each post now shareable to Twitter/X, Facebook, LinkedIn, Reddit + copy link
- 2025-12-30 — **GLOBAL EXPANSION:** Added 56 posts from around the world (China, Japan, Russia, Ottoman Empire, France, India, Africa, Spain, Peru, Mexico)
- 2025-12-30 — **37 PROFILES:** Emperor Qianlong, Catherine the Great, Shogun Tokugawa, Hyder Ali, Túpac Amaru II, plus ordinary people (weavers, farmers, merchants, serfs)
- 2025-12-30 — **CONTENT REWRITE:** All posts rewritten with human, in-the-moment voice. Historical explanation moved to `historicalContext` field
- 2025-12-30 — Build verified successful (47 static pages, 161 posts total)
- 2025-12-30 — **EXPANSION:** Added 30 posts covering 1775-1777 (Lexington, Bunker Hill, Common Sense, Trenton, Princeton)
- 2025-12-30 — Created `/explore`, `/search`, `/profiles`, `/era/[id]` pages
- 2025-12-30 — Project initialized with Next.js 14, TypeScript, core components

## Architecture

### Directory Structure
```
historicalsocialmedia/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with Header/Sidebars
│   │   ├── page.tsx            # Home feed page
│   │   ├── globals.css         # Global styles + Tailwind
│   │   ├── not-found.tsx       # 404 page
│   │   ├── explore/page.tsx    # Era browser
│   │   ├── search/page.tsx     # Search with filters
│   │   ├── profiles/page.tsx   # Profiles directory
│   │   ├── era/[id]/page.tsx   # Era-specific feeds
│   │   └── profile/[id]/page.tsx
│   ├── components/
│   │   ├── layout/             # Header, Sidebar, RightSidebar
│   │   ├── feed/               # PostCard, Feed
│   │   └── ui/                 # Button, etc.
│   ├── lib/
│   │   ├── utils.ts            # Utility functions
│   │   └── data.ts             # Data access layer
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   └── data/
│       ├── posts/
│       │   ├── july-1776.json           # 35 posts (July 1776, historical events)
│       │   ├── revolution-expanded.json # 30 posts (1775-1777, historical events)
│       │   ├── global-1776.json         # 56 posts (WORLDWIDE, historical events)
│       │   └── mundane-1776.json        # 40 posts (everyday "nothing" posts)
│       ├── profiles/
│       │   └── index.json      # 37 profiles (15 US + 22 global)
│       └── eras/
│           └── index.json      # Era metadata
├── public/                     # Static assets
├── dev_log_archive/            # Archived dev log entries
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
└── DEV_LOG.md
```

### Key Decisions
1. **Next.js App Router** — Better layouts, streaming, and server components
2. **Static Export** (`output: 'export'`) — Pure static site, no server needed
3. **JSON for data** — Structured, typed, easy to query
4. **TanStack Virtual** — Performance for large feeds
5. **Accuracy system** — 5 levels: verified, documented, attributed, inferred, speculative
6. **Source citations** — Every post can link to primary/secondary sources
7. **Human voice + Context on-demand** — Posts written as humans would post today. Educational context in separate `historicalContext` field, revealed via "Context" button. Solves the "history textbook" problem.
8. **90/10 mundane ratio** — Real social media is 90% mundane (weather, complaints, random thoughts) and 10% meaningful. See CONTENT_GUIDE.md for taxonomy of post types.

## Active Bugs / Issues
- Images need to be added to `/public/avatars/` and `/public/images/` (using initial letters as fallback)
- None blocking - build passes successfully

## Known Solutions
- **Webpack cache corruption** — If you see "Cannot find module './XXX.js'" errors, run `rm -rf .next && npm run dev` to clear cache and rebuild
- **Date display:** Use ISO strings in data, format on render with `date-fns` patterns
- **Post type flexibility:** Single PostCard component handles all types via conditional rendering
- **Mobile navigation:** Collapsible mobile menu in Header component

## Failed Approaches
- (None yet - fresh project)

## Services & Integrations
- **Hosting:** Vercel recommended (free tier works well)
- **Images:**
  - Wikimedia Commons (public domain historical images)
  - Library of Congress Digital Collections
  - National Archives
- **Fonts:** Inter (default), system fonts fallback

## Technical Debt
- [ ] Add proper image optimization (currently `unoptimized: true`)
- [ ] Implement client-side search functionality
- [ ] Add loading skeletons for better UX
- [ ] Create proper error boundaries

## Roadmap

### Phase 1: American Revolution - MVP (COMPLETE)
- [x] Core component library
- [x] Data schema and types
- [x] July 1776 content (52 posts)
- [x] Key profiles (15 created)
- [x] Basic feed with date grouping
- [x] Profile pages
- [x] Test full build process (25 pages generated)
- [ ] Add actual images (using initials as placeholders)
- [ ] Deploy to Vercel

### Phase 1.5: GLOBAL Expansion (IN PROGRESS)
- [x] Expand timeline to 1775-1777 (28 new posts)
- [x] Implement search functionality with filters
- [x] Create era landing pages (`/era/[id]`)
- [x] Create explore page (`/explore`)
- [x] Create profiles directory (`/profiles`)
- [x] **GLOBAL VOICES:** Added 56 posts from worldwide perspectives
- [x] **37 PROFILES:** China, Japan, Russia, France, Ottoman Empire, India, Africa, Spain, Peru, Mexico
- [x] **CONTENT REWRITE:** Human, in-the-moment voice (not history textbook)
- [x] **HISTORICAL CONTEXT:** Click "Context" button on any post to learn what's actually happening historically
- [x] **BUILD:** 47 static pages, 132 posts total
- [ ] Expand to full 1775-1783 period
- [ ] Add 200+ posts total
- [ ] Add 50+ profiles
- [ ] Add "On This Day" feature

### Phase 2: Ancient Rome
- [ ] 100+ posts (Republic and Empire)
- [ ] Key figures (Caesar, Augustus, etc.)
- [ ] Latin terminology integration
- [ ] New visual theme option

### Phase 3: World War II
- [ ] Multi-front coverage (Europe, Pacific, Home Front)
- [ ] Photo-heavy content
- [ ] Day-by-day major events
- [ ] Global perspective (all major nations)

### Phase 4: Renaissance & Enlightenment
- [ ] Art and science focus
- [ ] Cross-cultural exchange
- [ ] Da Vinci, Michelangelo, etc.

### Phase 5: Civil Rights Movement
- [ ] 1950s-1970s coverage
- [ ] MLK, Rosa Parks, Malcolm X
- [ ] Video/speech content

## Notes

### Content Guidelines
See **CONTENT_GUIDE.md** for full taxonomy and examples. Key points:
- **90% Mundane / 10% Meaningful:** Real social media is mostly weather complaints, food thoughts, random observations. Not every post needs historical significance.
- **GLOBAL by default:** Feed always shows the ENTIRE WORLD posting, not just one region
- **In-the-moment voice:** Posts are written AS IF living through events - fears, jokes, complaints, love
- **The "Nothing Post":** At least 30% of posts should be about nothing in particular - just life
- **Historical Context (on-demand):** Educational info in `historicalContext` field. Users click "Context" to learn more.
- **Post Types:** Mundane observations (30%), venting/complaints (20%), family content (15%), self-deprecating humor (10%), questions (10%), small wins (5%), hot takes (5%), big events (5%)

### Global Profiles by Region (1776)
- **Americas:** Founding Fathers, ordinary colonists, British soldiers
- **China:** Emperor Qianlong, Canton tea merchants, Suzhou silk weavers
- **Japan:** Shogun Tokugawa Ieharu, Edo fishmongers, Kyoto geisha
- **Russia:** Catherine the Great, Tula province serfs
- **France:** Louis XVI, Marie Antoinette, Paris bakers
- **Ottoman Empire:** Sultan Abdul Hamid I, Constantinople spice merchants, sailors' wives
- **India:** Hyder Ali of Mysore, Madras weavers, East India Company clerks
- **Africa:** Ashanti King Osei Kwame, Dahomey Amazons, farmers
- **Spain/Latin America:** King Carlos III, Mexican market vendors, Túpac Amaru II
- **Diaspora:** Olaudah Equiano, James Somerset (freed slaves in London)

### Post Type Breakdown
1. `status` — General update (Facebook-style)
2. `tweet` — Short message (Twitter-style)
3. `photo` — Image with caption
4. `video` — Video description/embed
5. `article` — Long-form content
6. `quote` — Historical quote
7. `event` — Major historical event (highlighted)
8. `relationship` — Status change
9. `location` — Check-in
10. `poll` — Opinion poll
11. `thread` — Multi-part thread

### Accuracy Levels
- `verified` — Direct from historical records (green badge)
- `documented` — Well-documented fact (blue badge)
- `attributed` — Attributed quote/action (purple badge)
- `inferred` — Reasonable inference (yellow badge)
- `speculative` — Educated guess (orange badge, with note)

### Running the Project
```bash
npm install
npm run dev     # Development server
npm run build   # Production build
npm run start   # Serve production build
```

## SEO & Accessibility

### Implemented
- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard navigation support
- Meta tags in layout
- Alt text required for all images

### TODO
- [ ] Add structured data (JSON-LD) for historical events
- [ ] Create sitemap.xml generator
- [ ] Add Open Graph images
- [ ] Implement skip links

## Historical Sources (for expansion)
- Library of Congress: https://www.loc.gov/
- National Archives: https://www.archives.gov/
- Wikimedia Commons: https://commons.wikimedia.org/
- Founders Online (Adams, Jefferson, etc.): https://founders.archives.gov/
- British National Archives: https://www.nationalarchives.gov.uk/
- Yale Avalon Project: https://avalon.law.yale.edu/
