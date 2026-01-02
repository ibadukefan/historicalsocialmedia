# Contributing to Tempus

Thank you for your interest in contributing to Tempus! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Adding Content](#adding-content)
- [Code Guidelines](#code-guidelines)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
git clone https://github.com/your-username/tempus.git
cd tempus
npm install
```

### Running Locally

```bash
# Development server
npm run dev

# Build for production
npm run build

# Serve production build
npx serve out
```

## Development Setup

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:e2e` | Run E2E tests |
| `npm run storybook` | Start Storybook |

### IDE Setup

We recommend VS Code with:
- ESLint extension
- Tailwind CSS IntelliSense
- TypeScript support

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── era/[id]/          # Era pages
│   ├── post/[id]/         # Post pages
│   └── profile/[id]/      # Profile pages
├── components/
│   ├── feed/              # Feed components (PostCard, Feed)
│   ├── layout/            # Layout components (Header, Sidebar)
│   ├── ui/                # UI primitives (Button, Skeleton)
│   └── providers/         # Context providers
├── data/
│   ├── posts/             # Post JSON files by era
│   ├── profiles/          # Profile data
│   └── eras/              # Era metadata
├── lib/
│   ├── data.ts            # Data access functions
│   ├── schemas.ts         # Zod validation schemas
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript interfaces
```

## Adding Content

### Adding Posts

Posts are stored in `src/data/posts/`. Each era has its own JSON file.

```json
{
  "id": "unique-post-id",
  "authorId": "profile-id",
  "type": "status",
  "content": "The post content written in human voice",
  "timestamp": "1776-07-04T12:00:00Z",
  "displayDate": "July 4, 1776",
  "era": "american-revolution",
  "likes": 100,
  "comments": 10,
  "shares": 5,
  "accuracy": "documented",
  "historicalContext": "Historical context shown on demand"
}
```

#### Post Types
- `status` - General update
- `tweet` - Short message
- `photo` - Image with caption
- `video` - Video description
- `article` - Long-form content
- `quote` - Historical quote
- `event` - Major historical event
- `thread` - Multi-part thread

#### Accuracy Levels
- `verified` - Direct from historical records
- `documented` - Well-documented fact
- `attributed` - Attributed quote/action
- `inferred` - Reasonable inference
- `speculative` - Educated guess

### Adding Profiles

Profiles are in `src/data/profiles/index.json`:

```json
{
  "id": "thomas-jefferson",
  "name": "Thomas Jefferson",
  "displayName": "Thomas Jefferson",
  "handle": "@TJefferson",
  "bio": "Author of the Declaration of Independence",
  "avatar": "/avatars/jefferson.jpg",
  "era": ["american-revolution"],
  "isVerified": true,
  "isActive": false,
  "accuracy": "verified"
}
```

### Content Guidelines

See `CONTENT_GUIDE.md` for full details. Key points:

1. **Human voice** - Write as if the person is posting on social media, not narrating history
2. **90/10 ratio** - 90% mundane posts, 10% historically significant
3. **Context on demand** - Use `historicalContext` field for education
4. **Global perspective** - Include voices from around the world

## Code Guidelines

### TypeScript

- Use TypeScript for all new code
- Prefer `interface` over `type` for object shapes
- Use Zod schemas for runtime validation

### Components

- Use functional components with hooks
- Follow naming convention: `ComponentName.tsx`
- Put stories alongside components: `ComponentName.stories.tsx`
- Wrap with error boundaries where appropriate

### Styling

- Use Tailwind CSS classes
- Follow existing patterns for spacing, colors
- Support dark mode with `dark:` variants
- Consider `reduce-motion` preferences

### Data Validation

Use Zod schemas from `src/lib/schemas.ts`:

```typescript
import { PostSchema, validatePosts } from '@/lib/schemas'

// Validate single post
const result = PostSchema.safeParse(data)

// Validate array of posts
const { success, data, errors } = validatePosts(posts)
```

## Testing

### Unit Tests

```bash
# Run all unit tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

Tests use Vitest and are located alongside source files (`*.test.ts`).

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# With UI
npm run test:e2e:ui
```

E2E tests use Playwright and are in the `e2e/` directory.

### Storybook

```bash
npm run storybook
```

View and develop components in isolation at http://localhost:6006.

## Pull Request Process

1. **Fork** the repository
2. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make changes** following the guidelines above
4. **Test** your changes:
   ```bash
   npm run lint
   npm test
   npm run build
   ```
5. **Commit** with a descriptive message
6. **Push** to your fork
7. **Open a PR** against `main`

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No lint errors (`npm run lint`)
- [ ] New content follows accuracy guidelines
- [ ] Historical context provided where appropriate

## Questions?

Open an issue for questions or concerns. We're happy to help!
