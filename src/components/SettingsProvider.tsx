'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export interface AppSettings {
  // Appearance
  reduceMotion: boolean

  // Content
  defaultRegion: string
  showContextByDefault: boolean
  showAccuracyBadges: boolean
  contentDensity: 'compact' | 'comfortable'

  // Notifications
  dailyDigest: boolean
  newEraAlerts: boolean
}

const defaultSettings: AppSettings = {
  reduceMotion: false,
  defaultRegion: 'all',
  showContextByDefault: false,
  showAccuracyBadges: true,
  contentDensity: 'comfortable',
  dailyDigest: true,
  newEraAlerts: true,
}

interface SettingsContextType {
  settings: AppSettings
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
  resetSettings: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('tempus-settings')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Merge with defaults to handle new settings added later
        setSettings({ ...defaultSettings, ...parsed })
      } catch {
        setSettings(defaultSettings)
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('tempus-settings', JSON.stringify(settings))

      // Apply reduce motion setting to document
      if (settings.reduceMotion) {
        document.documentElement.classList.add('reduce-motion')
      } else {
        document.documentElement.classList.remove('reduce-motion')
      }

      // Apply content density setting
      if (settings.contentDensity === 'compact') {
        document.documentElement.classList.add('compact-mode')
      } else {
        document.documentElement.classList.remove('compact-mode')
      }
    }
  }, [settings, mounted])

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings)
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}
