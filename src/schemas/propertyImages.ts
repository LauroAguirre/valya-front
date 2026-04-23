import { z } from 'zod'
import { Property } from './propertySchema'

export const propertyImageSchema = z.object({
  id: z.string().nullish(),
  propertyId: z.string().nullish(),
  url: z.string().nullish(),
  description: z.string().nullish(),
  order: z.number().nullish(),
  createdAt: z.date().default(new Date()),
})

export type PropertyImage = z.infer<typeof propertyImageSchema> & {
  property?: Property
}
