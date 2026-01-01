# Tempus Development Plan

## Current Status
- **Posts:** 917 across 10 eras
- **Profiles:** 281 historical figures and ordinary people
- **Eras:** American Revolution, Ancient Rome, WWII, Renaissance, Civil Rights, French Revolution, Ancient Greece, WWI, Industrial Revolution, Viking Age
- **Build:** 1221 static pages, deployed to Vercel

---

## HIGH PRIORITY (Critical for Production)

### 1. Individual Post Page `/post/[id]`
**Status:** ✅ COMPLETE (2026-01-01)
**Files created:**
- `src/app/post/[id]/page.tsx` - Server component with generateStaticParams
- `src/components/post/PostPageContent.tsx` - Client component for interactivity

**Features implemented:**
- ✅ Full post view with expanded content
- ✅ All comments displayed
- ✅ Related posts from same era/author (3 each)
- ✅ Share buttons with full context (Twitter, Facebook, LinkedIn, Reddit, copy link)
- ✅ Historical context expanded by default
- ✅ Static generation for all 901 posts
- ✅ SEO metadata (OpenGraph, Twitter cards)
- ✅ Sitemap updated to include all post pages

---

### 2. Comments System
**Status:** ✅ COMPLETE (2026-01-01)
**Files created:**
- `src/components/CommentsProvider.tsx` - Context provider with localStorage persistence
- `src/components/comments/CommentForm.tsx` - Add comments with custom username
- `src/components/comments/CommentThread.tsx` - Nested replies with tree structure

**Features implemented:**
- ✅ localStorage persistence (like likes/bookmarks)
- ✅ Add comments to any post
- ✅ Reply to comments (nested threads up to 3 levels deep)
- ✅ Comment count updates dynamically in PostCard and PostPage
- ✅ Timestamp display with relative time (e.g., "2h ago")
- ✅ Custom username with edit capability
- ✅ Delete your own comments (cascades to replies)
- ✅ Show/hide replies toggle
- ✅ "Add a comment..." prompt in feed

---

### 3. Profile Tabs Functionality
**Status:** ✅ COMPLETE (2026-01-01)
**Files created:**
- `src/components/profile/ProfileTabs.tsx` - Client component with tab state

**Features implemented:**
- ✅ Posts tab: All posts by author (excluding replies)
- ✅ Replies tab: Posts that have `replyToId` set
- ✅ Media tab: Posts with images/videos in media array
- ✅ Likes tab: Simulated likes based on era, relationships, mentions, engagement
- ✅ Tab counts displayed for Posts, Replies, Media
- ✅ Responsive design with icons on mobile
- ✅ Empty states for each tab type

---

### 4. Settings Persistence
**Status:** ✅ COMPLETE (2026-01-01)
**Files created:**
- `src/components/SettingsProvider.tsx` - Context provider with localStorage persistence

**Settings implemented:**
- ✅ Theme preference (already worked via ThemeProvider)
- ✅ Reduce motion - disables all animations
- ✅ Content density (compact/comfortable)
- ✅ Default region filter
- ✅ Show context by default
- ✅ Show accuracy badges
- ✅ Daily digest notifications
- ✅ New era alerts notifications
- ✅ Reset to defaults button
- ✅ CSS classes for reduce-motion and compact-mode

---

### 5. Accessibility Fixes
**Status:** ✅ COMPLETE (2026-01-01)
**Files created:**
- `src/components/LiveAnnouncer.tsx` - Screen reader announcement provider

**Features implemented:**
- ✅ Skip navigation link for keyboard users
- ✅ `role="main"` and `id="main-content"` on main content area
- ✅ `alt` text on all avatar images
- ✅ `alt` text on all media in posts (uses item.alt field)
- ✅ `aria-label` on all icon-only buttons (more options, search, menu, follow)
- ✅ `aria-expanded` on mobile menu toggle
- ✅ `aria-hidden="true"` on decorative icons
- ✅ `aria-live` regions via LiveAnnouncerProvider
- ✅ Screen reader announcements for likes, bookmarks, follows
- ✅ Notification badges have proper screen reader text
- ✅ Search inputs have `type="search"` and `aria-label`

**Remaining (nice-to-have):**
- [ ] Test color contrast ratios (manual testing needed)
- [ ] Run automated accessibility audit (Lighthouse)

---

### 6. Error Boundaries
**Status:** ✅ COMPLETE (2026-01-01)
**Files created:**
- `src/components/ErrorBoundary.tsx` - Class component with retry functionality
- `src/components/feed/SafePostCard.tsx` - Wrapper for individual post error isolation
- `src/app/error.tsx` - Root route error handler
- `src/app/global-error.tsx` - Global error handler for layout errors
- `src/app/post/[id]/error.tsx` - Post page error handler
- `src/app/profile/[id]/error.tsx` - Profile page error handler
- `src/app/era/[id]/error.tsx` - Era page error handler

**Features implemented:**
- ✅ ErrorBoundary class component with getDerivedStateFromError
- ✅ Retry functionality (reset error state)
- ✅ Friendly themed error messages
- ✅ Development mode shows error details
- ✅ Console logging for debugging
- ✅ Individual post cards wrapped with error boundary
- ✅ Route-level error handlers for dynamic routes
- ✅ withErrorBoundary HOC for easy component wrapping
- ✅ PostErrorFallback for lightweight post error display

---

## MEDIUM PRIORITY (Enhance User Experience)

### 7. Content Expansion - New Eras
**Current imbalance:** American Revolution has 405 posts (45% of all content)

**Suggested new eras:**
1. **Medieval Period / Crusades** (1095-1291)
   - Crusaders, Saladin, Richard the Lionheart
   - Monks, peasants, merchants

2. **Ancient Egypt** (3100 BCE - 30 BCE)
   - Pharaohs: Ramesses, Cleopatra, Tutankhamun
   - Priests, scribes, workers

3. **American Civil War** (1861-1865)
   - Lincoln, Lee, Grant, Frederick Douglass
   - Soldiers, nurses, enslaved people

4. **Cold War / Space Race** (1947-1991)
   - JFK, Khrushchev, astronauts
   - Spies, scientists, ordinary citizens

5. **Age of Exploration** (1400-1600)
   - Columbus, Magellan, Zheng He
   - Sailors, indigenous peoples

**Target:** 20 profiles, 50 posts per new era

**Effort:** 3-4 hours per era (15-20 hours total)

---

### 8. Enhanced Search
**Status:** ✅ COMPLETE (2026-01-01)
**File:** `src/app/search/page.tsx`

**Features implemented:**
- ✅ Era dropdown filter (all 10 eras with post counts)
- ✅ Author/person filter with searchable dropdown
- ✅ Location filter with autocomplete from post locations
- ✅ Year range filter (From Year / To Year)
- ✅ Post type filter (Events, Status, Tweets, Quotes, Photos, Articles, Threads)
- ✅ Accuracy level filter (Verified, Documented, Attributed, Inferred, Speculative)
- ✅ Active filters shown as removable chips
- ✅ Era filter applies to both Posts and People tabs
- ✅ Results limited to 100 with overflow notice
- ✅ Full accessibility with ARIA labels

---

### 9. Real Trending Calculation
**Status:** ✅ COMPLETE (2026-01-01)
**Files modified:**
- `src/app/trending/page.tsx` - Full trending page rewrite
- `src/components/layout/RightSidebar.tsx` - Real data for sidebar

**Features implemented:**
- ✅ Calculate trending hashtags from actual post data
- ✅ Era filter dropdown (all 10 eras)
- ✅ Stats overview (posts, hashtags, engagements, avg likes)
- ✅ Engagement metrics with visual bars
- ✅ Top 15 hashtags sorted by engagement
- ✅ Top 10 most engaging posts
- ✅ Top 10 most influential profiles
- ✅ Weighted engagement scoring (likes + comments*2 + shares*3)
- ✅ Hashtags link to search results
- ✅ RightSidebar uses real trending data
- ✅ Suggested profiles based on real engagement

---

### 10. Notification System
**Status:** ✅ COMPLETE (2026-01-01)
**Files created:**
- `src/components/NotificationsProvider.tsx` - Context provider with localStorage persistence
- `src/app/notifications/page.tsx` - Full notifications page

**Features implemented:**
- ✅ Generate real notifications based on activity (follows, likes)
- ✅ "New post from followed user" notifications
- ✅ "Your liked post is trending" notifications
- ✅ Historical event notifications based on current date (July 4th, Bastille Day, etc.)
- ✅ "Time Traveler Achievement" milestone
- ✅ Mark as read/unread, mark all as read
- ✅ Notification badge in header shows real unread count
- ✅ Clear all, delete individual notifications
- ✅ Unread/read sections with color-coded types
- ✅ Links to relevant content (posts, profiles, eras)

---

### 11. User Profile (`/me`)
**Status:** ✅ COMPLETE (2026-01-01)
**Files created:**
- `src/app/me/page.tsx` - Full user profile page

**Features implemented:**
- ✅ Editable display name (persisted to localStorage)
- ✅ Stats overview: likes, bookmarks, follows, comments, notifications
- ✅ Era interests breakdown with visual progress bars
- ✅ 8 achievements system with unlock tracking
- ✅ Quick actions grid (Explore Eras, Find Figures, Trending, On This Day)
- ✅ Settings quick access via header icon
- ✅ Data export in JSON and CSV formats
- ✅ Three tabs: Overview, Achievements, Export
- ✅ Added "Your Profile" link to sidebar

---

### 12. On This Day Enhancement
**Status:** ✅ COMPLETE (2026-01-01)
**File:** `src/app/on-this-day/page.tsx`

**Features implemented:**
- ✅ Interactive date picker with month/day selectors
- ✅ Show events from same day across all years (60+ events across all eras)
- ✅ Historical facts from all 10 eras (Ancient Greece, Rome, Viking Age, Renaissance, French Revolution, WWI, WWII, Civil Rights, Industrial Revolution, American Revolution)
- ✅ "Today" badge when viewing current date
- ✅ Era-specific filtering with event counts
- ✅ BCE year support for ancient events
- ✅ Location displayed for each event
- ✅ Posts filtered by selected era
- ✅ Wrap-around navigation (Dec 31 → Jan 1)

---

## LOW PRIORITY (Nice to Have)

### 13. Keyboard Shortcuts
**Status:** ✅ COMPLETE (2026-01-01)
**Files created:**
- `src/components/KeyboardShortcutsProvider.tsx` - Global keyboard event handling
- `src/components/feed/KeyboardNavigablePost.tsx` - Post focus wrapper

**Features implemented:**
- ✅ `?` - Show keyboard shortcuts help modal
- ✅ `j/k` - Navigate between posts (with visual focus ring)
- ✅ `l` - Like/unlike focused post
- ✅ `b` - Bookmark/unbookmark focused post
- ✅ `c` - Open comments on focused post
- ✅ `s` - Share focused post
- ✅ `x` - Show historical context
- ✅ `Enter` - Open focused post
- ✅ `Escape` - Close modal or unfocus post
- ✅ `g h/e/p/n/m` - Go to Home/Explore/Profiles/Notifications/Me
- ✅ Keyboard icon button in header
- ✅ Shortcuts disabled when typing in inputs

---

### 14. Thread Support
**Status:** ✅ COMPLETE (2026-01-01)
**Files created:**
- `src/components/thread/ThreadView.tsx` - ThreadView, ThreadPreview, ShowThreadButton
- `src/app/thread/[id]/page.tsx` - Server component with generateStaticParams
- `src/app/thread/[id]/ThreadPageContent.tsx` - Client component for thread display
- `src/data/posts/threads.json` - 15 thread posts (3 threads)

**Features implemented:**
- ✅ Group threaded posts together with thread connector lines
- ✅ Thread position indicators (1/5, 2/5, etc.)
- ✅ "Show this thread" button on posts that are part of threads
- ✅ Dedicated thread view page `/thread/[id]`
- ✅ Highlight specific post via `?highlight=post-id` URL parameter
- ✅ Thread share menu (Twitter, Facebook, LinkedIn, copy link)
- ✅ Static generation for all thread pages
- ✅ Sample threads: Franklin on electricity, Jefferson on Declaration, Washington on Delaware crossing

---

### 15. PWA Support
**Status:** ✅ COMPLETE (2026-01-01)
**Files created:**
- `public/manifest.json` - App manifest with metadata, shortcuts, categories
- `public/sw.js` - Service worker with offline caching strategies
- `public/icons/` - App icons (72x72 to 512x512)
- `public/apple-touch-icon.png` - iOS home screen icon
- `src/components/ServiceWorkerProvider.tsx` - Install prompt and update notifications
- `scripts/generate-icons.js` - Icon generation from SVG source

**Features implemented:**
- ✅ PWA manifest with app metadata
- ✅ Service worker for offline support
- ✅ Cache-first for static assets, network-first for pages
- ✅ Install prompt banner (appears after 30 seconds)
- ✅ Update notification when new version available
- ✅ Offline indicator when network unavailable
- ✅ App icons at all required sizes
- ✅ Apple touch icon for iOS
- ✅ App shortcuts (Explore, On This Day, Search)

---

### 16. Image Assets
**Status:** All using initials as fallback

**Sources:**
- Wikimedia Commons (public domain)
- Library of Congress
- National Archives
- Metropolitan Museum of Art (open access)

**Tasks:**
- Generate/source avatar images for key figures
- Era cover images
- Historical event illustrations

**Effort:** 10-15 hours (research + optimization)

---

### 17. Open Graph Images
**Status:** ✅ COMPLETE (2026-01-01)
**Files created:**
- `public/og/` - 17 OG images (1200x630)
- `scripts/generate-og-images.js` - OG image generation script

**Images generated:**
- ✅ `default.png` - Site-wide default OG image
- ✅ `era-*.png` - 10 era-specific images with unique color schemes
- ✅ `post.png` - Generic post image
- ✅ `profile.png` - Generic profile image
- ✅ `thread.png` - Thread image
- ✅ `explore.png` - Explore page image
- ✅ `search.png` - Search page image
- ✅ `on-this-day.png` - On This Day page image

**Features implemented:**
- ✅ Era-specific OG images with themed colors
- ✅ Hourglass branding on all images
- ✅ Metadata updated in all dynamic routes
- ✅ Twitter summary_large_image cards
- ✅ OpenGraph article/profile types

---

### 18. Analytics Integration
**Status:** ✅ COMPLETE (2026-01-01)
**Packages installed:**
- `@vercel/analytics` - Page view and event tracking
- `@vercel/speed-insights` - Core Web Vitals monitoring

**Features implemented:**
- ✅ Automatic page view tracking on navigation
- ✅ Core Web Vitals monitoring (LCP, FID, CLS, TTFB, INP)
- ✅ Zero-config integration with Vercel dashboard
- ✅ Privacy-friendly (no cookies, GDPR compliant)
- ✅ Works automatically when deployed to Vercel

---

### 19. Data Export
**Status:** ✅ COMPLETE (2026-01-01)
**File:** `src/app/me/page.tsx`

**Features implemented:**
- ✅ Complete export (all data in one file)
- ✅ Individual exports (likes, bookmarks, follows, comments)
- ✅ JSON format with full details and metadata
- ✅ CSV format with proper escaping
- ✅ Full post details (author, content, date, era, likes, URL)
- ✅ Full profile details (name, handle, bio, era, followers)
- ✅ Comments with post author context
- ✅ Export includes achievements and era breakdown
- ✅ Individual export buttons per data type in UI

---

### 20. Relationship Network
**Status:** ✅ COMPLETE (2026-01-01)
**Files created:**
- `src/data/relationships.json` - 50+ historical relationships across all eras
- `src/components/profile/RelationshipNetwork.tsx` - Network visualization component
- `src/lib/data.ts` - Added getRelationships, getConnectedProfiles, getRelationshipBetween

**Features implemented:**
- ✅ Show relationships on profile pages
- ✅ List view with expandable categories
- ✅ Visual network diagram with radial layout
- ✅ 9 relationship types: spouse, family, friend, ally, colleague, mentor, student, rival, enemy
- ✅ Color-coded icons for each relationship type
- ✅ Bidirectional relationship detection
- ✅ Relationships across all eras (American Revolution, Rome, French Revolution, Renaissance, Civil Rights, WWII, Ancient Greece, Viking Age)

---

## CONTENT QUALITY IMPROVEMENTS

### Rebalance Existing Content
| Era | Current Posts | Target | Action |
|-----|--------------|--------|--------|
| American Revolution | 405 | 200 | Archive 200+ |
| Ancient Rome | 60 | 80 | Add 20 |
| WWII | 60 | 80 | Add 20 |
| Renaissance | 60 | 80 | Add 20 |
| Civil Rights | 45 | 75 | Add 30 |
| French Revolution | 72 | 80 | Add 8 |
| Ancient Greece | 60 | 80 | Add 20 |
| WWI | 45 | 75 | Add 30 |
| Industrial Revolution | 50 | 75 | Add 25 |
| Viking Age | 45 | 75 | Add 30 |

### Add More "Mundane" Posts
- Weather complaints
- Food observations
- Family updates
- Work frustrations
- Random thoughts

Target: 30% of posts should be "nothing posts"

---

## TECHNICAL DEBT

### Must Fix
- [ ] Image optimization pipeline
- [ ] Error boundaries throughout
- [ ] Data validation (Zod schemas)
- [ ] Accessibility audit

### Should Fix
- [ ] Performance profiling
- [ ] Bundle size optimization
- [ ] Lazy loading for images
- [ ] Responsive image sizing

### Nice to Fix
- [ ] Unit tests for data utilities
- [ ] E2E tests for critical paths
- [ ] Storybook for components
- [ ] Documentation for contributors

---

## IMPLEMENTATION ORDER

### Phase 1: Critical Fixes (Week 1)
1. Create `/post/[id]` page
2. Implement comments system
3. Fix profile tabs
4. Add settings persistence
5. Basic accessibility fixes

### Phase 2: Enhanced Features (Week 2)
1. Error boundaries
2. Enhanced search filters
3. Real trending calculation
4. Notification system
5. User profile page

### Phase 3: Content Expansion (Week 3)
1. Add Medieval Period era
2. Add Ancient Egypt era
3. Expand underrepresented eras
4. Balance content distribution

### Phase 4: Polish (Week 4)
1. Image assets
2. Keyboard shortcuts
3. PWA support
4. Open Graph images
5. Analytics

---

## ESTIMATED TOTAL EFFORT

| Priority | Hours |
|----------|-------|
| High | 20-25 |
| Medium | 25-35 |
| Low | 30-40 |
| Content | 20-30 |
| **Total** | **95-130 hours** |

---

## QUICK WINS (< 1 hour each)

1. Add `aria-label` to all icon buttons
2. Add era filter to search page
3. Fix profile tabs state management
4. Make settings toggles save to localStorage
5. Update hardcoded trending with real calculation
6. Add skip navigation link
7. Add alt text to avatar images

---

## SUCCESS METRICS

### Before Launch
- [ ] All pages load without errors
- [ ] Comments system functional
- [ ] Settings persist correctly
- [ ] Accessibility score > 90 (Lighthouse)
- [ ] Performance score > 80 (Lighthouse)
- [ ] All 10 eras have 60+ posts

### Post-Launch
- [ ] User engagement (likes, bookmarks, follows)
- [ ] Search usage patterns
- [ ] Popular eras/profiles
- [ ] Error rate monitoring
