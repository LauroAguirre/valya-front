import { z } from 'zod'

export const profileSchema = z.object({
  id: z.string().nullish(),
  name: z.string().min(1, 'Nome é obrigatório.'),
  email: z.string().email('Informe um e-mail válido.'),
  phone: z.string().nullish(),
  creci: z.string().nullish(),
  uf: z.string().optional(),
  site: z.string().nullish(),
  city: z.string().nullish(),
  // agency: z.string().nullish(),
  // bio: z.string().nullish(),
})

export type ProfileForm = z.infer<typeof profileSchema>
