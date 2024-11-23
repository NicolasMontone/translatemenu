'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import type { Preferences as PreferencesData } from '@/schemas/preferences'
import { useAppContext } from '@/state'
import { ChevronLeft } from 'lucide-react'
import { SignOutButton } from '@clerk/nextjs'

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Argentina',
  'Germany',
  'France',
  'Japan',
  'India',
  'Brazil',
  'Mexico',
  'Other',
]
const languages = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Japanese',
  'Chinese',
  'Hindi',
  'Arabic',
  'Portuguese',
  'Other',
]

const preferences = {
  dietaryRestrictions: ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free'],
  allergies: ['Nut-free', 'Shellfish-free', 'Lactose intolerant'],
  healthPreferences: ['Low-calorie', 'Low-carb', 'High-protein', 'Low-sodium'],
  cuisinePreferences: [
    'Spicy food',
    'Mild dishes',
    'Seafood',
    'Meat lover',
    'Prefer soups or salads',
  ],
  otherPreferences: [
    'Organic ingredients',
    'Locally sourced',
    'Quick bites',
    'Kid-friendly options',
  ],
}

const savePreferences = async (
  preferences: PreferencesData
): Promise<{ preferences: PreferencesData } | { error: string }> => {
  const response = await fetch('/api/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences),
  })

  const data = await response.json()
  return data
}

type PreferencesProps = {
  initialPreferences: PreferencesData | null
  onSuccess?: () => void
}

export default function Preferences({
  initialPreferences,
  onSuccess,
}: PreferencesProps) {
  const { setPreferences } = useAppContext()
  const [country, setCountry] = useState(initialPreferences?.country ?? '')
  const [otherCountry, setOtherCountry] = useState('')
  const [language, setLanguage] = useState(initialPreferences?.language ?? '')
  const [selectedPreferences, setSelectedPreferences] = useState<
    Record<string, Record<string, boolean>>
  >(initialPreferences?.selectedPreferences ?? {})
  const [additionalInfo, setAdditionalInfo] = useState(
    initialPreferences?.additionalInfo ?? ''
  )
  const [otherLanguage, setOtherLanguage] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    if (
      initialPreferences?.country &&
      !countries.includes(initialPreferences.country)
    ) {
      setCountry('Other')
      setOtherCountry(initialPreferences.country)
    }
  }, [initialPreferences?.country])

  const handleCountryChange = (value: string) => {
    setCountry(value)
    if (value !== 'Other') {
      setOtherCountry('')
    }
  }

  const handleOtherCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherCountry(e.target.value.slice(0, 45))
  }

  const handlePreferenceChange = (category: string, item: string) => {
    setSelectedPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: !prev[category]?.[item],
      },
    }))
  }

  const handleOtherLanguageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setOtherLanguage(e.target.value.slice(0, 45))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (!country || !language) {
        toast({
          title: 'Error',
          description: 'Please select a country and language.',
          variant: 'destructive',
        })
        return
      }

      if (country === 'Other' && !otherCountry.trim()) {
        toast({
          title: 'Error',
          description: 'Please specify your country.',
          variant: 'destructive',
        })
        return
      }

      if (language === 'Other' && !otherLanguage.trim()) {
        toast({
          title: 'Error',
          description: 'Please specify your language.',
          variant: 'destructive',
        })
        return
      }

      const finalCountry = country === 'Other' ? otherCountry : country
      const finalLanguage = language === 'Other' ? otherLanguage : language

      const data = await savePreferences({
        country: finalCountry,
        language: finalLanguage,
        selectedPreferences,
        additionalInfo,
      })
      if ('error' in data) {
        toast({
          title: 'Error',
          description: 'Your preferences have been saved.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Your preferences have been saved.',
        })
        setPreferences(data.preferences)
        onSuccess?.()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'An unexpected error occur, please if this continues, talk to us.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-2xl mx-auto px-4 pb-8"
    >
      <header className="border-b py-4">
        <div className="flex justify-between items-center">
          {initialPreferences ? (
            <Button variant="ghost" onClick={onSuccess}>
              <ChevronLeft className="h-5 w-5 mr-2" />
              <span>Go back</span>
            </Button>
          ) : (
            <div />
          )}
          <SignOutButton redirectUrl="/">
            <Button variant="outline" type="button">
              Logout
            </Button>
          </SignOutButton>
        </div>
      </header>
      <div>
        <h2 className="text-2xl font-bold mb-4">Add your preferences</h2>
        <p className="text-muted-foreground mb-6">
          Let's get to know your preferences to provide better recommendations.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-1">
            Country
          </label>
          <Select onValueChange={handleCountryChange} value={country}>
            <SelectTrigger id="country">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {country === 'Other' && (
            <div className="mt-2">
              <Input
                placeholder="Enter your country"
                value={otherCountry}
                onChange={handleOtherCountryChange}
                maxLength={45}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {otherCountry.length}/45 characters
              </p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium mb-1">
            Preferred Language
          </label>
          <Select onValueChange={setLanguage} value={language}>
            <SelectTrigger id="language">
              <SelectValue placeholder="Select your language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {language === 'Other' && (
            <div className="mt-2">
              <Input
                placeholder="Enter your language"
                value={otherLanguage}
                onChange={handleOtherLanguageChange}
                maxLength={45}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {otherLanguage.length}/45 characters
              </p>
            </div>
          )}
        </div>
      </div>
      {Object.entries(preferences).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-2 capitalize">
            {category.replace(/([A-Z])/g, ' $1').trim()}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {items.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={item}
                  checked={selectedPreferences[category]?.[item] || false}
                  onCheckedChange={() => handlePreferenceChange(category, item)}
                />
                <label htmlFor={item} className="text-sm">
                  {item}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div>
        <label
          htmlFor="additionalInfo"
          className="block text-sm font-medium mb-1"
        >
          Additional Information (Max 400 characters)
        </label>
        <Textarea
          id="additionalInfo"
          placeholder="Any other preferences or information you'd like to share?"
          value={additionalInfo}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setAdditionalInfo(e.target.value.slice(0, 400))
          }
          className="h-32"
        />
        <p className="text-sm text-muted-foreground mt-1">
          {additionalInfo.length}/400 characters
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Preferences'}
      </Button>
    </form>
  )
}
