import { z } from 'zod'
import { User } from './userSchema'
import { Subscription } from './subscriptionSchema'

export const constructionCompanyUsersSchema = z.object({
  companyId: z.string(),
  userId: z.string(),
  active: z.boolean().default(true),
})

export type ConstructionCompanyUsers = z.infer<typeof constructionCompanySchema>

export const constructionCompanySchema = z.object({
  id: z.string().nullish(),
  userId: z.string().nullish(),
  customPrompt: z.string().nullish(),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().nullish(),
  // users: constructionCompanyUsersSchema.array(),
})

export type ConstructionCompanyForm = z.infer<typeof constructionCompanySchema>

export type ConstructionCompany = ConstructionCompanyForm & {
  users: User
  subscription: Subscription[]
}
