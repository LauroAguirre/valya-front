import { z } from 'zod'
import { User } from './userSchema'
import { Subscription } from './subscriptionSchema'

export enum CompanyUserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STANDARD = 'STANDARD',
}

export const constructionCompanyUsersSchema = z.object({
  companyId: z.string(),
  userId: z.string(),
  role: z.enum(CompanyUserRole).default(CompanyUserRole.STANDARD),
  active: z.boolean().default(true),
})

export type ConstructionCompanyUsersForm = z.infer<typeof constructionCompanyUsersSchema>

export type ConstructionCompanyUsers = ConstructionCompanyUsersForm & {
  user?: User
}

export const constructionCompanySchema = z.object({
  id: z.string().nullish(),
  userId: z.string().nullish(),
  customPrompt: z.string().nullish(),
  responsibleName: z.string().nullish(),
  commissionRate: z.coerce.number().nullish(),
  monthlyFee: z.coerce.number().nullish(),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().nullish(),
})

export type ConstructionCompanyForm = z.infer<typeof constructionCompanySchema>

export type ConstructionCompany = ConstructionCompanyForm & {
  users?: ConstructionCompanyUsers[]
  subscription?: Subscription[]
}
