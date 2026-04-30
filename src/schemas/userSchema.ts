import { z } from 'zod'
import { cpf } from 'cpf-cnpj-validator'
import { Subscription } from './subscriptionSchema'
import { Lead } from './leadSchema'
import { Property } from './propertySchema'
import { AiConfig } from './aiConfigSchema'
import { EvolutionConfig } from './evolutionConfigSchema'
import { AsaasCustomer } from './asaasCustomerSchema'
import { PasswordReset } from './passwordResetSchema'
import { RealStateAgent } from './realStateAgentSchema'
import { ConstructionCompanyUsers } from './constructionCompanySchema'

export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
}

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.email({
    error: 'Informe um e-mail válido.',
  }),
  password: z.string(),
  cpf: z
    .string()
    .nullish()
    .refine(
      val => {
        if (!val || val.trim() === '') return true

        return cpf.isValid(val)
      },
      { message: 'CPF inválido.' },
    ),
  // creci: z.string().nullish(),
  role: z.enum(UserRole).default(UserRole.CLIENT),
  provider: z.enum(AuthProvider).default(AuthProvider.LOCAL),
  providerId: z.string().nullish(),
  phone: z
    .string({
      error: 'Informe seu telefone.',
    })
    .nullish(),
  // personalPhone: z.string('Informe seu telefone pessoal'),
  address: z.string().nullish(),
  avatarUrl: z.string().nullish(),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().nullish(),
})

export type UserForm = z.infer<typeof userSchema>

export type User = UserForm & {
  subscription?: Subscription
  properties: Property[]
  leads: Lead[]
  aiConfig?: AiConfig
  evolutionConfig?: EvolutionConfig
  asaasCustomer?: AsaasCustomer
  passwordResets?: PasswordReset[]
  realStateAgent?: RealStateAgent
  companyUsers?: ConstructionCompanyUsers[]
}
