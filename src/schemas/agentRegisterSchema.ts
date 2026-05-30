import { z } from 'zod'

// Etapa 1 do cadastro do corretor: dados + criação de senha + aceite dos termos.
// Espelha as regras de validação da rota pública POST /api/users/agent/register.
export const agentRegisterSchema = z
  .object({
    name: z.string().min(3, 'Informe o nome completo.'),
    email: z.email({ error: 'Informe um e-mail válido.' }),
    password: z
      .string()
      .min(8, 'A senha deve ter ao menos 8 caracteres.')
      .regex(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula.')
      .regex(/[a-z]/, 'A senha deve conter ao menos uma letra minúscula.')
      .regex(/[0-9]/, 'A senha deve conter ao menos um número.')
      .regex(
        /[^A-Za-z0-9]/,
        'A senha deve conter ao menos um caractere especial.',
      ),
    confirmPassword: z.string().min(1, 'Confirme a senha.'),
    creci: z
      .string()
      .min(1, 'CRECI é obrigatório.')
      .regex(/^\d+$/, 'O CRECI deve conter apenas números.'),
    uf: z.string().min(1, 'UF é obrigatória.'),
    cnpj: z.string().optional(),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: 'É necessário aceitar os termos de uso e políticas.',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não conferem.',
    path: ['confirmPassword'],
  })

export type AgentRegisterForm = z.infer<typeof agentRegisterSchema>
