import { z } from 'zod'
import { Property } from './propertySchema'

export const propertyAdLinkSchema = z.object({
  id: z.string().nullish(),
  propertyId: z.string().nullish(),
  platform: z.string().nullish(),
  adId: z.string().nullish(),
  url: z.string().nullish(),
  createdAt: z.date().default(new Date()),
})


export type PropertyAdLink = z.infer<typeof propertyAdLinkSchema> & {
  property: Property,
}