import { z } from 'zod'
import { Payment } from './paymentSchema'
import { RealStateAgent } from './realStateAgentSchema'
import { ConstructionCompany } from './constructionCompanySchema'
import { Plan } from './planSchema'

export enum SubscriptionStatus {
  TRIAL,
  ACTIVE,
  EXPIRED,
  CANCELLED,
}

export const subscriptionSchema = z.object({
  id: z.string().nullish(),
  agentId: z.string().nullish(),
  companyId: z.string().nullish(),
  status: z.enum(SubscriptionStatus).default(SubscriptionStatus.TRIAL),
  startDate: z.date(),
  planId: z.string().nullish(),
  expiresAt: z.date().nullish(),
  asaasSubId: z.string().nullish(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date(),
})

export type SubscriptionForm = z.infer<typeof subscriptionSchema>

export type Subscription = SubscriptionForm & {
  agent: RealStateAgent
  company: ConstructionCompany
  payments: Payment[]
  plan: Plan
}
