import { supabase } from './supabase'

export async function getUserByClerkId(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching user:', error)
    return undefined
  }

  return data
}
