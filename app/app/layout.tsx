import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/nextjs'

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
    <html
      lang="en"
      className={`min-h-screen bg-background font-sans antialiased ${geist.className}`}
    >
      <body>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
        <SignedIn>{children}</SignedIn>
      </body>
    </html>
  )
}
