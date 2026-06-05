import { z } from 'zod'
import { Lead } from './leadSchema'

export const MessageSender = z.enum(['LEAD', 'AI', 'BROKER'])
export type MessageSender = z.infer<typeof MessageSender>

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

export const MessageChannel = z.enum(['EVOLUTION', 'META'])
export type MessageChannel = z.infer<typeof MessageChannel>

export const messageSchema = z.object({
  id: z.string().nullish(),
  leadId: z.string().nullish(),
  // Negociação a que a mensagem pertence. A thread do WhatsApp continua única
  // por lead; null em mensagens legadas sem atribuição de negociação.
  negotiationId: z.string().nullish(),
  sender: MessageSender,
  content: z.string().nullish(),
  mediaUrl: z.string().nullish(),
  intent: z.enum(IntentCategory).nullish(),
  channel: MessageChannel.default('EVOLUTION'),
  metaMessageId: z.string().nullish(),
  evolutionMessageId: z.string().nullish(),
  createdAt: z.date().default(new Date()),
})

export type Message = z.infer<typeof messageSchema> & {
  lead?: Lead
}

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Digite uma mensagem.'),
})

export type SendMessageForm = z.infer<typeof sendMessageSchema>
