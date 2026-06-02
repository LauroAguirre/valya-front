import { trackPromise } from 'react-promise-tracker'
import { AxiosError, AxiosResponse } from 'axios'
import api from '../api/backendApi'
import { Negotiation } from '@/schemas/negotiationSchema'
import { LeadOrigin } from '@/schemas/leadSchema'

interface CreateNegotiationBody {
  origin?: LeadOrigin
  title?: string
}

type CreateNegotiationResult =
  | { ok: true; negotiation: Negotiation }
  | { ok: false; message: string }

// POST /api/leads/:id/negotiations — abre uma NOVA negociação.
// Retorna 400 ({ success:false, message }) se já houver uma negociação OPEN.
export const createNegotiation = async (
  leadId: string,
  body: CreateNegotiationBody = {},
): Promise<CreateNegotiationResult> => {
  return trackPromise(
    api
      .post<Negotiation>(`/api/leads/${leadId}/negotiations`, body, {
        withCredentials: true,
      })
      .then(
        (res: AxiosResponse<Negotiation>): CreateNegotiationResult => ({
          ok: true,
          negotiation: res.data,
        }),
      )
      .catch((error: AxiosError<{ message?: string }>): CreateNegotiationResult => {
        console.error(error)
        return {
          ok: false,
          message:
            error.response?.data?.message ??
            'Não foi possível abrir a negociação. Tente novamente.',
        }
      }),
    'creatingNegotiation',
  )
}
