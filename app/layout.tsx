import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import './globals.css'
import { Geist } from 'next/font/google'
import MenuRecommender from '../components/menu-recommender'

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
        <body>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
            <MenuRecommender />
          </SignedIn>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
