import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { Link } from 'lucide-react'

import { Button } from '../components/ui/button'

export default function Home() {
  return (
    <div>
      <SignedIn>
        <Link href="/app">
          <Button>Go to app</Button>
        </Link>
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
    </div>
  )
}
