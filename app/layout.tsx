import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Geist } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { Analytics } from '@vercel/analytics/next';

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
      <html lang="en" className={geist.className} suppressHydrationWarning>
        <body className="bg-background text-foreground">
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
            <ThemeSwitcher />
          </ThemeProvider>
        </body>
      </html>
      <Analytics />
    </ClerkProvider>
  )
}
