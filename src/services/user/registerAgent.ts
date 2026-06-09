import { trackPromise } from 'react-promise-tracker'
import { AxiosError } from 'axios'
import api from '../api/backendApi'
import { AgentRegisterForm } from '@/schemas/agentRegisterSchema'

export type FieldError = { field: string; message: string }

type RegisterErrorBody = {
  success?: boolean
  error?: string
  message?: string
  details?: FieldError[]
}

export type RegisterAgentResult =
  | { success: true; token: string }
  | { success: false; message?: string; details?: FieldError[] }

// Etapa 1 — validação pública dos dados do corretor.
// Nenhum usuário é criado aqui: o backend apenas valida os dados, guarda-os
// num storage temporário e devolve um token de escopo de registro (curta
// duração) que autoriza a etapa 2. A conta só é criada de forma atômica
// quando a assinatura é confirmada na ativação — assim não existe conta órfã
// capaz de fazer login sem assinatura.
export async function registerAgent(
  fields: AgentRegisterForm,
): Promise<RegisterAgentResult> {
  try {
    const response = await trackPromise(
      api.post('/api/user/agent/register', {
        name: fields.name,
        email: fields.email,
        password: fields.password,
        confirmPassword: fields.confirmPassword,
        creci: fields.creci,
        uf: fields.uf,
        cnpj: fields.cnpj?.trim() ? fields.cnpj : undefined,
        acceptTerms: fields.acceptTerms,
      }),
      'registerAgent',
    )

    return {
      success: true,
      token: response.data.token,
    }
  } catch (error) {
    const axiosError = error as AxiosError<RegisterErrorBody>
    const data = axiosError.response?.data

    return {
      success: false,
      message: data?.message || data?.error,
      details: data?.details,
    }
  }
}
