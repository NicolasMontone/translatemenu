'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Camera, ImagePlus, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface UploadZoneProps {
  images: string[]
  onAddImages: (newImages: string[]) => void
  onRemoveImage: (index: number) => void
  className?: string
}

export function UploadZone({
  images,
  onAddImages,
  onRemoveImage,
  className,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = acceptedFiles.map((file) => URL.createObjectURL(file))
      onAddImages(newImages)
    },
    [onAddImages]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: true,
  })

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all',
        isDragging && 'ring-2 ring-primary',
        className
      )}
    >
      <CardContent className="p-0">
        {images.length === 0 ? (
          <div
            {...getRootProps()}
            className={cn(
              'flex flex-col items-center justify-center gap-4 p-8 text-center transition-colors',
              isDragActive && 'bg-muted'
            )}
          >
            <div className="rounded-full bg-muted p-6">
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Upload Menu Photos</h3>
              <p className="text-sm text-muted-foreground">
                Drag and drop your photos here, or click to select
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="mt-2">
                <Camera className="mr-2 h-4 w-4" />
                Take Photo
              </Button>
              <Button size="sm" variant="outline" className="mt-2">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
            <input {...getInputProps()} />
          </div>
        ) : (
          <div className="space-y-4 p-4">
            <ScrollArea className="h-[300px] rounded-lg border bg-muted/50 p-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {images.map((image, index) => (
                  <div
                    key={`${image}-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: is on purpose
                      index
                    }`}
                    className="group relative aspect-square overflow-hidden rounded-lg border bg-background"
                  >
                    <img
                      src={image}
                      alt={`Menu ${index + 1}`}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute right-2 top-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => onRemoveImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div
                  {...getRootProps()}
                  className={cn(
                    'flex aspect-square items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:bg-muted',
                    isDragActive && 'border-primary bg-muted'
                  )}
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Add more photos
                    </span>
                  </div>
                  <input {...getInputProps()} />
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
