import 'server-only'
import type { Preferences } from '@/schemas/preferences'
import { supabase } from './supabase'

export async function getPreferencesByClerkId(
  userId: string
): Promise<Preferences | undefined> {
  const { data, error } = await supabase
    .from('users')
    .select('preferences')
    .eq('clerk_user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching preferences:', error)
    return undefined
  }

  return data?.preferences as Preferences | undefined
}

export async function savePreferencesByClerkId(
  userId: string,
  preferences: Preferences
) {
  const { error } = await supabase
    .from('users')
    .update({ preferences })
    .eq('clerk_user_id', userId)

  if (error) {
    console.error('Error saving preferences:', error)
    throw error
  }
}
