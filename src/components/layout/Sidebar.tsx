'use client'

import Link from 'next/link'
import {
  Home,
  Calendar,
  Users,
  Bookmark,
  Heart,
  MapPin,
  Clock,
  TrendingUp,
  Settings,
  HelpCircle,
  Scroll,
  CalendarDays,
  Bell,
  UserCheck,
  User
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  href: string
  icon: React.ElementType
  label: string
  active?: boolean
  badge?: string
}

function SidebarItem({ href, icon: Icon, label, active, badge }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
        active
          ? "bg-primary text-primary-foreground font-medium"
          : "text-foreground hover:bg-muted"
      )}
    >
      <Icon className={cn(
        "h-5 w-5 shrink-0",
        active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
      )} />
      <span className="truncate">{label}</span>
      {badge && (
        <span className={cn(
          "ml-auto text-xs px-2 py-0.5 rounded-full",
          active ? "bg-primary-foreground/20" : "bg-muted"
        )}>
          {badge}
        </span>
      )}
    </Link>
  )
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  )
}

export function Sidebar() {
  // In a real app, these would come from router/state
  const currentPath = '/'

  return (
    <nav className="space-y-2" aria-label="Main navigation">
      {/* Main Navigation */}
      <SidebarSection title="Navigate">
        <SidebarItem
          href="/"
          icon={Home}
          label="Home Feed"
          active={currentPath === '/'}
        />
        <SidebarItem
          href="/explore"
          icon={Calendar}
          label="Explore Eras"
        />
        <SidebarItem
          href="/profiles"
          icon={Users}
          label="Historical Figures"
        />
        <SidebarItem
          href="/map"
          icon={MapPin}
          label="World Map"
        />
        <SidebarItem
          href="/timeline"
          icon={Clock}
          label="Timeline View"
        />
        <SidebarItem
          href="/on-this-day"
          icon={CalendarDays}
          label="On This Day"
        />
      </SidebarSection>

      {/* Eras Quick Access */}
      <SidebarSection title="Featured Eras">
        <SidebarItem
          href="/era/american-revolution"
          icon={Scroll}
          label="American Revolution"
          badge="1775-1783"
        />
        <SidebarItem
          href="/era/ancient-rome"
          icon={Scroll}
          label="Ancient Rome"
          badge="Coming"
        />
        <SidebarItem
          href="/era/world-war-2"
          icon={Scroll}
          label="World War II"
          badge="Coming"
        />
      </SidebarSection>

      {/* User Section */}
      <SidebarSection title="Your Activity">
        <SidebarItem
          href="/me"
          icon={User}
          label="Your Profile"
        />
        <SidebarItem
          href="/notifications"
          icon={Bell}
          label="Notifications"
        />
        <SidebarItem
          href="/bookmarks"
          icon={Bookmark}
          label="Saved Posts"
        />
        <SidebarItem
          href="/likes"
          icon={Heart}
          label="Liked Posts"
        />
        <SidebarItem
          href="/following"
          icon={UserCheck}
          label="Following"
        />
        <SidebarItem
          href="/trending"
          icon={TrendingUp}
          label="Trending"
        />
      </SidebarSection>

      {/* Divider */}
      <div className="border-t border-border my-4" />

      {/* Settings */}
      <div className="space-y-1">
        <SidebarItem
          href="/settings"
          icon={Settings}
          label="Settings"
        />
        <SidebarItem
          href="/about"
          icon={HelpCircle}
          label="About Tempus"
        />
      </div>

      {/* Footer */}
      <div className="pt-4 px-3">
        <p className="text-xs text-muted-foreground">
          Historical accuracy: 99% verified sources, 1% educated speculation (marked).
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          &copy; 2024 Tempus
        </p>
      </div>
    </nav>
  )
}
