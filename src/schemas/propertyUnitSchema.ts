import { z } from 'zod'
import { Property } from './propertySchema'

export const propertyUnitSchema = z.object({
  id: z.string().nullish(),
  propertyId: z.string().nullish(),
  unitName: z.string().nullish(),
  bedrooms: z.number().nullish(),
  garage: z.number().nullish(),
  privateArea: z.number().nullish(),
  garageArea: z.number().nullish(),
  totalArea: z.number().nullish(),
  downPayment: z.number().nullish(),
  annualBoost: z.number().nullish(),
  installmentValue: z.number().nullish(),
  deletedAt:z.date().nullish()
})


export type PropertyUnit = z.infer<typeof propertyUnitSchema> & {
  property: Property,
}