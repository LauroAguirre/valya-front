import { z } from 'zod'
import { User } from './userSchema'

export const metaConfigSchema = z.object({
  id: z.string().nullish(),
  userId: z.string().nullish(),
  phoneNumberId: z.string().nullish(),
  wabaId: z.string().nullish(),
  phone: z.string().nullish(),
  displayName: z.string().nullish(),
  connected: z.boolean().default(false),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().nullish(),
})

export const metaConfigInputSchema = z.object({
  phoneNumberId: z.string().min(1, 'Informe o ID do Número de Telefone.'),
  wabaId: z.string().min(1, 'Informe o ID da Conta WhatsApp Business.'),
  accessToken: z.string().min(1, 'Informe o Token de Acesso.'),
  verifyToken: z.string().min(1, 'Informe o Token de Verificação do Webhook.'),
  phone: z.string().nullish(),
  displayName: z.string().nullish(),
})

export type MetaConfigForm = z.infer<typeof metaConfigSchema>
export type MetaConfigInput = z.infer<typeof metaConfigInputSchema>

export type MetaConfig = MetaConfigForm & {
  user?: User
}
