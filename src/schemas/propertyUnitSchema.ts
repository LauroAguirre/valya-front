import { z } from 'zod'
import { Property } from './propertySchema'

export enum PropertyUnitStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  CONTRACT_SIGNING = 'CONTRACT_SIGNING',
  SOLD = 'SOLD',
}

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
  status: z.enum(PropertyUnitStatus).default(PropertyUnitStatus.AVAILABLE),
  deletedAt: z.date().nullish(),
})

export type PropertyUnitForm = z.infer<typeof propertyUnitSchema>

export type PropertyUnit = PropertyUnitForm & {
  property: Property
  activeReservation?: {
    id: string
    status: string
    expiresAt?: Date | string | null
    reservedAt?: Date | string | null
  } | null
}
