import { trackPromise } from 'react-promise-tracker'
import { AxiosError } from 'axios'
import api from '../api/backendApi'
import { AgentRegisterForm } from '@/schemas/agentRegisterSchema'
import { User } from '@/schemas/userSchema'

export type FieldError = { field: string; message: string }

type RegisterErrorBody = {
  success?: boolean
  error?: string
  message?: string
  details?: FieldError[]
}

export type RegisterAgentResult =
  | { success: true; token: string; user: User }
  | { success: false; message?: string; details?: FieldError[] }

// Etapa 1 — pré-cadastro público do corretor.
// Em caso de sucesso (201) devolve o token JWT que autoriza a etapa 2 (ativação).
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
      user: response.data.user,
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
