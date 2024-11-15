import { z } from 'zod'

export const preferencesSchema = z.object({
  country: z.string().max(45),
  language: z.string().max(45),
  selectedPreferences: z.any().optional(),
  additionalInfo: z.string().max(400).optional(),
})

export type Preferences = z.infer<typeof preferencesSchema>
