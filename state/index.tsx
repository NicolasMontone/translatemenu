'use client'

import { createContext, useContext, useState } from 'react'
import type { Preferences } from '@/schemas/preferences'

type AppContext = {
  preferences: Preferences | null
  setPreferences: (preferences: Preferences) => void
}

export const AppContext = createContext<AppContext>({
  preferences: null,
  setPreferences: () => {},
})

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}

export const AppProvider = ({
  children,
  initialPreferences,
}: {
  children: React.ReactNode
  initialPreferences: Preferences | null
}) => {
  const [preferences, setPreferences] = useState<Preferences | null>(
    initialPreferences
  )

  return (
    <AppContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </AppContext.Provider>
  )
}
