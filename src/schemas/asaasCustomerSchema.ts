import { z } from 'zod'
import { User } from './userSchema'

export const asaasCustomerSchema = z.object({
  id: z.string().nullish(),
  userId: z.string().nullish(),
  asaasCustomerId: z.string().nullish(),
  cpfCnpj: z.string().nullish(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  postalCode: z.string().nullish(),
  street: z.string().nullish(),
  address: z.string().nullish(),
  addressNumber: z.string().nullish(),
})

export type AsaasCustomerForm = z.infer<typeof asaasCustomerSchema>

export type AsaasCustomer = AsaasCustomerForm & {
  user: User
}
