import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Camera, Globe, Star, Play } from 'lucide-react'
import type { Metadata } from 'next'
import BeforeAfter from '@/components/before-after'

export const metadata: Metadata = {
  title: 'Translate Menu',
  description:
    'Translate Menu lets diners view translated menus with AI-generated dish images.',
  icons: {
    icon: '/icon.svg',
  },
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="max-w-[1340px] w-full mx-auto px-4">
        <div className="h-14 flex items-center justify-between">
          <Link className="flex items-center" href="/">
            <Image
              src="/icon.svg"
              alt="Translate Menu"
              width={24}
              height={24}
            />
            <span className="ml-2 text-lg font-bold">Translate Menu</span>
          </Link>
          <nav>
            <Link href="/app">
              <Button>Start Now</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <div className="max-w-[1340px] mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-1">
                <div className="w-6 h-3 bg-blue-500 rounded-full" />
                <span>Instant Menu Translation</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                Translate Any Menu, From Anywhere
              </h1>

              <p className="text-xl text-gray-500 dark:text-gray-400">
                Snap a photo, get instant translations, and personalized dish
                recommendations.
              </p>

              <div className="flex items-center gap-4">
                <Link href="/app">
                  <Button size="lg">Try It Now</Button>
                </Link>
              </div>
            </div>

            {/* Right Column */}
            <div className="relative">
              <AspectRatio
                ratio={9 / 16}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="h-16 w-16 text-gray-400" />
                  <span className="sr-only">
                    Watch Translate Menu in Action
                  </span>
                </div>
              </AspectRatio>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  See Translate Menu in Action
                </p>
              </div>
            </div>
          </div>

          <div className="mt-24">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border border-gray-200 dark:border-gray-700 p-6 rounded-lg">
                <Camera className="h-10 w-10 mb-2" />
                <h3 className="text-xl font-bold">Instant Menu Translation</h3>
                <p className="text-center text-gray-500">
                  Take a photo of any menu and get an instant translation in
                  your preferred language.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-gray-200 dark:border-gray-700 p-6 rounded-lg">
                <Star className="h-10 w-10 mb-2" />
                <h3 className="text-xl font-bold">
                  Personalized Recommendations
                </h3>
                <p className="text-center text-gray-500">
                  Get dish recommendations based on your preferences and dietary
                  restrictions.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-gray-200 dark:border-gray-700 p-6 rounded-lg">
                <Globe className="h-10 w-10 mb-2" />
                <h3 className="text-xl font-bold">Multi-language Support</h3>
                <p className="text-center text-gray-500">
                  Supports over 50 languages, making it perfect for travelers
                  and food enthusiasts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-[1340px] mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
            How It Works
          </h2>
          <BeforeAfter />
        </div>
      </main>

      <footer className="border-t">
        <div className="max-w-[1340px] mx-auto px-4 py-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 Translate Menu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
