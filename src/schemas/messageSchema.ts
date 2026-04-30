import { z } from 'zod'
import { Lead } from './leadSchema'

export enum MessageSender {
  LEAD,
  AI,
  BROKER,
}

export enum IntentCategory {
  GREETING,
  GENERIC_INTEREST,
  INTEREST_WITH_FILTERS,
  REQUEST_FOR_OPTIONS,
  ANALYZING_SPECIFIC_PROPERTY,
  COMPARING_PROPERTIES,
  REQUEST_FOR_DETAILS,
  REQUEST_FOR_PHOTOS,
  REQUEST_FOR_SCHEDULING,
  FINANCIAL_QUESTION,
  NEGOTIATION,
  OTHER,
}

export const messageSchema = z.object({
  id: z.string().nullish(),
  leadId: z.string().nullish(),
  sender: z.enum(MessageSender),
  content: z.string().nullish(),
  mediaUrl: z.string().nullish(),
  intent: z.enum(IntentCategory).nullish(),
  createdAt: z.date().default(new Date()),
})

export type Message = z.infer<typeof messageSchema> & {
  lead?: Lead
}

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Digite uma mensagem.'),
})

export type SendMessageForm = z.infer<typeof sendMessageSchema>
