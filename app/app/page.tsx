import { currentUser } from '@clerk/nextjs/server'
import App from './app'
import { getUserByClerkId } from '@/db/user'
import { redirect } from 'next/navigation'

export default async function AppPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await currentUser()

  if (!user) {
    return redirect('/')
  }

  const supabaseUser = await getUserByClerkId(user?.id)

  if (!supabaseUser) {
    return redirect('/')
  }

  const search = await searchParams

  return (
    <App newCustomer={search?.newCustomer === 'true'} user={supabaseUser} />
  )
}
