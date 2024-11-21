import { z } from 'zod'

export const menuSchema = z.object({
  isMenu: z.boolean(),
  menuItems: z.array(
    z.object({
      name: z.string().describe('The name of the dish'),
      price: z.string().or(z.number()).describe('').optional(),
      description: z.string().describe('The description of the dish'),
      recommended: z.boolean().describe('Whether the dish is recommended'),
    })
  ),
})

export type Menu = z.infer<typeof menuSchema>
