import { z } from 'zod'
import { User } from './userSchema'

export const evolutionConfigSchema = z.object({
  id: z.string().nullish(),
  userId: z.string().nullish(),
  instanceName: z.string().nullish(),
  instanceId: z.string().nullish(),
  qrCode: z.string().nullish(),
  connected: z.boolean().default(false),
  phone: z.string().nullish(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().nullish(),
})

export type EvolutionConfigForm = z.infer<typeof evolutionConfigSchema>

export type EvolutionConfig = EvolutionConfigForm & {
  user: User
}
