import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date for display in the feed
 */
export function formatHistoricalDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format time for display
 */
export function formatHistoricalTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

/**
 * Get relative time string (e.g., "248 years ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffYears = now.getFullYear() - date.getFullYear()

  if (diffYears > 1) {
    return `${diffYears} years ago`
  } else if (diffYears === 1) {
    return '1 year ago'
  }

  const diffMonths = now.getMonth() - date.getMonth()
  if (diffMonths > 1) {
    return `${diffMonths} months ago`
  } else if (diffMonths === 1) {
    return '1 month ago'
  }

  const diffDays = now.getDate() - date.getDate()
  if (diffDays > 1) {
    return `${diffDays} days ago`
  } else if (diffDays === 1) {
    return '1 day ago'
  }

  return 'Today'
}

/**
 * Format numbers with commas (e.g., 1,234,567)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toLocaleString()
}

/**
 * Generate a slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Get accuracy badge color
 */
export function getAccuracyColor(accuracy: string): string {
  // Use !important (!) to prevent inheritance issues; WCAG 4.5:1 compliant contrast
  switch (accuracy) {
    case 'verified':
      return 'bg-green-100 !text-green-800 dark:bg-green-900/80 dark:!text-green-100'
    case 'documented':
      return 'bg-blue-100 !text-blue-800 dark:bg-blue-900/80 dark:!text-blue-100'
    case 'attributed':
      return 'bg-purple-100 !text-purple-800 dark:bg-purple-900/80 dark:!text-purple-100'
    case 'inferred':
      return 'bg-yellow-100 !text-yellow-800 dark:bg-yellow-900/80 dark:!text-yellow-100'
    case 'speculative':
      return 'bg-orange-100 !text-orange-800 dark:bg-orange-900/80 dark:!text-orange-100'
    default:
      return 'bg-gray-100 !text-gray-800 dark:bg-gray-800 dark:!text-gray-100'
  }
}

/**
 * Get post type icon name
 */
export function getPostTypeIcon(type: string): string {
  switch (type) {
    case 'tweet':
      return 'MessageCircle'
    case 'photo':
      return 'Image'
    case 'video':
      return 'Video'
    case 'article':
      return 'FileText'
    case 'quote':
      return 'Quote'
    case 'event':
      return 'Calendar'
    case 'relationship':
      return 'Heart'
    case 'location':
      return 'MapPin'
    case 'poll':
      return 'BarChart'
    case 'thread':
      return 'List'
    default:
      return 'MessageSquare'
  }
}
