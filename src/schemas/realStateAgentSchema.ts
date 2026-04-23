import { z } from 'zod'
import { User } from './userSchema'
import { Subscription } from './subscriptionSchema'

export const realStateAgentSchema = z.object({
  id: z.string().nullish(),
  userId: z.string().nullish(),
  creci: z.string().nullish(),
  comercialPhone: z.string().nullish(),
  cnpj: z.string().nullish(),
  site: z.string().nullish(),
  // planId: z.string().nullish(),
})

export type RealStateAgentForm = z.infer<typeof realStateAgentSchema>

export type RealStateAgent = RealStateAgentForm & {
  user: User
  subscriptions: Subscription[]
  // plans: RealStateAgentPlanHistory[]
}
