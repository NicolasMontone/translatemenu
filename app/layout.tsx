import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Geist } from 'next/font/google'

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
      <html
        lang="en"
        className={`min-h-screen bg-background font-sans antialiased ${geist.className}`}
      >
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
