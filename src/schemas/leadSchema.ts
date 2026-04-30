import { z } from 'zod'
import { Property } from './propertySchema'
import { User } from './userSchema'
import { Message } from './messageSchema'

export enum LeadOrigin {
  FACEBOOK,
  INSTAGRAM,
  TIKTOK,
  GOOGLE,
  WHATSAPP,
  OTHER,
}

export enum LeadStage {
  QUALIFICATION,
  CADENCE,
  VISITATION,
  PROPOSAL,
  CONTRACT,
  WIN,
  LOSS,
}

export const leadSchema = z.object({
  id: z.string().nullish(),
  userId: z.string().nullish(),
  name: z.string().nullish(),
  phone: z.string().nullish(),
  email: z.string().nullish(),
  origin: z.enum(LeadOrigin).default(LeadOrigin.WHATSAPP),
  stage: z.enum(LeadStage).default(LeadStage.QUALIFICATION),
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
  properties?: Property[]
}
