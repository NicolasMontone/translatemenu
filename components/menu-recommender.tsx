'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Camera,
  Loader2,
  X,
  Upload,
  ChevronRight,
  Settings,
  ImagePlus,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert } from '@/components/ui/alert'
import { SignOutButton } from '@clerk/nextjs'
import { menuSchema, type Menu } from '@/schemas/menu'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

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
          toast({
            title: 'Failed to analyze menu',
            description: 'Please try again later',
            variant: 'destructive',
          })
        }

        const result = await response.json()
        const validatedData = menuSchema.parse(result)
        setMenuData(validatedData)
      } catch (error) {
        setError('Failed to analyze menu')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const isRecommended = (dishName: string) => {
    return menuData?.topDishes.some((dish) => dish.name === dishName) ?? false
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-background border-b p-4">
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

      {/* Main Content */}
      <main className="flex-grow overflow-auto">
        <div className="container mx-auto p-4 h-full">
          <div className={cn('grid gap-6', isMobile ? '' : 'grid-cols-2')}>
            {/* Image Upload Section */}
            <Card className="relative flex flex-col">
              <CardHeader>
                <CardTitle>Upload Menu</CardTitle>
              </CardHeader>
              <CardContent
                className={`flex-grow flex flex-col items-center ${
                  isMobile ? 'justify-center' : ''
                } p-6`}
              >
                {capturedImages.length === 0 ? (
                  // biome-ignore lint/a11y/useKeyWithClickEvents: false
                  <div
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
                ) : (
                  <div className="w-full space-y-4">
                    <ScrollArea className="h-[300px]">
                      <div className="grid grid-cols-2 gap-2">
                        {capturedImages.map((image, index) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: false
                          <div key={index} className="relative aspect-square">
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
                      className={`w-full ${!isMobile ? 'self-end' : ''}`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze Menu'
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            {menuData && (
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>
                    {menuData.isMenu ? 'Menu Analysis' : 'No Menu Found'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {menuData.isMenu ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Top Recommended Dishes
                        </h3>
                        <ScrollArea className="h-[200px]">
                          <ul className="space-y-4">
                            {menuData.topDishes.map((dish, index) => (
                              <li
                                // biome-ignore lint/suspicious/noArrayIndexKey: false
                                key={index}
                                className="border-b pb-4 last:border-b-0"
                              >
                                <div className="flex justify-between items-start">
                                  <h4 className="font-semibold">{dish.name}</h4>
                                  <span className="font-bold">
                                    ${dish.price ?? '-'}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {dish.description}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </ScrollArea>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          All Menu Items
                        </h3>
                        <ScrollArea className="h-[300px]">
                          <ul className="space-y-4">
                            {menuData.menuItems.map((item, index) => (
                              <li
                                // biome-ignore lint/suspicious/noArrayIndexKey: false
                                key={index}
                                className="border-b pb-4 last:border-b-0"
                              >
                                <div className="flex justify-between items-start">
                                  <h4 className="font-semibold">{item.name}</h4>
                                  <div className="flex items-center gap-2">
                                    {isRecommended(item.name) && (
                                      <Badge variant="secondary">
                                        Recommended
                                      </Badge>
                                    )}
                                    <span className="font-bold">
                                      ${item.price ?? '-'}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {item.description}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </ScrollArea>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      The uploaded image doesn't appear to be a menu. Please try
                      uploading a different image.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer for Mobile */}
      {isMobile && (
        <footer className="bg-background border-t p-4">
          <div className="flex justify-center">
            <Button
              size="lg"
              className="rounded-full w-16 h-16"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-6 w-6" />
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
