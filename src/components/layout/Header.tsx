'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Menu,
  Bell,
  Clock,
  Home,
  Users,
  Calendar,
  Settings,
  X,
  Sun,
  Moon,
  Keyboard
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/ThemeProvider'
import { useNotifications } from '@/components/NotificationsProvider'
import { useKeyboardShortcuts } from '@/components/KeyboardShortcutsProvider'

function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    } else {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-muted transition-colors"
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
}

function KeyboardShortcutsButton() {
  const { setShowHelp } = useKeyboardShortcuts()

  return (
    <button
      onClick={() => setShowHelp(true)}
      className="p-2 rounded-full hover:bg-muted transition-colors hidden sm:flex"
      aria-label="Keyboard shortcuts"
      title="Keyboard shortcuts (?)"
    >
      <Keyboard className="h-5 w-5" />
    </button>
  )
}

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { unreadCount } = useNotifications()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Clock className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl hidden sm:inline">Tempus</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-muted border-0 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                aria-label="Search historical posts and figures"
              />
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <NavItem href="/" icon={Home} label="Home" active />
            <NavItem href="/explore" icon={Calendar} label="Eras" />
            <NavItem href="/profiles" icon={Users} label="Figures" />
            <NavItem href="/notifications" icon={Bell} label="Alerts" badge={unreadCount} />
            <KeyboardShortcutsButton />
            <ThemeToggle />
          </nav>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full hover:bg-muted"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-muted"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-muted border-0 focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                aria-label="Search historical posts and figures"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-border pt-4">
            <div className="flex flex-col gap-2">
              <MobileNavItem href="/" icon={Home} label="Home" active />
              <MobileNavItem href="/explore" icon={Calendar} label="Explore Eras" />
              <MobileNavItem href="/profiles" icon={Users} label="Historical Figures" />
              <MobileNavItem href="/notifications" icon={Bell} label="Notifications" badge={unreadCount} />
              <MobileNavItem href="/settings" icon={Settings} label="Settings" />
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

interface NavItemProps {
  href: string
  icon: React.ElementType
  label: string
  active?: boolean
  badge?: number
}

function NavItem({ href, icon: Icon, label, active, badge }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
      aria-label={badge && badge > 0 ? `${label}, ${badge} new` : label}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span className="text-sm">{label}</span>
      {badge && badge > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-medium" aria-hidden="true">
          {badge}
        </span>
      )}
    </Link>
  )
}

function MobileNavItem({ href, icon: Icon, label, active, badge }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-foreground hover:bg-muted"
      )}
      aria-label={badge && badge > 0 ? `${label}, ${badge} new` : label}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span>{label}</span>
      {badge && badge > 0 && (
        <span className="ml-auto h-6 w-6 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-sm font-medium" aria-hidden="true">
          {badge}
        </span>
      )}
    </Link>
  )
}
