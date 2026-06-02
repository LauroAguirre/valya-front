import { z } from 'zod'
import { User } from './userSchema'
import { Message } from './messageSchema'
import type { Negotiation } from './negotiationSchema'

export enum LeadOrigin {
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  GOOGLE = 'GOOGLE',
  WHATSAPP = 'WHATSAPP',
  OTHER = 'OTHER',
}

export enum LeadStage {
  QUALIFICATION = 'QUALIFICATION',
  CADENCE = 'CADENCE',
  VISITATION = 'VISITATION',
  PROPOSAL = 'PROPOSAL',
  CONTRACT = 'CONTRACT',
  WIN = 'WIN',
  LOSS = 'LOSS',
}

export const leadSchema = z.object({
  id: z.string().nullish(),
  userId: z.string().nullish(),
  name: z.string().nullish(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  origin: z.enum(LeadOrigin).default(LeadOrigin.WHATSAPP),
  aiEnabled: z.boolean().default(true),
  notes: z.string().nullish(),
  lastReplyAt: z.date().nullish(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().nullish(),
})

export type LeadForm = z.infer<typeof leadSchema>

export type Lead = LeadForm & {
  user?: User
  messages?: Message[]
  // A etapa do funil e os imóveis de interesse vivem na NEGOCIAÇÃO agora.
  // `activeNegotiation` é a negociação OPEN (ou null se o lead não tem nenhuma).
  // `negotiations` (preenchido no detalhe) traz ativa + histórico de fechadas.
  activeNegotiation?: Negotiation | null
  negotiations?: Negotiation[]
}
