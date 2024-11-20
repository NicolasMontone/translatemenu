'use client'
import MenuRecommender from '@/components/menu-recommender'

import Preferences from '@/components/preferences'
import { useAppContext } from '@/state'
import { useState } from 'react'

export default function App() {
  const [changingPreferences, setChangingPreferences] = useState(false)
  const { preferences } = useAppContext()

  return (
    <div className="w-full min-h-screen dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center">
      {preferences && !changingPreferences ? (
        <MenuRecommender
          onChangePreferences={() => setChangingPreferences(true)}
        />
      ) : (
        <Preferences
          onSuccess={() => setChangingPreferences(false)}
          initialPreferences={preferences}
        />
      )}
    </div>
  )
}
