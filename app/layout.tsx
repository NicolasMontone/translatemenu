import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Geist } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={geist.variable} suppressHydrationWarning>
        <body className="bg-background text-foreground font-sans">
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
            <ThemeSwitcher />
          </ThemeProvider>
        </body>
      </html>
      <SpeedInsights />
      <Analytics />
    </ClerkProvider>
  )
}
