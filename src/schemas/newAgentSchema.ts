import { z } from 'zod'
import { cpf, cnpj } from 'cpf-cnpj-validator'

export const newAgentSchema = z.object({
  name: z.string().min(3, 'Informe o nome completo.'),
  phone: z.string().min(10, 'Informe o telefone.'),
  email: z.string().email('Informe um e-mail válido.'),
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
})

export type NewAgentForm = z.infer<typeof newAgentSchema>
