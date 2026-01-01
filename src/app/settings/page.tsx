'use client'

import { Settings, Moon, Sun, Globe, Bell, Eye, Palette, Monitor, RotateCcw, AlignJustify, StretchHorizontal } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { useSettings } from '@/components/SettingsProvider'

interface SettingItemProps {
  icon: React.ElementType
  title: string
  description: string
  control: React.ReactNode
}

function SettingItem({ icon: Icon, title, description, control }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {control}
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? 'bg-primary' : 'bg-muted'
      }`}
      aria-label="Toggle setting"
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
          checked ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  )
}

function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setTheme('light')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors ${
          theme === 'light'
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border hover:bg-muted'
        }`}
      >
        <Sun className="h-4 w-4" />
        <span className="text-sm">Light</span>
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors ${
          theme === 'dark'
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border hover:bg-muted'
        }`}
      >
        <Moon className="h-4 w-4" />
        <span className="text-sm">Dark</span>
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors ${
          theme === 'system'
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border hover:bg-muted'
        }`}
      >
        <Monitor className="h-4 w-4" />
        <span className="text-sm">System</span>
      </button>
    </div>
  )
}

function DensitySelector() {
  const { settings, updateSetting } = useSettings()
  const density = settings.contentDensity

  return (
    <div className="flex gap-2">
      <button
        onClick={() => updateSetting('contentDensity', 'compact')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors ${
          density === 'compact'
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border hover:bg-muted'
        }`}
      >
        <AlignJustify className="h-4 w-4" />
        <span className="text-sm">Compact</span>
      </button>
      <button
        onClick={() => updateSetting('contentDensity', 'comfortable')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors ${
          density === 'comfortable'
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border hover:bg-muted'
        }`}
      >
        <StretchHorizontal className="h-4 w-4" />
        <span className="text-sm">Comfortable</span>
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const { resolvedTheme } = useTheme()
  const { settings, updateSetting, resetSettings } = useSettings()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Customize your experience
            </p>
          </div>
          <button
            onClick={resetSettings}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            title="Reset all settings to defaults"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Appearance */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Appearance
        </h2>
        <div className="pl-7">
          <div className="py-4 border-b border-border">
            <div className="flex items-start gap-3 mb-3">
              <Monitor className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
              </div>
            </div>
            <div className="ml-8">
              <ThemeSelector />
              <p className="text-xs text-muted-foreground mt-2">
                Currently using: {resolvedTheme} mode
              </p>
            </div>
          </div>
          <SettingItem
            icon={Eye}
            title="Reduce motion"
            description="Minimize animations throughout the interface"
            control={
              <Toggle
                checked={settings.reduceMotion}
                onChange={(checked) => updateSetting('reduceMotion', checked)}
              />
            }
          />
          <div className="py-4 border-b border-border last:border-0">
            <div className="flex items-start gap-3 mb-3">
              <StretchHorizontal className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Content density</p>
                <p className="text-sm text-muted-foreground">Adjust spacing between posts</p>
              </div>
            </div>
            <div className="ml-8">
              <DensitySelector />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Content
        </h2>
        <div className="pl-7">
          <SettingItem
            icon={Globe}
            title="Default region filter"
            description="Show posts from specific regions by default"
            control={
              <select
                value={settings.defaultRegion}
                onChange={(e) => updateSetting('defaultRegion', e.target.value)}
                className="px-3 py-1.5 rounded-md border border-border bg-background text-sm"
              >
                <option value="all">All Regions</option>
                <option value="north-america">North America</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
                <option value="africa">Africa</option>
                <option value="middle-east">Middle East</option>
                <option value="south-america">South America</option>
              </select>
            }
          />
          <SettingItem
            icon={Eye}
            title="Show historical context by default"
            description="Automatically expand the context section on posts"
            control={
              <Toggle
                checked={settings.showContextByDefault}
                onChange={(checked) => updateSetting('showContextByDefault', checked)}
              />
            }
          />
          <SettingItem
            icon={Eye}
            title="Show accuracy badges"
            description="Display verification level on each post"
            control={
              <Toggle
                checked={settings.showAccuracyBadges}
                onChange={(checked) => updateSetting('showAccuracyBadges', checked)}
              />
            }
          />
        </div>
      </div>

      {/* Notifications */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifications
        </h2>
        <div className="pl-7">
          <SettingItem
            icon={Bell}
            title="Daily digest"
            description="Receive a daily summary of historical events"
            control={
              <Toggle
                checked={settings.dailyDigest}
                onChange={(checked) => updateSetting('dailyDigest', checked)}
              />
            }
          />
          <SettingItem
            icon={Bell}
            title="New era alerts"
            description="Get notified when new historical eras are added"
            control={
              <Toggle
                checked={settings.newEraAlerts}
                onChange={(checked) => updateSetting('newEraAlerts', checked)}
              />
            }
          />
        </div>
      </div>

      {/* Info Note */}
      <div className="p-4">
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-1">Settings Persistence</h3>
          <p className="text-sm text-muted-foreground">
            All your settings are automatically saved to your browser's local storage and will persist across sessions.
          </p>
        </div>
      </div>

      {/* Version Info */}
      <div className="p-4 text-center text-sm text-muted-foreground">
        <p>Tempus v0.1.0</p>
        <p className="mt-1">Made with care for history lovers</p>
      </div>
    </div>
  )
}
