'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { X, Download, RefreshCw } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface ServiceWorkerContextType {
  isInstallable: boolean
  isInstalled: boolean
  isOffline: boolean
  hasUpdate: boolean
  promptInstall: () => Promise<void>
  updateServiceWorker: () => void
}

const ServiceWorkerContext = createContext<ServiceWorkerContextType>({
  isInstallable: false,
  isInstalled: false,
  isOffline: false,
  hasUpdate: false,
  promptInstall: async () => {},
  updateServiceWorker: () => {},
})

export function useServiceWorker() {
  return useContext(ServiceWorkerContext)
}

export function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [hasUpdate, setHasUpdate] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [showUpdateBanner, setShowUpdateBanner] = useState(false)

  // Register service worker
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    // Check if already installed as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    setIsInstalled(isStandalone)

    // Register service worker
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[PWA] Service worker registered')
        setRegistration(reg)

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] New version available')
                setHasUpdate(true)
                setShowUpdateBanner(true)
              }
            })
          }
        })
      })
      .catch((err) => {
        console.error('[PWA] Service worker registration failed:', err)
      })

    // Listen for controller change (after update)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload()
    })
  }, [])

  // Handle install prompt
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)

      // Show install banner after 30 seconds if not dismissed
      const dismissed = localStorage.getItem('tempus-install-dismissed')
      if (!dismissed) {
        setTimeout(() => {
          setShowInstallBanner(true)
        }, 30000)
      }
    }

    const handleAppInstalled = () => {
      console.log('[PWA] App installed')
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
      setShowInstallBanner(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Handle online/offline status
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    setIsOffline(!navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('[PWA] User accepted install prompt')
    } else {
      console.log('[PWA] User dismissed install prompt')
      localStorage.setItem('tempus-install-dismissed', 'true')
    }

    setDeferredPrompt(null)
    setIsInstallable(false)
    setShowInstallBanner(false)
  }, [deferredPrompt])

  const updateServiceWorker = useCallback(() => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }, [registration])

  const dismissInstallBanner = () => {
    setShowInstallBanner(false)
    localStorage.setItem('tempus-install-dismissed', 'true')
  }

  const dismissUpdateBanner = () => {
    setShowUpdateBanner(false)
  }

  return (
    <ServiceWorkerContext.Provider
      value={{
        isInstallable,
        isInstalled,
        isOffline,
        hasUpdate,
        promptInstall,
        updateServiceWorker,
      }}
    >
      {children}

      {/* Offline indicator */}
      {isOffline && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 bg-yellow-500 text-yellow-950 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <div className="w-2 h-2 bg-yellow-950 rounded-full animate-pulse" />
          <span className="text-sm font-medium">You're offline. Some content may be unavailable.</span>
        </div>
      )}

      {/* Install banner */}
      {showInstallBanner && !isInstalled && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 bg-primary text-primary-foreground px-4 py-4 rounded-lg shadow-lg">
          <button
            onClick={dismissInstallBanner}
            className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Download className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Install Tempus</h3>
              <p className="text-sm opacity-90 mt-1">
                Add Tempus to your home screen for a better experience and offline access.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={promptInstall}
                  className="px-4 py-2 bg-white text-primary font-medium rounded-md text-sm hover:bg-white/90 transition-colors"
                >
                  Install
                </button>
                <button
                  onClick={dismissInstallBanner}
                  className="px-4 py-2 text-sm hover:bg-white/20 rounded-md transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update banner */}
      {showUpdateBanner && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 bg-green-600 text-white px-4 py-4 rounded-lg shadow-lg">
          <button
            onClick={dismissUpdateBanner}
            className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Update Available</h3>
              <p className="text-sm opacity-90 mt-1">
                A new version of Tempus is available with improvements.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={updateServiceWorker}
                  className="px-4 py-2 bg-white text-green-600 font-medium rounded-md text-sm hover:bg-white/90 transition-colors"
                >
                  Update now
                </button>
                <button
                  onClick={dismissUpdateBanner}
                  className="px-4 py-2 text-sm hover:bg-white/20 rounded-md transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ServiceWorkerContext.Provider>
  )
}
