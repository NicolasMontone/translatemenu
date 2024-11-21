import { z } from 'zod'

export const menuItemSchema = z.object({
  name: z.string(),
  price: z.union([z.number(), z.literal('-')]),
  description: z.string(),
  recommended: z.boolean(),
  descriptionEnglish: z.string(),
  titleEnglish: z.string(),
})

export const menuSchema = z.object({
  isMenu: z.boolean(),
  menuItems: z.array(menuItemSchema),
})

export type Menu = z.infer<typeof menuSchema>
