import { z } from 'zod'
import { User } from './userSchema'
import { PropertyUnit } from './propertyUnitSchema'
import { PropertyImage } from './propertyImages'
import { PropertyAdLink } from './propertyAdLinkSchema'
import { LeadProperty } from './leadPropertySchema'

export enum GarageType {
  NONE = 'NONE',
  COVERED = 'COVERED',
  UNCOVERED = 'UNCOVERED',
  MIXED = 'MIXED',
}

export enum BbqType {
  NONE = 'NONE',
  COAL = 'COAL',
  ELETRIC = 'ELETRIC',
}

export enum PropertyMode {
  SINGLE = 'SINGLE',
  MULTIPLE = 'MULTIPLE',
}

export const propertySchema = z.object({
  id: z.string().nullish(),
  userId: z.string().nullish(),
  name: z.string().nullish(),
  address: z.string().nullish(),
  bedrooms: z.number().nullish(),
  garageCount: z.number().nullish(),
  garageType: z.enum(GarageType).nullish(),
  bathrooms: z.number().nullish(),
  bbqType: z
    .enum(BbqType)
    .default(BbqType.NONE)
    .refine(
      val => [BbqType.NONE, BbqType.COAL, BbqType.ELETRIC].includes(val),
      { message: 'Informe o tipo de churrasqueira' },
    ),
  description: z.string().nullish(),
  privateArea: z.number().nullish(),
  mode: z.enum(PropertyMode).default(PropertyMode.SINGLE),
  purpose: z.string().nullish(),
  type: z.string().nullish(),
  neighborhood: z.string().nullish(),
  city: z.string().nullish(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().nullish(),
  deletedAt: z.date().nullish(),
  totalPrice: z.number().nullish(),
  minDown: z.number().nullish(),
  installments: z.number().nullish(),
  annualBoost: z.number().nullish(),
  installmentValue: z.number().nullish(),
  paymentConditions: z.string().nullish(),
  paymentOptions: z.string().nullish(),
})

export type PropertyForm = z.infer<typeof propertySchema>

export type Property = PropertyForm & {
  user: User
  units: PropertyUnit[]
  images: PropertyImage[]
  adLinks: PropertyAdLink[]
  leadProperties: LeadProperty[]
}
