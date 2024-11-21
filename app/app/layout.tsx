import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignOutButton,
} from '@clerk/nextjs'
import { Toaster } from '@/components/ui/toaster'
import { AppProvider } from '@/state'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getPreferencesByClerkId } from '@/db/preferences'
import { Button } from '@/components/ui/button'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  if (!user) {
    redirect('/')
  }

  const preferences = await getPreferencesByClerkId(user.id)

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <AppProvider initialPreferences={preferences ?? null}>
          {children}
        </AppProvider>
      </SignedIn>
      <Toaster />
    </>
  )
}
