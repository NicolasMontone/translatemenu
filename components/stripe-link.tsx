import { useClerk } from '@clerk/nextjs'
import Link from 'next/link'

export const useStripeLink = () => {
  const { user } = useClerk()

  return `https://buy.stripe.com/8wM6oF5wX9ht37yeUY?prefilled_email=${
    user?.emailAddresses?.[0]?.emailAddress || ''
  }`
}

export default function StripeLink({
  children,
}: {
  children: React.ReactNode
}) {
  const link = useStripeLink()

  return (
    <Link href={link} prefetch={true}>
      {children}
    </Link>
  )
}
