'use client'
import MenuRecommender from '@/components/menu-recommender'

import Preferences from '@/components/preferences'
import { useAppContext } from '@/state'
import { useState } from 'react'
import { useWindowSize } from 'usehooks-ts'
import type { User } from '@/db/database.types'
import Confetti from 'react-confetti'

export default function App({
  newCustomer,
  user,
}: {
  newCustomer: boolean
  user: User
}) {
  const [changingPreferences, setChangingPreferences] = useState(false)
  const { preferences } = useAppContext()

  const { width, height } = useWindowSize()

  return (
    <div className="w-full min-h-screen dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
      {newCustomer && (
        <Confetti
          recycle={false}
          numberOfPieces={300}
          width={width}
          height={height}
        />
      )}
      {preferences && !changingPreferences ? (
        <MenuRecommender
          newCustomer={newCustomer}
          user={user}
          onChangePreferences={() => setChangingPreferences(true)}
        />
      ) : (
        <Preferences
          onSuccess={() => setChangingPreferences(false)}
          initialPreferences={preferences}
          user={user}
        />
      )}
    </div>
  )
}
