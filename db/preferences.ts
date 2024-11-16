import { sql } from '@vercel/postgres'
import 'server-only'
import type { Preferences } from '@/schemas/preferences'

export async function getPreferences(userId: string) {
  const preferences = await sql<{
    preferences: Preferences
  }>`SELECT preferences FROM users WHERE clerk_user_id = ${userId}`
  return preferences.rows[0].preferences
}

export async function savePreferences(
  userId: string,
  preferences: Preferences
) {
  await sql`UPDATE users SET preferences = ${JSON.stringify(
    preferences
  )} WHERE clerk_user_id = ${userId}`
}
