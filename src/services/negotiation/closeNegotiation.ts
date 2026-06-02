import { trackPromise } from 'react-promise-tracker'
import { AxiosResponse } from 'axios'
import api from '../api/backendApi'
import { Negotiation } from '@/schemas/negotiationSchema'

type CloseOutcome = 'WON' | 'LOST'

// PATCH /api/negotiations/:id/close — fecha a negociação como ganha/perdida.
export const closeNegotiation = async (
  negotiationId: string,
  outcome: CloseOutcome,
  obs?: string,
) => {
  return trackPromise(
    api
      .patch<Negotiation>(
        `/api/negotiations/${negotiationId}/close`,
        { outcome, obs },
        { withCredentials: true },
      )
      .then((res: AxiosResponse<Negotiation>) => res.data)
      .catch(error => {
        console.error(error)
        return undefined
      }),
    'closingNegotiation',
  )
}
