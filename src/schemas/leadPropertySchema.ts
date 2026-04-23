import { z } from 'zod'
import { Property } from './propertySchema'
import { Lead } from './leadSchema'

export const leadPropertySchema = z.object({
  id: z.string().nullish(),
  leadId: z.string().nullish(),
  propertyId: z.string().nullish(),
  interest: z.string().nullish(),
  createdAt: z.date().default(new Date()),
})

export type LeadPropertyForm = z.infer<typeof leadPropertySchema>

export type LeadProperty = LeadPropertyForm & {
  property: Property
  lead: Lead
}
