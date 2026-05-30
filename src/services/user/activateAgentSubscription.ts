import { trackPromise } from 'react-promise-tracker'
import { AxiosError } from 'axios'
import api from '../api/backendApi'
import { FieldError } from './registerAgent'

export type ActivateAgentPayload = {
  cpfCnpj: string
  phone?: string
  postalCode?: string
  address?: string
  addressNumber?: string
  billingType: 'CREDIT_CARD' | 'UNDEFINED'
  creditCard?: {
    holderName: string
    number: string
    expiryMonth: string
    expiryYear: string
    ccv: string
  }
  creditCardHolderInfo?: {
    name: string
    email: string
    cpfCnpj: string
    postalCode: string
    addressNumber: string
    phone: string
  }
}

type ActivateErrorBody = {
  success?: boolean
  error?: string
  message?: string
  details?: FieldError[]
}

export type ActivateAgentResult =
  | { success: true; message: string }
  | {
      success: false
      status?: number
      message?: string
      details?: FieldError[]
    }

// Etapa 2 — ativa a assinatura recorrente na Asaas.
// Autenticada com o token JWT da etapa 1 (ainda não persistido em cookie),
// por isso o header Authorization é informado explicitamente nesta chamada.
// A assinatura nasce PENDENTE e só é confirmada via webhook de pagamento.
export async function activateAgentSubscription(
  payload: ActivateAgentPayload,
  token: string,
): Promise<ActivateAgentResult> {
  try {
    const response = await trackPromise(
      api.post('/api/user/agent/activate', payload, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      'activateAgent',
    )

    return {
      success: true,
      message:
        response.data?.message ||
        'Assinatura criada com sucesso. Aguardando confirmação do pagamento.',
    }
  } catch (error) {
    const axiosError = error as AxiosError<ActivateErrorBody>
    const data = axiosError.response?.data

    return {
      success: false,
      status: axiosError.response?.status,
      message: data?.message || data?.error,
      details: data?.details,
    }
  }
}
