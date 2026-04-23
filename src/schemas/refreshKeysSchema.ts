import { z } from 'zod'

export const refreshKeysSchema = z.object({
  refreshId: z.string(),
  userId: z.string(),
  authExpires: z.date(),
  ip: z.string(),
  authToken: z.string(),
})

export type RefreshKeys = z.infer<typeof refreshKeysSchema>
