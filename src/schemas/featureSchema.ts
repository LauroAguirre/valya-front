import { z } from 'zod'
import { User } from './userSchema'

export const featureSchema = z.object({
  id: z.string().nullish(),
  userId: z.string().nullish(),
  creci: z.string().nullish(),
  comercialPhone: z.string().nullish(),
  cnpj: z.string().nullish(),
  site: z.string().nullish(),
})

export type FeatureForm = z.infer<typeof featureSchema>

export type Feature = FeatureForm & {
  user: User
}
