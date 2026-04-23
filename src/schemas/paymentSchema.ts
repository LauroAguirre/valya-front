import { z } from 'zod'
import { Subscription } from './subscriptionSchema'

export enum PaymentStatus {
  PENDING,
  CONFIRMED,
  OVERDUE,
  REFUNDED,
  FAILED
}

export const paymentSchema = z.object({
  id: z.string().nullish(),
  subscriptionId: z.string().nullish(),
  asaasPaymentId: z.string().nullish(),
  amount: z.string().nullish(),
  status: z.enum(PaymentStatus).default(PaymentStatus.PENDING),
  paidAt: z.date().nullish(),
  dueDate: z.date().nullish(),
  createdAt: z.date().default(new Date()),

  
})

export type Payment = z.infer<typeof paymentSchema> & {
  subscription: Subscription,
}
