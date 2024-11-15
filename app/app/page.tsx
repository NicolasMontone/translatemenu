'use client'
import MenuRecommender from '@/components/menu-recommender'

import Preferences from '@/components/preferences'
import { useAppContext } from '@/state'

export default function AppPage() {
  const { preferences } = useAppContext()

  return (
    <div className="pt-4 max-w-[700px] mx-auto">
      {preferences ? (
        <MenuRecommender />
      ) : (
        <Preferences initialPreferences={preferences} />
      )}
    </div>
  )
}
