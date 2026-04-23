import { z } from 'zod'
import { Feature } from './featureSchema'
import { Subscription } from './subscriptionSchema'

export const planFeatureSchema = z.object({
  planId: z.string().nullish(),
  featureId: z.string().nullish(),
})

export type PlanFeatureForm = z.infer<typeof planFeatureSchema>

export type PlanFeature = PlanFeatureForm & {
  feature: Feature
}

export const planSchema = z.object({
  id: z.string().nullish(),
  name: z.string().nullish(),
  value: z.number().default(0),
})

export type PlanForm = z.infer<typeof planSchema>

export type Plan = PlanForm & {
  features: PlanFeature[]
  subscriptions: Subscription[]
}
