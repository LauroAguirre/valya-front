import { z } from 'zod'
import { User } from './userSchema'

export const aiConfigSchema = z.object({
  id: z.string().nullish(),
  userId: z.string().nullish(),
  customPrompt: z.string().nullish(),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().nullish(),
})

export type AiConfigForm = z.infer<typeof aiConfigSchema>

export type AiConfig = AiConfigForm & {
  user: User
}
