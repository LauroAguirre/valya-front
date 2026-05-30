import { z } from 'zod'
import { cpf, cnpj } from 'cpf-cnpj-validator'

// Formas de pagamento aceitas na ativação da assinatura (Asaas).
// CREDIT_CARD -> cobrança recorrente automática (coleta dados do cartão).
// UNDEFINED   -> cliente escolhe boleto/PIX a cada fatura (não coleta cartão).
export const AGENT_BILLING_TYPES = ['CREDIT_CARD', 'BOLETO'] as const
export type AgentBillingType = (typeof AGENT_BILLING_TYPES)[number]

const creditCardSchema = z.object({
  holderName: z.string().optional(),
  number: z.string().optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  ccv: z.string().optional(),
})

// Etapa 2 do cadastro: confirmação da assinatura + dados de pagamento.
// Espelha POST /api/users/agent/activate (autenticada com o token da etapa 1).
export const agentActivateSchema = z
  .object({
    cpfCnpj: z
      .string()
      .min(1, 'Informe o CPF ou CNPJ.')
      .refine(
        val => {
          const digits = val.replace(/\D/g, '')
          return cpf.isValid(digits) || cnpj.isValid(digits)
        },
        { message: 'CPF ou CNPJ inválido.' },
      ),
    phone: z.string().optional(),
    postalCode: z.string().optional(),
    address: z.string().optional(),
    addressNumber: z.string().optional(),
    billingType: z.enum(AGENT_BILLING_TYPES),
    creditCard: creditCardSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.billingType !== 'CREDIT_CARD') return

    const cc = data.creditCard
    const requireCard = (
      field: 'holderName' | 'number' | 'expiryMonth' | 'expiryYear' | 'ccv',
      message: string,
    ) => {
      if (!cc?.[field]?.trim()) {
        ctx.addIssue({ code: 'custom', message, path: ['creditCard', field] })
      }
    }

    requireCard('holderName', 'Informe o nome do titular.')
    requireCard('number', 'Informe o número do cartão.')
    requireCard('expiryMonth', 'Informe o mês de validade.')
    requireCard('expiryYear', 'Informe o ano de validade.')
    requireCard('ccv', 'Informe o código de segurança (CCV).')

    // Dados exigidos pela Asaas para o titular do cartão.
    if (!data.phone?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Informe o telefone.',
        path: ['phone'],
      })
    }
    if (!data.postalCode?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Informe o CEP.',
        path: ['postalCode'],
      })
    }
    if (!data.addressNumber?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Informe o número do endereço.',
        path: ['addressNumber'],
      })
    }
  })

export type AgentActivateForm = z.infer<typeof agentActivateSchema>
