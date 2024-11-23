import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Funnel_Sans } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const funnelSans = Funnel_Sans({
  subsets: ['latin'],
  variable: '--font-funnel-sans',
  weight: ['400', '700'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={funnelSans.className} suppressHydrationWarning>
        <body className="bg-background text-foreground font-funnel-sans">
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
