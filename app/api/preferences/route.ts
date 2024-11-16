import { currentUser } from '@clerk/nextjs/server'
import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { preferencesSchema } from '@/schemas/preferences'

export async function POST(request: Request) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedPreferences = preferencesSchema.safeParse(body)

    if (!validatedPreferences.success) {
      console.error(validatedPreferences.error.issues)
      return NextResponse.json(
        { error: 'Invalid preferences data' },
        { status: 400 }
      )
    }

    await sql`UPDATE users SET preferences = ${JSON.stringify(
      validatedPreferences.data
    )} WHERE clerk_user_id = ${user.id}`

    const preferences =
      await sql`SELECT preferences FROM users WHERE clerk_user_id = ${user.id}`

    return NextResponse.json(
      { preferences: preferences.rows[0].preferences },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error saving preferences:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
