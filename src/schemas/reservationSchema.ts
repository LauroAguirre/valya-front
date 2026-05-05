import { z } from 'zod'
import { PropertyUnit } from './propertyUnitSchema'
import { Lead } from './leadSchema'
import { User } from './userSchema'
import { ConstructionCompany } from './constructionCompanySchema'

export enum ReservationStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  CONVERTED = 'CONVERTED',
}

export const reservationSchema = z.object({
  id: z.string().nullish(),
  unitId: z.string(),
  leadId: z.string().nullish(),
  agentId: z.string().nullish(),
  companyId: z.string().nullish(),
  status: z.enum(ReservationStatus).default(ReservationStatus.ACTIVE),
  reservedAt: z.date().default(new Date()),
  expiresAt: z.date().nullish(),
  notes: z.string().nullish(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().nullish(),
})

export type ReservationForm = z.infer<typeof reservationSchema>

export type Reservation = ReservationForm & {
  unit?: PropertyUnit
  lead?: Lead
  agent?: User
  company?: ConstructionCompany
}
