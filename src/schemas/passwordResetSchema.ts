import { z } from 'zod'
import { User } from './userSchema'

export const passwordResetSchema = z.object({
  id: z.string().nullish(),
  userId: z.string().nullish(),
  code: z.string().nullish(),
  expiresAt: z.date(),
  used: z.boolean().default(false),
  createdAt: z.date().default(new Date()),
})

export type PasswordResetForm = z.infer<typeof passwordResetSchema>

export type PasswordReset = z.infer<typeof passwordResetSchema> & {
  user: User
}
