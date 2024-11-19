'use client'
import MenuRecommender from '@/components/menu-recommender'

import Preferences from '@/components/preferences'
import { useAppContext } from '@/state'
import { useState } from 'react'

export default function App() {
  const [changingPreferences, setChangingPreferences] = useState(false)
  const { preferences } = useAppContext()

  return (
    <>
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
    </>
  )
}
