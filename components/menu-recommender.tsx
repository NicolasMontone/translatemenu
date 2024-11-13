'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Loader2, X, Upload } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert } from './ui/alert'
import { SignOutButton, UserButton } from '@clerk/nextjs'
import { menuSchema } from '@/schemas/menu'
import type { z } from 'zod'

type MenuData = z.infer<typeof menuSchema>

export default function MenuRecommender() {
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)

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
    <div className="container">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <UserButton />
            <SignOutButton>
              <Button variant="outline">Logout</Button>
            </SignOutButton>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-500">
              <Alert variant="destructive">
                There was an error analyzing your menu, if the problem persists
                please contact support.
              </Alert>
            </div>
          )}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Camera className="mr-2 h-4 w-4" /> Capture Menu
              </Button>
              <Button
                onClick={() => uploadInputRef.current?.click()}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Photo
              </Button>
            </div>
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
            {capturedImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {capturedImages.map((image, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Captured menu ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
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
            )}
            <Button
              onClick={handleAnalyze}
              className="w-full"
              disabled={isLoading || capturedImages.length === 0}
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
        </CardContent>
      </Card>

      {menuData?.isMenu === true ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Top Recommended Dishes</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <ul className="space-y-2">
                  {menuData.topDishes.map((dish, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <li key={index} className="border-b pb-2 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{dish.name}</h3>
                        <span className="font-bold">${dish.price ?? '-'}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {dish.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <ul className="space-y-4">
                  {menuData.menuItems.map((item, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <li key={index} className="border-b pb-4 last:border-b-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className="flex items-center space-x-2">
                          {isRecommended(item.name) && (
                            <Badge variant="secondary">Recommended</Badge>
                          )}
                          <span className="font-bold">
                            ${item.price ?? '-'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </>
      ) : menuData?.isMenu === false ? (
        <Card>
          <CardHeader>
            <CardTitle>No menu found</CardTitle>
          </CardHeader>
        </Card>
      ) : null}
    </div>
  )
}
