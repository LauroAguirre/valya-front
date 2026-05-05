import { z } from 'zod'
import { PropertyUnit } from './propertyUnitSchema'
import { Reservation } from './reservationSchema'
import { Lead } from './leadSchema'
import { User } from './userSchema'
import { ConstructionCompany } from './constructionCompanySchema'

export enum SaleStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export const saleSchema = z.object({
  id: z.string().nullish(),
  unitId: z.string(),
  reservationId: z.string().nullish(),
  leadId: z.string().nullish(),
  agentId: z.string().nullish(),
  companyId: z.string().nullish(),
  status: z.enum(SaleStatus).default(SaleStatus.PENDING),
  saleValue: z.coerce.number().nullish(),
  commissionRate: z.coerce.number().nullish(),
  commissionValue: z.coerce.number().nullish(),
  signedAt: z.date().nullish(),
  notes: z.string().nullish(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().nullish(),
})

export type SaleForm = z.infer<typeof saleSchema>

export type Sale = SaleForm & {
  unit?: PropertyUnit
  reservation?: Reservation
  lead?: Lead
  agent?: User
  company?: ConstructionCompany
  commissionAmount?: number | null
  revenueShareAmount?: number | null
  brokerAmount?: number | null
  rejectReason?: string | null
}
