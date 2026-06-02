import { z } from 'zod'
import { LeadOrigin, LeadStage } from './leadSchema'
import { Property } from './propertySchema'

export enum NegotiationStatus {
  OPEN = 'OPEN',
  WON = 'WON',
  LOST = 'LOST',
}

export const negotiationPropertySchema = z.object({
  id: z.string(),
  propertyId: z.string(),
  interest: z.string().nullish(),
  createdAt: z.string(),
})

export type NegotiationPropertyForm = z.infer<typeof negotiationPropertySchema>

export type NegotiationProperty = NegotiationPropertyForm & {
  property: Pick<Property, 'id' | 'name'>
}

export const negotiationSchema = z.object({
  id: z.string(),
  leadId: z.string(),
  userId: z.string(),
  stage: z.enum(LeadStage).default(LeadStage.QUALIFICATION),
  status: z.enum(NegotiationStatus).default(NegotiationStatus.OPEN),
  origin: z.enum(LeadOrigin).nullish(),
  title: z.string().nullish(),
  notes: z.string().nullish(),
  closedAt: z.string().nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type NegotiationForm = z.infer<typeof negotiationSchema>

export type Negotiation = NegotiationForm & {
  properties: NegotiationProperty[]
}
