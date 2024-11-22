'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  ChevronRight,
  Settings,
  ImagePlus,
  ArrowLeft,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Alert } from '@/components/ui/alert'
import { SignOutButton } from '@clerk/nextjs'
import type { Menu } from '@/schemas/menu'
import { UploadZone } from './upload-zone'
import { Card, CardContent } from './ui/card'

const DishImage = ({ src, alt }: { src: string | null; alt: string }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: is on purpose
  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout | undefined

    const pollImage = async (attemptCount: number) => {
      if (!mounted || !src) return

      try {
        const response = await fetch(`/api/image/${src}`)

        if (!mounted) return

        if (response.status === 404) {
          if (attemptCount >= 30) {
            // 2 minutes maximum (30 * 4 seconds)
            setError(true)
            setIsLoading(false)
            return
          }
          // First poll after 4 seconds, then continue polling every 4 seconds
          timeoutId = setTimeout(() => pollImage(attemptCount + 1), 4000)
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch image')
        }

        const blob = await response.blob()
        if (!mounted) return

        const url = URL.createObjectURL(blob)
        setImageUrl(url)
        setIsLoading(false)
      } catch (err) {
        if (!mounted) return

        if (attemptCount >= 30) {
          setError(true)
          setIsLoading(false)
          return
        }
        // First poll after 4 seconds, then continue polling every 4 seconds
        timeoutId = setTimeout(() => pollImage(attemptCount + 1), 4000)
      }
    }

    if (src) {
      // Start first poll after 4 seconds
      timeoutId = setTimeout(() => pollImage(0), 4000)
    } else {
      setIsLoading(false)
    }

    // Cleanup function
    return () => {
      mounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl)
      }
    }
  }, [src]) // Only src as dependency

  return (
    <div className="w-full h-full relative bg-muted z-0">
      {src && !error ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {imageUrl && (
            <img
              src={imageUrl}
              alt={alt}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
              style={{ opacity: isLoading ? 0 : 1 }}
              onLoad={() => setIsLoading(false)}
              onError={() => setError(true)}
            />
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImagePlus className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}

const MenuItemCard = ({ item }: { item: Menu['menuItems'][0] }) => (
  <Card className="flex h-full flex-col overflow-hidden">
    <div className="relative aspect-video">
      {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
      <DishImage src={(item as any).image ?? null} alt={item.name} />
      {item.recommended && (
        <Badge variant="default" className="absolute left-2 top-2">
          Recommended
        </Badge>
      )}
    </div>
    <CardContent className="flex flex-1 flex-col gap-4 p-6">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">{item.name}</h3>
        <p className="text-sm font-medium text-muted-foreground">
          ${item.price}
        </p>
      </div>
      <p className="flex-1 text-sm text-muted-foreground">{item.description}</p>
    </CardContent>
  </Card>
)

export default function MenuAnalyzer({
  onChangePreferences,
}: {
  onChangePreferences?: () => void
}) {
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [menuData, setMenuData] = useState<Menu | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768
    }
    return false
  })
  const [showMobileAnalysis, setShowMobileAnalysis] = useState(false)

  const handleAddImages = (newImages: string[]) => {
    setCapturedImages((prev) => [...prev, ...newImages])
  }

  const handleRemoveImage = (index: number) => {
    setCapturedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAnalyze = async () => {
    if (capturedImages.length === 0) return

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      for (let i = 0; i < capturedImages.length; i++) {
        const blob = await fetch(capturedImages[i]).then((r) => r.blob())
        formData.append('images', blob, `menu${i}.jpg`)
      }

      const response = await fetch('/api/analyze-menu', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze menu')
      }

      const result = await response.json()

      if (!result.isMenu) {
        setError(
          "This image doesn't appear to be a menu. Try taking a clearer photo or getting closer to the menu."
        )
        return
      }

      setMenuData(result)

      if (isMobile) {
        setShowMobileAnalysis(true)
      }
    } catch (err) {
      setError('Failed to analyze menu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <header className="border-b p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onChangePreferences}>
            <Settings className="mr-2 h-5 w-5" />
            <span>Preferences</span>
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          <SignOutButton>
            <Button variant="outline">Logout</Button>
          </SignOutButton>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-7xl">
          {menuData && (isMobile ? showMobileAnalysis : true) ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    Menu ({menuData.menuItems.length})
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Explore our delicious dishes
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowMobileAnalysis(false)
                    setMenuData(null)
                  }}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  New Scan
                </Button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {menuData.menuItems
                  .sort((a, b) => {
                    // Sort recommended items first
                    if (a.recommended && !b.recommended) return -1
                    if (!a.recommended && b.recommended) return 1
                    return 0
                  })
                  .map((item, index) => (
                    <MenuItemCard key={`${item.name}-${index}`} item={item} />
                  ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <UploadZone
                images={capturedImages}
                onAddImages={handleAddImages}
                onRemoveImage={handleRemoveImage}
              />
              {capturedImages.length > 0 && (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Menu...
                    </>
                  ) : (
                    'Analyze Menu'
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {error && (
        <Alert
          variant="destructive"
          className="fixed bottom-4 right-4 max-w-md"
        >
          {error}
        </Alert>
      )}
    </div>
  )
}
