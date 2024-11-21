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

export async function createUser(userId: string, email: string) {
  const { data, error } = await supabase
    .from('users')
    .insert({ clerk_user_id: userId, email, is_pro: false })
    .select()
    .single()

  if (error) {
    console.error('Error creating user:', error)
    return undefined
  }

  return data
}
