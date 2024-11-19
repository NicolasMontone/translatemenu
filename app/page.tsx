import { Camera, Globe, Star, Utensils } from 'lucide-react'
import { default as NextLink } from 'next/link'

import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Suspense } from 'react'

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen max-w-[900px] mx-auto">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <NextLink className="flex items-center justify-center" href="/">
          <Utensils className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">Translate Menu</span>
        </NextLink>
        <nav>
          <NextLink href="/app">
            <Button>Start Now</Button>
          </NextLink>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Discover Any Menu, Anywhere
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Snap a photo, get instant translations, and personalized dish
                  recommendations.
                </p>
              </div>

              <Suspense fallback={<Button>Try It Now</Button>}>
                <NextLink href="/app">
                  <Button size="lg" className="w-full max-w-[350px]">
                    Try It Now
                  </Button>
                </NextLink>
              </Suspense>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Camera className="h-10 w-10 mb-2" />
                  <CardTitle>Instant Menu Translation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Take a photo of any menu and get an instant translation in
                    your preferred language.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Star className="h-10 w-10 mb-2" />
                  <CardTitle>Personalized Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Get dish recommendations based on your preferences and
                    dietary restrictions.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Globe className="h-10 w-10 mb-2" />
                  <CardTitle>Multi-language Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Supports over 50 languages, making it perfect for travelers
                    and food enthusiasts.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <div className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-full">
                  <Camera className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">1. Upload a Photo</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Upload a clear photo of the menu through our web interface.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <div className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-full">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">2. Get Translation</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Our AI instantly translates the menu to your language.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <div className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-full">
                  <Utensils className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">3. Explore Dishes</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Get personalized recommendations and explore with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-3">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Get Started with Translate Menu Today
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Start exploring menus around the world with confidence. No
                  download required, just open in your browser.
                </p>
              </div>

              <Suspense fallback={<Button>Try Translate Menu Now</Button>}>
                <NextLink href="/app">
                  <Button className="w-full max-w-[350px]" size="lg">
                    Try Translate Menu Now
                  </Button>
                </NextLink>
              </Suspense>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t mt-10">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Translate Menu. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
