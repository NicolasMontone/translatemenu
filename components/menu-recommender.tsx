'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Camera,
  Loader2,
  X,
  Upload,
  ChevronRight,
  Settings,
  ImagePlus,
  ArrowLeft,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert } from '@/components/ui/alert'
import { SignOutButton } from '@clerk/nextjs'
import { menuSchema, type Menu } from '@/schemas/menu'

// Add this new component for image loading
const DishImage = ({ src, alt }: { src: string | null; alt: string }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <div className="w-full h-full relative bg-muted z-0">
      {src && !error ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: isLoading ? 0 : 1 }}
            onLoad={() => setIsLoading(false)}
            onError={() => setError(true)}
          />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImagePlus className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}

// Update the MenuItemCard component
const MenuItemCard = ({ item }: { item: Menu['menuItems'][0] }) => (
  <div className="bg-card rounded-lg overflow-hidden border flex">
    <div className="w-24 h-24 relative bg-muted shrink-0">
      {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
      <DishImage src={(item as any).image ?? null} alt={item.name} />
    </div>
    <div className="p-3 flex-1 min-w-0">
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold leading-tight truncate">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
        <span className="font-bold whitespace-nowrap shrink-0">
          ${item.price}
        </span>
      </div>
      {item.recommended && (
        <Badge variant="secondary" className="mt-2">
          Recommended
        </Badge>
      )}
    </div>
  </div>
)

export default function Component({
  onChangePreferences,
}: {
  onChangePreferences?: () => void
}) {
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [menuData, setMenuData] = useState<Menu | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileAnalysis, setShowMobileAnalysis] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      )
      setCapturedImages((prev) => [...prev, ...newImages])
    }
  }

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      )
      setCapturedImages((prev) => [...prev, ...newImages])
    }
  }

  const handleRemoveImage = (index: number) => {
    setCapturedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAnalyze = async () => {
    if (capturedImages.length > 0) {
      setIsLoading(true)
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

        setMenuData(result)
        if (isMobile) {
          setShowMobileAnalysis(true)
        }
      } catch (error) {
        setError('Failed to analyze menu')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleNewAnalysis = () => {
    setShowMobileAnalysis(false)
    setMenuData(null)
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      uploadInputRef.current?.click()
    }
  }

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Header */}
      <header className="border-b p-4">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={onChangePreferences}>
            <Settings className="h-5 w-5 mr-2" />
            <span>Preferences</span>
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
          <SignOutButton>
            <Button variant="outline">Logout</Button>
          </SignOutButton>
        </div>
      </header>

      <main className="flex-grow overflow-auto">
        <div className="container mx-auto p-4 h-full">
          {/* Mobile View */}
          <div className="md:hidden">
            {menuData && showMobileAnalysis ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between sticky top-0 bg-background pt-2 pb-3 -mx-4 px-4 border-b">
                  <div>
                    <h2 className="text-xl font-bold">
                      Menu ({menuData.menuItems.length})
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Scroll to explore dishes
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNewAnalysis}
                    className="shrink-0"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    New Scan
                  </Button>
                </div>

                <div className="space-y-3 pb-16">
                  {menuData.menuItems.map((item, index) => (
                    <MenuItemCard key={`${item.name}-${index}`} item={item} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <Card className="flex-grow">
                  <CardContent className="flex flex-col items-center justify-center h-full p-6">
                    {capturedImages.length === 0 ? (
                      <div
                        // biome-ignore lint/a11y/useSemanticElements: <explanation>
                        role="button"
                        tabIndex={0}
                        className="flex flex-col items-center justify-center gap-4 text-center"
                        onClick={() => uploadInputRef.current?.click()}
                        onKeyDown={handleKeyPress}
                      >
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                          <ImagePlus className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold mb-1">
                            Scan Menu
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Take a photo or choose from gallery
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full space-y-4">
                        <ScrollArea className="h-[300px]">
                          <div className="grid grid-cols-2 gap-2">
                            {capturedImages.map((image, index) => (
                              <div
                                key={`${image}-${
                                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                  index
                                }`}
                                className="relative aspect-square"
                              >
                                <img
                                  src={image}
                                  alt={`Menu ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1"
                                  onClick={() => handleRemoveImage(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        <Button
                          onClick={handleAnalyze}
                          className="w-full"
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
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            {menuData ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    Menu - {menuData.menuItems.length} dishes detected
                  </h2>
                  <Button onClick={() => setMenuData(null)} variant="outline">
                    New Analysis
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent h-12 bottom-0 z-10" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {menuData.menuItems.map((item, index) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      <Card key={index} className="overflow-hidden">
                        <div className="aspect-square relative">
                          <DishImage
                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                            src={(item as any).image ?? null}
                            alt={item.name}
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{item.name}</h3>
                            <span className="font-bold">${item.price}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {item.description}
                          </p>
                          {item.recommended && (
                            <Badge variant="secondary">Recommended</Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Card className="w-full max-w-2xl mx-auto">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                  <div
                    // biome-ignore lint/a11y/useSemanticElements: <explanation>
                    role="button"
                    tabIndex={0}
                    className="flex flex-col items-center justify-center gap-4 cursor-pointer text-center"
                    onClick={() => uploadInputRef.current?.click()}
                  >
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                      <ImagePlus className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold">Upload Menu</h2>
                    <p className="text-sm text-muted-foreground">
                      Take a photo or upload from your gallery
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer for Mobile */}
      {isMobile && !showMobileAnalysis && !capturedImages.length && (
        <footer className="bg-background border-t p-4">
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={() => uploadInputRef.current?.click()}
            >
              <Upload className="h-6 w-6" />
            </Button>
          </div>
        </footer>
      )}

      {/* Hidden file inputs */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCapture}
        ref={fileInputRef}
        className="hidden"
        multiple
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        ref={uploadInputRef}
        className="hidden"
        multiple
      />

      {/* Error Display */}
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
